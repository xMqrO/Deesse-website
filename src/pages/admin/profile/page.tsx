import { useSocials } from '@/context/SocialContext';
import Panel from '@/components/admin/ui/Panel';
import Badge from '@/components/admin/ui/Badge';

const inputClass =
  'w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60 transition-colors';

export default function AdminProfile() {
  const { socials, updateSocial, toggleSocial, resetSocials } = useSocials();

  const enabledCount = socials.filter((s) => s.enabled).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        {[
          { label: 'Enabled links', value: enabledCount, icon: 'ri-links-line' },
          { label: 'Total platforms', value: socials.length, icon: 'ri-global-line' },
          { label: 'Hidden links', value: socials.length - enabledCount, icon: 'ri-eye-off-line' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-background-800 bg-background-900/50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">{s.label}</p>
              <i className={`${s.icon} text-lg text-primary-400`} />
            </div>
            <p className="mt-2 font-heading text-3xl text-foreground-50">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Social links */}
      <Panel
        title="Social links"
        subtitle="Edit the third-party profiles shown across the storefront"
        action={
          <button
            type="button"
            onClick={resetSocials}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-background-700 px-4 py-2 text-sm text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
          >
            <i className="ri-restart-line" /> Reset to defaults
          </button>
        }
      >
        <div className="space-y-3">
          {socials.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-4 rounded-xl border border-background-800 bg-background-950 p-4 sm:flex-row sm:items-center"
            >
              {/* Identity */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-800 text-foreground-200">
                  <i className={`${s.icon} text-lg`} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground-50">{s.label}</p>
                  <div className="mt-1">
                    <Badge tone={s.enabled ? 'positive' : 'neutral'}>
                      {s.enabled ? 'Visible' : 'Hidden'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* URL */}
              <div className="w-full sm:max-w-sm">
                <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">
                  URL
                </label>
                <input
                  type="url"
                  value={s.url}
                  onChange={(e) => updateSocial(s.id, { url: e.target.value })}
                  placeholder={`https://… ${s.label.toLowerCase()}`}
                  className={`mt-2 ${inputClass}`}
                />
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs uppercase tracking-[0.15em] text-foreground-500 sm:hidden">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSocial(s.id)}
                    role="switch"
                    aria-checked={s.enabled}
                    aria-label={`Toggle ${s.label}`}
                    className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                      s.enabled ? 'bg-primary-500' : 'bg-background-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground-50 transition-transform ${
                        s.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="whitespace-nowrap text-sm text-foreground-400">
                    {s.enabled ? 'Enable' : 'Disable'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-foreground-500 leading-relaxed">
          Disabled links disappear from the storefront footer immediately. Enabled links appear as
          clickable icons that open the profile in a new tab.
        </p>
      </Panel>
    </div>
  );
}