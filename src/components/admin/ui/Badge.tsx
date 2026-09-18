import type { ReactNode } from 'react';

export type BadgeTone = 'positive' | 'neutral' | 'negative' | 'brand' | 'accent';

const TONE_CLASSES: Record<BadgeTone, string> = {
  positive: 'bg-accent-500/15 text-accent-200 border-accent-500/30',
  accent: 'bg-secondary-500/15 text-secondary-200 border-secondary-500/30',
  neutral: 'bg-background-700/50 text-foreground-300 border-background-600',
  negative: 'bg-primary-500/15 text-primary-200 border-primary-500/30',
  brand: 'bg-primary-500 text-foreground-50 border-primary-500',
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  dot?: boolean;
}

export default function Badge({ children, tone = 'neutral', className = '', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function toneForStatus(status: string): BadgeTone {
  const value = status.toLowerCase();
  if (['paid', 'published', 'active', 'shipped', 'delivered', 'icon'].includes(value)) {
    return 'positive';
  }
  if (['pending', 'scheduled', 'draft', 'new', 'silver'].includes(value)) return 'neutral';
  if (['refunded', 'cancelled', 'expired', 'hidden', 'out of stock'].includes(value)) {
    return 'negative';
  }
  if (['gold'].includes(value)) return 'accent';
  return 'neutral';
}