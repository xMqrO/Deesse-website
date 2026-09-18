import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/feature/ProductCard';
import { products, categories } from '@/mocks/products';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';
  const tag = searchParams.get('tag') || '';
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (tag) {
      list = list.filter((p) => p.tags.includes(tag));
    } else if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, tag, sort]);

  const setCategory = (c: string) => {
    const params = new URLSearchParams();
    if (c !== 'All') params.set('category', c);
    setSearchParams(params);
  };

  return (
    <div className="pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent-300">The Collection</p>
          <h1 className="mt-3 font-heading text-4xl md:text-6xl text-foreground-50 leading-tight">
            {tag ? tag : category === 'All' ? 'All Products' : category}
          </h1>
          <p className="mt-3 text-sm text-foreground-400">
            {filtered.length} {filtered.length === 1 ? 'treasure' : 'treasures'}
          </p>
        </div>

        {/* Filters */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                  (!tag && category === c) || (c === 'All' && !tag && category === 'All')
                    ? 'bg-primary-500 text-foreground-50'
                    : 'border border-background-700 text-foreground-300 hover:border-foreground-300 hover:text-foreground-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-background-700 px-4 py-2 text-xs uppercase tracking-[0.15em] text-foreground-200 hover:border-foreground-300 transition-colors cursor-pointer"
            >
              <i className="ri-arrow-up-down-line" />
              {sortOptions.find((s) => s.value === sort)?.label}
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-background-700 bg-background-900 shadow-xl animate-scale-in">
                  {sortOptions.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => {
                        setSort(s.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                        sort === s.value
                          ? 'bg-background-800 text-foreground-50'
                          : 'text-foreground-300 hover:bg-background-800/60 hover:text-foreground-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="font-heading text-2xl text-foreground-300">Nothing here yet</p>
            <p className="mt-2 text-sm text-foreground-500">
              Try another category — or explore everything we craft.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}