import { useMemo, useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import ProductForm from '@/components/admin/ProductForm';
import { useProducts } from '@/context/ProductContext';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '@/context/SiteSettingsContext';
import {
  normalizeProduct,
  slugify,
  type Product,
  type ProductStatus,
} from '@/mocks/products';

const emptyDraft = (defaultCategory: string): Product => ({
  id: '',
  name: '',
  category: defaultCategory,
  price: 0,
  compareAtPrice: undefined,
  image: '',
  images: [],
  tagline: '',
  description: '',
  rating: 5,
  reviews: 0,
  shades: undefined,
  tags: [],
  stock: 10,
  sku: '',
  status: 'Active',
  featured: false,
  linkPreviewDescription: '',
});

const inputClass =
  'rounded-lg border border-background-800 bg-background-900 px-3 py-2.5 text-sm text-foreground-200 outline-none focus:border-primary-500/60 cursor-pointer';

export default function AdminProducts() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    resetProducts,
    addCategory,
    renameCategory,
    deleteCategory,
  } = useProducts();
  const { settings, updateSettings, resetSettings } = useSiteSettings();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Product>(() => emptyDraft(categories[0] ?? 'Skincare'));
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [catValue, setCatValue] = useState('');

  const [preview, setPreview] = useState(settings);
  const [previewSaved, setPreviewSaved] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(
      (r) =>
        (category === 'All' || r.category === category) &&
        (q === '' ||
          r.name.toLowerCase().includes(q) ||
          r.id.includes(q) ||
          r.tags.join(' ').toLowerCase().includes(q))
    );
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'stock') return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [products, query, category, sort]);

  const applyDraft = (patch: Partial<Product>) => {
    setDraft((prev) => {
      const merged: Product = { ...prev, ...patch };
      merged.images = merged.images ?? [];
      merged.image = merged.images[0] ?? '';
      return merged;
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft(categories[0] ?? 'Skincare'));
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setDraft({ ...product, images: [...product.images] });
    setModalOpen(true);
  };

  const save = () => {
    if (!draft.name.trim()) {
      setDraft((prev) => ({ ...prev, name: prev.name || 'Untitled product' }));
      return;
    }
    if (editingId) {
      let nextId = draft.id.trim() || slugify(draft.name);
      if (nextId !== editingId && products.some((p) => p.id === nextId)) {
        let n = 1;
        const base = nextId;
        while (products.some((p) => p.id === nextId && p.id !== editingId)) {
          nextId = `${base}-${n}`;
          n += 1;
        }
      }
      updateProduct(editingId, { ...draft, id: nextId });
    } else {
      const base = draft.id.trim() || slugify(draft.name);
      let nextId = base;
      let n = 1;
      while (products.some((p) => p.id === nextId)) {
        nextId = `${base}-${n}`;
        n += 1;
      }
      addProduct({ ...draft, id: nextId });
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const savePreview = () => {
    updateSettings(preview);
    setPreviewSaved(true);
    setTimeout(() => setPreviewSaved(false), 2000);
  };

  const activeCount = products.filter((p) => p.status === 'Active').length;
  const draftCount = products.filter((p) => p.status === 'Draft').length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="space-y-6">
      {/* Summaries */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
        {[
          { label: 'Total products', value: products.length, icon: 'ri-shopping-bag-3-line' },
          { label: 'Active', value: activeCount, icon: 'ri-checkbox-circle-line' },
          { label: 'Drafts', value: draftCount, icon: 'ri-draft-line' },
          { label: 'Low stock', value: lowStock, icon: 'ri-alert-line' },
          {
            label: 'Out of stock',
            value: products.filter((p) => p.status === 'Out of Stock' || p.stock === 0).length,
            icon: 'ri-close-circle-line',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-background-800 bg-background-900/50 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">{s.label}</p>
              <i className={`${s.icon} text-lg text-primary-400`} />
            </div>
            <p className="mt-2 font-heading text-3xl text-foreground-50">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Link preview */}
      <Panel
        title="Link preview description"
        subtitle="Shown when the website URL is shared on Discord, WhatsApp, iMessage and social platforms."
        action={
          <div className="flex items-center gap-2">
            {previewSaved && <span className="text-xs text-accent-300">Saved</span>}
            <button
              type="button"
              onClick={() => {
                setPreview(DEFAULT_SITE_SETTINGS);
                resetSettings();
              }}
              className="rounded-lg border border-background-700 px-3 py-2 text-xs text-foreground-300 hover:border-foreground-400 transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={savePreview}
              className="rounded-lg bg-primary-500 px-4 py-2 text-xs font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Save preview
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">
                Preview title
              </label>
              <input
                value={preview.linkPreviewTitle}
                onChange={(e) =>
                  setPreview((prev) => ({ ...prev, linkPreviewTitle: e.target.value }))
                }
                className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">
                Preview description
              </label>
              <textarea
                value={preview.linkPreviewDescription}
                onChange={(e) =>
                  setPreview((prev) => ({ ...prev, linkPreviewDescription: e.target.value }))
                }
                rows={4}
                className="mt-2 w-full resize-y rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm leading-relaxed text-foreground-100 outline-none focus:border-primary-500/60"
              />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">
              Live preview
            </p>
            <div className="mt-2 overflow-hidden rounded-xl border border-background-700 bg-background-800">
              <div className="h-32 w-full bg-gradient-to-br from-primary-700/60 via-background-800 to-accent-700/40" />
              <div className="space-y-1.5 border-t border-background-700 p-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground-500">
                  deesse.com
                </p>
                <p className="font-heading text-lg text-foreground-50">
                  {preview.linkPreviewTitle || DEFAULT_SITE_SETTINGS.linkPreviewTitle}
                </p>
                <p className="text-sm text-foreground-400 line-clamp-3">
                  {preview.linkPreviewDescription || DEFAULT_SITE_SETTINGS.linkPreviewDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Categories */}
      <Panel
        title="Categories"
        subtitle="Rename, add, or remove the categories customers can browse."
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCategory(newCategory);
                setNewCategory('');
              }
            }}
            placeholder="New category name"
            className="flex-1 rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
          />
          <button
            type="button"
            onClick={() => {
              addCategory(newCategory);
              setNewCategory('');
            }}
            className="whitespace-nowrap rounded-lg border border-background-700 px-4 py-2.5 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
          >
            Add category
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {categories.map((c) => (
            <li
              key={c}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-background-800 bg-background-950/50 px-3 py-2"
            >
              {editingCat === c ? (
                <>
                  <input
                    value={catValue}
                    autoFocus
                    onChange={(e) => setCatValue(e.target.value)}
                    className="flex-1 rounded-md border border-background-700 bg-background-950 px-3 py-1.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      renameCategory(c, catValue);
                      setEditingCat(null);
                    }}
                    className="rounded-md bg-primary-500 px-3 py-1.5 text-xs text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCat(null)}
                    className="rounded-md border border-background-700 px-3 py-1.5 text-xs text-foreground-300 hover:border-foreground-400 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-foreground-200">{c}</span>
                  <span className="text-xs text-foreground-600">
                    {products.filter((p) => p.category === c).length} products
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(c);
                      setCatValue(c);
                    }}
                    className="rounded-md border border-background-700 px-3 py-1.5 text-xs text-foreground-300 hover:border-foreground-400 transition-colors cursor-pointer"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCategory(c)}
                    className="rounded-md border border-background-700 px-3 py-1.5 text-xs text-primary-200 hover:border-primary-400 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </Panel>

      {/* Products */}
      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-background-800 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-lg border border-background-800 bg-background-900/60 py-2.5 pl-9 pr-4 text-sm text-foreground-100 placeholder:text-foreground-600 outline-none focus:border-primary-500/60 transition-colors"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            aria-label="Filter by category"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className={inputClass}
            aria-label="Sort products"
          >
            <option value="name">Name (A–Z)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Stock: Low to High</option>
          </select>

          <div className="flex items-center gap-1 rounded-lg border border-background-800 p-1">
            {(['table', 'grid'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                  view === v ? 'bg-background-800 text-foreground-50' : 'text-foreground-400'
                }`}
              >
                <i className={v === 'table' ? 'ri-table-line' : 'ri-grid-line'} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-add-line" /> Add product
          </button>
        </div>

        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-background-800">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Featured', ''].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-background-800/60 last:border-0 hover:bg-background-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-9 shrink-0 overflow-hidden rounded-md bg-background-900">
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.name}
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-foreground-600">
                              <i className="ri-image-line" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate font-medium text-foreground-100">
                            {r.name}
                          </span>
                          <span className="font-mono text-xs text-foreground-600">{r.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground-300">{r.category}</td>
                    <td className="px-4 py-3 font-heading text-foreground-50">
                      ${r.price}
                      {r.compareAtPrice ? (
                        <span className="ml-2 text-xs text-foreground-600 line-through">
                          ${r.compareAtPrice}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          r.stock === 0
                            ? 'text-primary-300'
                            : r.stock <= 10
                              ? 'text-accent-300'
                              : 'text-foreground-200'
                        }
                      >
                        {r.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={toneForStatus(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {r.featured ? (
                        <i className="ri-star-fill text-accent-400" aria-label="Featured" />
                      ) : (
                        <span className="text-foreground-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          aria-label={`Edit ${r.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 hover:bg-background-800 hover:text-foreground-50 transition-colors cursor-pointer"
                        >
                          <i className="ri-edit-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateProduct(r.id)}
                          aria-label={`Duplicate ${r.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 hover:bg-background-800 hover:text-foreground-50 transition-colors cursor-pointer"
                        >
                          <i className="ri-file-copy-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          aria-label={`Delete ${r.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 hover:bg-background-800 hover:text-primary-300 transition-colors cursor-pointer"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="group overflow-hidden rounded-xl border border-background-800 bg-background-900/50 transition-colors hover:border-background-700"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-background-900">
                  {r.image ? (
                    <img
                      src={r.image}
                      alt={r.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-2xl text-foreground-700">
                      <i className="ri-image-line" />
                    </span>
                  )}
                  <span className="absolute left-3 top-3">
                    <Badge tone={toneForStatus(r.status)}>{r.status}</Badge>
                  </span>
                  {r.featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-background-950/80 p-1.5 text-accent-400">
                      <i className="ri-star-fill text-xs" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-500">
                    {r.category}
                  </p>
                  <h3 className="mt-1 truncate font-heading text-lg text-foreground-50">
                    {r.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-heading text-lg text-foreground-50">${r.price}</span>
                    <span className="text-xs text-foreground-500">{r.stock} in stock</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(r)}
                      className="flex-1 rounded-md border border-background-700 py-1.5 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(r)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-background-700 text-foreground-400 hover:text-primary-300 transition-colors cursor-pointer"
                      aria-label={`Delete ${r.name}`}
                    >
                      <i className="ri-delete-bin-line" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-foreground-500">
            No products match your filters.
          </p>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-background-800 p-4">
          <p className="text-xs text-foreground-600">
            Changes save to this browser and update the storefront instantly.
          </p>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="whitespace-nowrap rounded-lg border border-background-700 px-3 py-2 text-xs text-foreground-300 hover:border-foreground-400 transition-colors cursor-pointer"
          >
            Reset catalog to defaults
          </button>
        </div>
      </Panel>

      {/* Create / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit product' : 'Add product'}
        subtitle={editingId ? draft.name || editingId : 'Create a new catalog entry'}
        size="lg"
        footer={
          <>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  const target = products.find((p) => p.id === editingId);
                  if (target) setDeleteTarget(target);
                  setModalOpen(false);
                }}
                className="mr-auto rounded-lg border border-background-700 px-4 py-2 text-sm text-primary-200 hover:border-primary-400 transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-background-700 px-4 py-2 text-sm text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              {editingId ? 'Save changes' : 'Create product'}
            </button>
          </>
        }
      >
        <ProductForm draft={draft} onChange={applyDraft} categories={categories} />
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete product"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border border-background-700 px-4 py-2 text-sm text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-300">
          Are you sure you want to remove{' '}
          <span className="text-foreground-50">{deleteTarget?.name}</span> from the catalog? This
          removes it from the storefront and cannot be undone.
        </p>
      </Modal>

      {/* Reset confirmation */}
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset catalog"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setResetOpen(false)}
              className="rounded-lg border border-background-700 px-4 py-2 text-sm text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetProducts();
                setResetOpen(false);
              }}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Reset everything
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground-300">
          This discards all your product edits and restores the original demo catalog. This cannot
          be undone.
        </p>
      </Modal>
    </div>
  );
}
