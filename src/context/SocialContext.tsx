import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface SocialLink {
  id: string;
  label: string;
  icon: string;
  url: string;
  enabled: boolean;
}

interface SocialContextValue {
  socials: SocialLink[];
  updateSocial: (id: string, patch: Partial<Omit<SocialLink, 'id' | 'label' | 'icon'>>) => void;
  toggleSocial: (id: string) => void;
  resetSocials: () => void;
}

const SocialContext = createContext<SocialContextValue | null>(null);

const STORAGE_KEY = 'deesse-socials';

const DEFAULT_SOCIALS: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'ri-instagram-line',
    url: 'https://instagram.com/deesse',
    enabled: true,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'ri-tiktok-line',
    url: 'https://tiktok.com/@deesse',
    enabled: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: 'ri-youtube-line',
    url: 'https://youtube.com/@deesse',
    enabled: true,
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    icon: 'ri-pinterest-line',
    url: 'https://pinterest.com/deesse',
    enabled: true,
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: 'ri-discord-line',
    url: 'https://discord.gg/deesse',
    enabled: true,
  },
];

export function SocialProvider({ children }: { children: ReactNode }) {
  const [socials, setSocials] = useState<SocialLink[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SOCIALS;
      const parsed = JSON.parse(raw) as SocialLink[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SOCIALS;
    } catch {
      return DEFAULT_SOCIALS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socials));
    } catch {
      /* ignore quota errors */
    }
  }, [socials]);

  const updateSocial = (id: string, patch: Partial<Omit<SocialLink, 'id' | 'label' | 'icon'>>) => {
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const toggleSocial = (id: string) => {
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const resetSocials = () => setSocials(DEFAULT_SOCIALS);

  const value: SocialContextValue = {
    socials,
    updateSocial,
    toggleSocial,
    resetSocials,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocials() {
  const ctx = useContext(SocialContext);
  if (!ctx) {
    throw new Error('useSocials must be used within a SocialProvider');
  }
  return ctx;
}