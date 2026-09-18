import { useMemo, useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import { products as catalog, categories } from '@/mocks/products';

interface Row {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
}

const initialRows: Row[] = catalog.map((p, i) => {
  const stock = (i * 13 + 7) % 46;
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    stock,
    sold: ((i * 29 + 11) % 420) + 40,
    status: stock === 0 ? 'Out of Stock' : i % 7 === 5 ? 'Draft' : 'Active',
  };
});

const emptyDraft = {
  name: '',
  category: 'Skincare',
  price: '',
  stock: '',
};

export default function AdminProducts() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter(
      (r) =>
        (category === 'All' || r.category === category) &&
        (q === '' || r.name.toLowerCase().includes(q) || r.id.includes(q))
    );
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'stock') return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [rows, query, category, sort]);

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    setDraft({
      name: row.name,
      category: row.category,
      price: String(row.price),
      stock: String(row.stock),
    });
    setModalOpen(true);
  };

  const save = () => {
    const price = Number(draft.price) || 0;
    const stock = Number(draft.stock) || 0;
    if (editing) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                name: draft.name || r.name,
                category: draft.category,
                price,
                stock,
                status: stock === 0 ? 'Out of Stock' : 'Active',
              }
            : r
        )
      );
    } else {
      setRows((prev) => [
        {
          id: `new-${Date.now()}`,
          name: draft.name || 'Untitled Product',
          category: draft.category,
          price,
          stock,
          sold: 0,
          image:
            'https://readdy.ai/api/search-image?query=Luxury%20beauty%20product%20bottle%20with%20gold%20accents%20on%20a%20deep%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20glow%2C%20cinematic%20elegant%20lighting%2C%20high-end%20minimalist%20product%20photography&width=200&height=250&seq=deesse-admin-new&orientation=portrait',
          status: stock === 0 ? 'Out of Stock' : 'Draft',
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const activeCount = rows.filter((r) => r.status === 'Active').length;
  const lowStock = rows.filter((r) => r.stock > 0 && r.stock <= 10).length;

  return (
    <div className="space-y-6">
      {/* Summaries */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: 'Total products', value: rows.length, icon: 'ri-shopping-bag-3-line' },
          { label: 'Active', value: activeCount, icon: 'ri-checkbox-circle-line' },
          { label: 'Low stock', value: lowStock, icon: 'ri-alert-line' },
          { label: 'Out of stock', value: rows.filter((r) => r.stock === 0).length, icon: 'ri-close-circle-line' },
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

      <Panel bodyClassName="p-0">
        {/* Toolbar */}
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
            className="rounded-lg border border-background-800 bg-background-900 px-3 py-2.5 text-sm text-foreground-200 outline-none focus:border-primary-500/60 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-background-800 bg-background-900 px-3 py-2.5 text-sm text-foreground-200 outline-none focus:border-primary-500/60 cursor-pointer"
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
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-background-800">
                  {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Status', ''].map((h) => (
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
                          <img src={r.image} alt={r.name} className="h-full w-full object-cover object-top" />
                        </div>
                        <span className="font-medium text-foreground-100">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground-300">{r.category}</td>
                    <td className="px-4 py-3 font-heading text-foreground-50">${r.price}</td>
                    <td className="px-4 py-3">
                      <span className={r.stock === 0 ? 'text-primary-300' : r.stock <= 10 ? 'text-accent-300' : 'text-foreground-200'}>
                        {r.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground-400">{r.sold}</td>
                    <td className="px-4 py-3">
                      <Badge tone={toneForStatus(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 hover:bg-background-800 hover:text-foreground-50 transition-colors cursor-pointer"
                        >
                          <i className="ri-edit-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          aria-label="Delete"
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
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3">
                    <Badge tone={toneForStatus(r.status)}>{r.status}</Badge>
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-500">
                    {r.category}
                  </p>
                  <h3 className="mt-1 truncate font-heading text-lg text-foreground-50">{r.name}</h3>
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
                      aria-label="Delete"
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
          <p className="py-16 text-center text-sm text-foreground-500">No products match your filters.</p>
        )}
      </Panel>

      {/* Create / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit product' : 'Add product'}
        subtitle={editing ? editing.name : 'Create a new catalog entry'}
        footer={
          <>
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
              {editing ? 'Save changes' : 'Create product'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Velvet Rouge Lipstick"
              className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">Category</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60 cursor-pointer"
              >
                {categories
                  .filter((c) => c !== 'All')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">Price ($)</label>
              <input
                type="number"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">Stock</label>
              <input
                type="number"
                value={draft.stock}
                onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
                className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
              />
            </div>
          </div>
        </div>
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
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
}