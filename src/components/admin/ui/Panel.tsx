import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  bodyClassName?: string;
}

export default function Panel({
  children,
  className = '',
  title,
  subtitle,
  action,
  bodyClassName = '',
}: PanelProps) {
  return (
    <section
      className={`rounded-xl border border-background-800 bg-background-900/50 backdrop-blur-sm ${className}`}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-background-800 px-5 py-4">
          <div>
            {title && (
              <h3 className="font-heading text-lg text-foreground-50 leading-tight">{title}</h3>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-foreground-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}