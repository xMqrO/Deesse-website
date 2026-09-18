import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorefrontProducts } from '@/context/ProductContext';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const products = useStorefrontProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(id);
        document.body.style.overflow = '';
      };
    }
    document.body.style.overflow = '';
    return undefined;
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.tags.join(' ').toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, products]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-400 ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-background-950/85 backdrop-blur-xl" onClick={onClose} />
      <div className="relative mx-auto max-w-4xl px-4 pt-24 md:px-6 md:pt-32">
        <div className="flex items-center gap-3 border-b border-background-700 pb-4">
          <i className="ri-search-line text-2xl text-foreground-300" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lipsticks, serums, fragrance…"
            className="flex-1 bg-transparent font-heading text-2xl text-foreground-50 placeholder:text-foreground-600 outline-none md:text-3xl"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-background-700 text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-foreground-500">
          {query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Most loved'}
        </p>

        <div className="mt-4 grid max-h-[52vh] grid-cols-1 gap-3 overflow-y-auto pb-6 sm:grid-cols-2">
          {results.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              onClick={onClose}
              className="group flex items-center gap-4 rounded-lg border border-background-800 bg-background-900/50 p-3 transition-colors hover:border-primary-500/50 cursor-pointer"
            >
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-md bg-background-900">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-500">
                  {p.category}
                </p>
                <p className="truncate font-heading text-lg text-foreground-50">{p.name}</p>
                <p className="text-sm text-foreground-400">${p.price}</p>
              </div>
            </Link>
          ))}
          {results.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-foreground-400">
              Nothing matched &ldquo;{query}&rdquo; — try another word.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}