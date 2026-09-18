import { useMemo, useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import { useProducts } from '@/context/ProductContext';

interface StockRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  sold: number;
  reorderAt: number;
  image: string;
}

type Filter = 'all' | 'low' | 'out';

export default function AdminInventory() {
  const { products, updateProduct } = useProducts();
  const [filter, setFilter] = useState<Filter>('all');
  const [restock, setRestock] = useState<StockRow | null>(null);
  const [amount, setAmount] = useState('50');

  const rows = useMemo<StockRow[]>(
    () =>
      products.map((p, i) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || `DS-${String(1000 + i * 7)}`,
        category: p.category,
        stock: p.stock,
        sold: ((i * 29 + 11) % 420) + 40,
        reorderAt: 12,
        image: p.image,
      })),
    [products]
  );

  const filtered = useMemo(() => {
    if (filter === 'low') return rows.filter((r) => r.stock > 0 && r.stock <= r.reorderAt);
    if (filter === 'out') return rows.filter((r) => r.stock === 0);
    return rows;
  }, [rows, filter]);

  const totalUnits = rows.reduce((sum, r) => sum + r.stock, 0);
  const inventoryValue = rows.reduce((sum, r) => sum + r.stock * 60, 0);

  const applyRestock = () => {
    if (!restock) return;
    const qty = Number(amount) || 0;
    updateProduct(restock.id, { stock: restock.stock + qty });
    setRestock(null);
    setAmount('50');
  };

  const statusOf = (r: StockRow) =>
    r.stock === 0 ? 'Out of Stock' : r.stock <= r.reorderAt ? 'Low Stock' : 'In Stock';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: 'Total SKUs', value: rows.length, icon: 'ri-stack-line' },
          { label: 'Units on hand', value: totalUnits, icon: 'ri-archive-2-line' },
          { label: 'Stock value', value: `$${(inventoryValue / 1000).toFixed(1)}k`, icon: 'ri-money-dollar-circle-line' },
          { label: 'Needs reorder', value: rows.filter((r) => r.stock <= r.reorderAt).length, icon: 'ri-alert-line' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-background-800 bg-background-900/50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">{s.label}</p>
              <i className={`${s.icon} text-lg text-secondary-300`} />
            </div>
            <p className="mt-2 font-heading text-3xl text-foreground-50">{s.value}</p>
          </div>
        ))}
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-800 p-4">
          <div className="flex items-center gap-2">
            {([
              { key: 'all', label: 'All stock' },
              { key: 'low', label: 'Low stock' },
              { key: 'out', label: 'Out of stock' },
            ] as const).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                  filter === f.key
                    ? 'bg-primary-500 text-foreground-50'
                    : 'border border-background-700 text-foreground-400 hover:text-foreground-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-foreground-500">{filtered.length} items</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-800">
                {['Product', 'SKU', 'Stock level', 'Sold', 'Status', ''].map((h) => (
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
              {filtered.map((r) => {
                const pct = Math.min((r.stock / 60) * 100, 100);
                const status = statusOf(r);
                return (
                  <tr
                    key={r.id}
                    className="border-b border-background-800/60 last:border-0 hover:bg-background-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-9 shrink-0 overflow-hidden rounded-md bg-background-900">
                          <img src={r.image} alt={r.name} className="h-full w-full object-cover object-top" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground-100">{r.name}</p>
                          <p className="text-xs text-foreground-500">{r.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-foreground-400">{r.sku}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-background-800">
                          <div
                            className={`h-full rounded-full ${
                              r.stock === 0
                                ? 'bg-primary-500'
                                : r.stock <= r.reorderAt
                                  ? 'bg-accent-500'
                                  : 'bg-secondary-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-foreground-300">{r.stock}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-foreground-400">{r.sold}</td>
                    <td className="px-4 py-3.5">
                      <Badge tone={toneForStatus(status)}>{status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setRestock(r)}
                        className="whitespace-nowrap rounded-md border border-background-700 px-3 py-1.5 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-foreground-500">Nothing here — stock is healthy.</p>
        )}
      </Panel>

      <Modal
        open={!!restock}
        onClose={() => setRestock(null)}
        title="Restock item"
        subtitle={restock?.name}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setRestock(null)}
              className="rounded-lg border border-background-700 px-4 py-2 text-sm text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyRestock}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Add stock
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-background-800 bg-background-950/60 px-4 py-3 text-sm">
            <span className="text-foreground-400">Current on hand</span>
            <span className="font-heading text-xl text-foreground-50">{restock?.stock}</span>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-foreground-500">
              Quantity to add
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2 w-full rounded-lg border border-background-800 bg-background-950 px-4 py-2.5 text-sm text-foreground-100 outline-none focus:border-primary-500/60"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}