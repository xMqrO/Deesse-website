import { useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Modal from '@/components/admin/ui/Modal';
import { HorizontalBars } from '@/components/admin/ui/Charts';
import { adminCategories, type AdminCategory } from '@/mocks/admin';

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>(adminCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', products: '' });

  const totalRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);

  const create = () => {
    if (!draft.name.trim()) {
      setModalOpen(false);
      return;
    }
    setCategories((prev) => [
      ...prev,
      {
        id: `CAT-${Date.now()}`,
        name: draft.name,
        products: Number(draft.products) || 0,
        unitsSold: 0,
        revenue: 0,
        growth: 0,
      },
    ]);
    setDraft({ name: '', products: '' });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Revenue by category"
          subtitle="Performance across collections"
        >
          <HorizontalBars
            data={categories.map((c) => ({
              label: c.name,
              value: c.revenue,
              sub: `$${c.revenue.toLocaleString()}`,
            }))}
          />
        </Panel>

        <Panel title="Collection mix" subtitle="Share of total revenue">
          <ul className="space-y-4">
            {categories.map((c) => {
              const share = totalRevenue ? (c.revenue / totalRevenue) * 100 : 0;
              return (
                <li key={c.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-200">{c.name}</span>
                    <span className="text-foreground-500">{share.toFixed(1)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background-800">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Panel
        bodyClassName="p-5"
        title="All categories"
        subtitle={`${categories.length} collections`}
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-add-line" /> New category
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="group rounded-xl border border-background-800 bg-background-900/50 p-5 transition-colors hover:border-background-700"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-500/15 text-secondary-200">
                  <i className="ri-price-tag-3-line text-xl" />
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.growth >= 0 ? 'bg-accent-500/15 text-accent-300' : 'bg-primary-500/15 text-primary-300'
                  }`}
                >
                  <i className={c.growth >= 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} />
                  {Math.abs(c.growth)}%
                </span>
              </div>
              <h3 className="mt-4 font-heading text-xl text-foreground-50">{c.name}</h3>
              <p className="mt-1 text-xs text-foreground-500">{c.products} products · {c.unitsSold.toLocaleString()} sold</p>
              <p className="mt-4 font-heading text-2xl text-foreground-50">
                ${c.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-foreground-500">revenue this period</p>
            </div>
          ))}
        </div>
      </Panel>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New category"
        size="sm"
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
              onClick={create}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Create
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
              placeholder="e.g. Gift Sets"
              className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">
              Products
            </label>
            <input
              type="number"
              value={draft.products}
              onChange={(e) => setDraft({ ...draft, products: e.target.value })}
              className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}