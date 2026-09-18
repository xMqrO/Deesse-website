import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 py-10">
      <div className="fixed inset-0 bg-background-950/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative w-full ${SIZES[size]} animate-scale-in rounded-xl border border-background-700 bg-background-900 shadow-2xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-background-800 px-6 py-4">
          <div>
            {title && (
              <h2 className="font-heading text-xl text-foreground-50 leading-tight">{title}</h2>
            )}
            {subtitle && <p className="mt-0.5 text-sm text-foreground-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-background-700 text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </header>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-3 border-t border-background-800 px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}