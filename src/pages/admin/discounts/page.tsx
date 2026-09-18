import { useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import { useDiscounts } from '@/hooks/useDiscounts';
import { categories, products } from '@/mocks/products';
import type { Discount, DiscountType } from '@/mocks/discounts';

interface Draft {
  code: string;
  type: DiscountType;
  value: string;
  minPurchase: string;
  usageLimit: string;
  startsAt: string;
  expiresAt: string;
  active: boolean;
  appliesTo: 'all' | 'category' | 'product';
  category: string;
  productIds: string[];
}

const emptyDraft: Draft = {
  code: '',
  type: 'percent',
  value: '20',
  minPurchase: '0',
  usageLimit: '0',
  startsAt: '',
  expiresAt: '',
  active: true,
  appliesTo: 'all',
  category: 'Skincare',
  productIds: [],
};

function typeLabel(d: Discount): string {
  if (d.type === 'percent') return `${d.value}% off`;
  if (d.type === 'fixed') return `$${d.value} off`;
  return 'Free shipping';
}

function formatDate(s: string): string {
  if (!s) return '—';
  const d = new Date(`${s}T00:00:00`);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const inputClass =
  'w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60 transition-colors';

const labelClass = 'text-xs uppercase tracking-[0.15em] text-foreground-500';

export default function AdminDiscounts() {
  const { discounts, create, update, remove, toggle } = useDiscounts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);

  const activeCount = discounts.filter((d) => d.active).length;
  const redemptions = discounts.reduce((sum, d) => sum + d.usageCount, 0);
  const scheduledCount = discounts.filter(
    (d) => !d.active && d.startsAt && new Date(`${d.startsAt}T00:00:00`) > new Date()
  ).length;

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  };

  const openEdit = (d: Discount) => {
    setEditing(d);
    setDraft({
      code: d.code,
      type: d.type,
      value: String(d.value),
      minPurchase: String(d.minPurchase),
      usageLimit: String(d.usageLimit),
      startsAt: d.startsAt,
      expiresAt: d.expiresAt,
      active: d.active,
      appliesTo: d.appliesTo,
      category: d.category ?? 'Skincare',
      productIds: d.productIds,
    });
    setModalOpen(true);
  };

  const save = () => {
    const data = {
      code: draft.code.trim().toUpperCase() || 'NEWCODE',
      type: draft.type,
      value: Number(draft.value) || 0,
      minPurchase: Number(draft.minPurchase) || 0,
      usageLimit: Number(draft.usageLimit) || 0,
      startsAt: draft.startsAt,
      expiresAt: draft.expiresAt,
      active: draft.active,
      appliesTo: draft.appliesTo,
      category: draft.appliesTo === 'category' ? draft.category : null,
      productIds: draft.appliesTo === 'product' ? draft.productIds : [],
    };
    if (editing) {
      update(editing.id, data);
    } else {
      create(data);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summaries */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: 'Active codes', value: activeCount, icon: 'ri-coupon-3-line' },
          { label: 'Total codes', value: discounts.length, icon: 'ri-price-tag-3-line' },
          { label: 'Redemptions', value: redemptions.toLocaleString(), icon: 'ri-shopping-bag-3-line' },
          { label: 'Scheduled', value: scheduledCount, icon: 'ri-calendar-schedule-line' },
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

      <Panel
        bodyClassName="p-0"
        title="Discount codes"
        subtitle="Create and manage promotional offers"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-add-line" /> Create code
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-800">
                {['Code', 'Discount', 'Min. purchase', 'Usage', 'Window', 'Applies to', 'Status', ''].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => {
                const pct =
                  d.usageLimit > 0 ? Math.min((d.usageCount / d.usageLimit) * 100, 100) : 0;
                return (
                  <tr
                    key={d.id}
                    className="border-b border-background-800/60 last:border-0 hover:bg-background-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="rounded-md border border-background-700 bg-background-950 px-2.5 py-1 font-mono text-xs text-foreground-100">
                        {d.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-heading text-foreground-50">{typeLabel(d)}</td>
                    <td className="px-4 py-3.5 text-foreground-300">
                      {d.minPurchase > 0 ? `$${d.minPurchase}` : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs text-foreground-500">
                          <span className="text-foreground-300">{d.usageCount.toLocaleString()}</span>
                          <span>/ {d.usageLimit > 0 ? d.usageLimit.toLocaleString() : '∞'}</span>
                        </div>
                        {d.usageLimit > 0 && (
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background-800">
                            <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-foreground-500">
                      <span className="whitespace-nowrap">
                        {formatDate(d.startsAt)} – {formatDate(d.expiresAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-foreground-400 capitalize">
                      {d.appliesTo === 'all'
                        ? 'All products'
                        : d.appliesTo === 'category'
                          ? d.category
                          : `${d.productIds.length} products`}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Badge tone={d.active ? 'positive' : 'neutral'}>
                          {d.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => toggle(d.id)}
                          role="switch"
                          aria-checked={d.active}
                          aria-label="Toggle status"
                          className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                            d.active ? 'bg-primary-500' : 'bg-background-700'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground-50 transition-transform ${
                              d.active ? 'translate-x-[22px]' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(d)}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 hover:bg-background-800 hover:text-foreground-50 transition-colors cursor-pointer"
                        >
                          <i className="ri-edit-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(d)}
                          aria-label="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 hover:bg-background-800 hover:text-primary-300 transition-colors cursor-pointer"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Create / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit discount' : 'Create discount'}
        subtitle={editing ? editing.code : 'Set up a new promotional code'}
        size="lg"
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
              {editing ? 'Save changes' : 'Create code'}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Code</label>
              <input
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                placeholder="e.g. GLOW20"
                className={`mt-2 font-mono uppercase ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as DiscountType })}
                className={`mt-2 cursor-pointer ${inputClass}`}
              >
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed amount</option>
                <option value="free_shipping">Free shipping</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {draft.type !== 'free_shipping' && (
              <div>
                <label className={labelClass}>
                  {draft.type === 'percent' ? 'Percentage (%)' : 'Amount ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={draft.value}
                  onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                  className={`mt-2 ${inputClass}`}
                />
              </div>
            )}
            <div>
              <label className={labelClass}>Minimum purchase ($)</label>
              <input
                type="number"
                min="0"
                value={draft.minPurchase}
                onChange={(e) => setDraft({ ...draft, minPurchase: e.target.value })}
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Usage limit (0 = unlimited)</label>
              <input
                type="number"
                min="0"
                value={draft.usageLimit}
                onChange={(e) => setDraft({ ...draft, usageLimit: e.target.value })}
                className={`mt-2 ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={draft.active ? 'active' : 'inactive'}
                onChange={(e) => setDraft({ ...draft, active: e.target.value === 'active' })}
                className={`mt-2 cursor-pointer ${inputClass}`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                value={draft.startsAt}
                onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })}
                className={`mt-2 ${inputClass}`}
              />
            </div>
            <div>
              <label className={labelClass}>Expiry date</label>
              <input
                type="date"
                value={draft.expiresAt}
                onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value })}
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Applies to</label>
            <select
              value={draft.appliesTo}
              onChange={(e) =>
                setDraft({ ...draft, appliesTo: e.target.value as Draft['appliesTo'] })
              }
              className={`mt-2 cursor-pointer ${inputClass}`}
            >
              <option value="all">All products</option>
              <option value="category">Specific category</option>
              <option value="product">Specific products</option>
            </select>
          </div>

          {draft.appliesTo === 'category' && (
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className={`mt-2 cursor-pointer ${inputClass}`}
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
          )}

          {draft.appliesTo === 'product' && (
            <div>
              <label className={labelClass}>
                Products ({draft.productIds.length} selected)
              </label>
              <div className="mt-2 max-h-52 space-y-1 overflow-y-auto rounded-lg border border-background-800 bg-background-950 p-2">
                {products.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-background-900"
                  >
                    <input
                      type="checkbox"
                      checked={draft.productIds.includes(p.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setDraft((prev) => ({
                          ...prev,
                          productIds: checked
                            ? [...prev.productIds, p.id]
                            : prev.productIds.filter((id) => id !== p.id),
                        }));
                      }}
                      className="h-4 w-4 cursor-pointer accent-primary-500"
                    />
                    <span className="truncate text-sm text-foreground-200">{p.name}</span>
                    <span className="ml-auto whitespace-nowrap text-xs text-foreground-500">
                      {p.category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete discount"
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
          Are you sure you want to delete{' '}
          <span className="font-mono text-foreground-50">{deleteTarget?.code}</span>? This cannot
          be undone.
        </p>
      </Modal>
    </div>
  );
}