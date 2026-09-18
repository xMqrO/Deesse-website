import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: ReactNode;
  change?: number;
  icon: string;
  footer?: string;
  accent?: 'primary' | 'accent' | 'secondary';
}

const ACCENT_RING: Record<string, string> = {
  primary: 'bg-primary-500/15 text-primary-300',
  accent: 'bg-accent-500/15 text-accent-300',
  secondary: 'bg-secondary-500/15 text-secondary-200',
};

export default function StatCard({
  label,
  value,
  change,
  icon,
  footer,
  accent = 'primary',
}: StatCardProps) {
  const positive = (change ?? 0) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-background-800 bg-background-900/50 p-5 transition-colors duration-300 hover:border-background-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">{label}</p>
          <p className="mt-2 font-heading text-3xl text-foreground-50 leading-none">{value}</p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ACCENT_RING[accent]}`}
        >
          <i className={`${icon} text-xl`} />
        </span>
      </div>

      {typeof change === 'number' && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
              positive
                ? 'bg-accent-500/15 text-accent-300'
                : 'bg-primary-500/15 text-primary-300'
            }`}
          >
            <i className={positive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} />
            {Math.abs(change)}%
          </span>
          <span className="text-foreground-500">vs last month</span>
        </div>
      )}

      {footer && <p className="mt-4 text-xs text-foreground-500">{footer}</p>}
    </div>
  );
}