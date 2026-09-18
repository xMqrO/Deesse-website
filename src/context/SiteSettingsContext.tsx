import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'deesse-site-settings';

export interface SiteSettings {
  linkPreviewTitle: string;
  linkPreviewDescription: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  linkPreviewTitle: 'déesse | Luxury Beauty, Skincare & Fragrance',
  linkPreviewDescription:
    'déesse is a luxury beauty maison offering high-end cosmetics, radiant skincare, and rare fragrances. Experience cinematic elegance, refined formulas, and indulgent rituals crafted for modern icons.',
};

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SITE_SETTINGS, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_SITE_SETTINGS;
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function applyToDocument(settings: SiteSettings) {
  const title = settings.linkPreviewTitle || DEFAULT_SITE_SETTINGS.linkPreviewTitle;
  const description =
    settings.linkPreviewDescription || DEFAULT_SITE_SETTINGS.linkPreviewDescription;
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    applyToDocument(settings);
  }, [settings]);

  const updateSettings = (patch: Partial<SiteSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));
  const resetSettings = () => setSettings(DEFAULT_SITE_SETTINGS);

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings]
  );

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return ctx;
}
