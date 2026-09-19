import { useMemo, useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import { adminOrders, type AdminOrder } from '@/mocks/admin';
import { useOrders } from '@/context/OrdersContext';

const STATUS_TABS = ['All', 'Paid', 'Pending', 'Shipped', 'Refunded', 'Cancelled'] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>(adminOrders);
  const { orders: liveOrders, updateOrderStatus } = useOrders();
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const allOrders = useMemo<AdminOrder[]>(() => {
    const merged: AdminOrder[] = [...orders, ...liveOrders];
    return merged.sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return b.id.localeCompare(a.id);
    });
  }, [orders, liveOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allOrders.filter(
      (o) =>
        (tab === 'All' || o.status === tab) &&
        (q === '' ||
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q))
    );
  }, [allOrders, tab, query]);

  const revenue = allOrders
    .filter((o) => o.status !== 'Cancelled' && o.status !== 'Refunded')
    .reduce((sum, o) => sum + o.total, 0);

  const isLive = (id: string) => liveOrders.some((o) => o.id === id);

  const updateStatus = (id: string, status: AdminOrder['status']) => {
    if (isLive(id)) {
      updateOrderStatus(id, status);
    } else {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: 'Total orders', value: allOrders.length, icon: 'ri-file-list-3-line' },
          { label: 'Net revenue', value: `$${revenue.toLocaleString()}`, icon: 'ri-money-dollar-circle-line' },
          { label: 'Pending', value: allOrders.filter((o) => o.status === 'Pending').length, icon: 'ri-time-line' },
          { label: 'Refunded', value: allOrders.filter((o) => o.status === 'Refunded').length, icon: 'ri-refund-2-line' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-background-800 bg-background-900/50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">{s.label}</p>
              <i className={`${s.icon} text-lg text-accent-400`} />
            </div>
            <p className="mt-2 font-heading text-3xl text-foreground-50">{s.value}</p>
          </div>
        ))}
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-background-800 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                  tab === t
                    ? 'bg-primary-500 text-foreground-50'
                    : 'border border-background-700 text-foreground-400 hover:text-foreground-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders…"
              className="w-full rounded-lg border border-background-800 bg-background-900/60 py-2.5 pl-9 pr-4 text-sm text-foreground-100 placeholder:text-foreground-600 outline-none focus:border-primary-500/60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-800">
                {['Order', 'Customer', 'Channel', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
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
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-background-800/60 last:border-0 hover:bg-background-800/40 transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium text-foreground-100">{o.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-foreground-200">{o.customer}</p>
                    <p className="text-xs text-foreground-500">{o.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge tone="accent">{o.channel}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-foreground-400">{o.items}</td>
                  <td className="px-4 py-3.5 font-heading text-foreground-50">
                    ${o.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge tone={toneForStatus(o.status)} dot>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-foreground-500">{o.date}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(o)}
                      className="rounded-md border border-background-700 px-3 py-1.5 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-foreground-500">No orders found.</p>
        )}
      </Panel>

      {/* Order detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Order ${selected.id}` : ''}
        subtitle={selected ? `${selected.customer} · ${selected.email}` : ''}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => selected && updateStatus(selected.id, 'Refunded')}
              className="rounded-lg border border-background-700 px-4 py-2 text-sm text-primary-300 hover:border-primary-500/60 transition-colors cursor-pointer"
            >
              Refund
            </button>
            <button
              type="button"
              onClick={() => selected && updateStatus(selected.id, 'Shipped')}
              className="rounded-lg bg-primary-500 px-5 py-2 text-sm font-medium text-foreground-50 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Mark as shipped
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-background-800 bg-background-950/60 p-4 sm:grid-cols-4">
              {[
                { label: 'Status', node: <Badge tone={toneForStatus(selected.status)} dot>{selected.status}</Badge> },
                { label: 'Channel', node: <span className="text-foreground-100">{selected.channel}</span> },
                { label: 'Items', node: <span className="text-foreground-100">{selected.items}</span> },
                { label: 'Total', node: <span className="font-heading text-lg text-foreground-50">${selected.total.toFixed(2)}</span> },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground-500">{f.label}</p>
                  <div className="mt-1.5">{f.node}</div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">Timeline</p>
              <ol className="mt-3 space-y-4">
                {[
                  { icon: 'ri-shopping-bag-3-line', title: 'Order placed', time: selected.date },
                  { icon: 'ri-bank-card-line', title: 'Payment captured', time: selected.date },
                  { icon: 'ri-box-3-line', title: 'Prepared in atelier', time: selected.date },
                  { icon: 'ri-truck-line', title: 'Awaiting dispatch', time: 'Pending' },
                ].map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-background-700 bg-background-900 text-primary-300">
                      <i className={`${step.icon} text-base`} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-foreground-100">{step.title}</p>
                      <p className="text-xs text-foreground-500">{step.time}</p>
                    </div>
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500/60" />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}