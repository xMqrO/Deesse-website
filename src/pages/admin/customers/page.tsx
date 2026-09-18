import { useMemo, useState } from 'react';
import Panel from '@/components/admin/ui/Panel';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import Modal from '@/components/admin/ui/Modal';
import { adminCustomers, adminOrders, type AdminCustomer } from '@/mocks/admin';

const TIERS = ['All', 'Icon', 'Gold', 'Silver', 'New'] as const;

export default function AdminCustomers() {
  const [tab, setTab] = useState<(typeof TIERS)[number]>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AdminCustomer | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return adminCustomers.filter(
      (c) =>
        (tab === 'All' || c.tier === tab) &&
        (q === '' || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    );
  }, [tab, query]);

  const totalSpent = adminCustomers.reduce((sum, c) => sum + c.spent, 0);
  const avgSpent = totalSpent / adminCustomers.length;

  const customerOrders = selected
    ? adminOrders.filter((o) => o.customer === selected.name)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: 'Total customers', value: adminCustomers.length, icon: 'ri-group-line' },
          { label: 'Lifetime value', value: `$${(totalSpent / 1000).toFixed(1)}k`, icon: 'ri-money-dollar-circle-line' },
          { label: 'Avg. spend', value: `$${avgSpent.toFixed(0)}`, icon: 'ri-bar-chart-line' },
          { label: 'Icon members', value: adminCustomers.filter((c) => c.tier === 'Icon').length, icon: 'ri-vip-crown-line' },
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
            {TIERS.map((t) => (
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
              placeholder="Search customers…"
              className="w-full rounded-lg border border-background-800 bg-background-900/60 py-2.5 pl-9 pr-4 text-sm text-foreground-100 placeholder:text-foreground-600 outline-none focus:border-primary-500/60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-800">
                {['Customer', 'Tier', 'Country', 'Orders', 'Lifetime spend', 'Joined', ''].map((h) => (
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
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-background-800/60 last:border-0 hover:bg-background-800/40 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500/15 font-heading text-sm text-primary-200">
                        {c.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-foreground-100">{c.name}</p>
                        <p className="text-xs text-foreground-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge tone={toneForStatus(c.tier)}>{c.tier}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-foreground-300">{c.country}</td>
                  <td className="px-4 py-3.5 text-foreground-300">{c.orders}</td>
                  <td className="px-4 py-3.5 font-heading text-foreground-50">
                    ${c.spent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-foreground-500">{c.joined}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="rounded-md border border-background-700 px-3 py-1.5 text-xs text-foreground-200 hover:border-foreground-400 transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle={selected?.email}
        size="lg"
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Tier', node: <Badge tone={toneForStatus(selected.tier)}>{selected.tier}</Badge> },
                { label: 'Orders', node: <span className="font-heading text-xl text-foreground-50">{selected.orders}</span> },
                { label: 'Spend', node: <span className="font-heading text-xl text-foreground-50">${selected.spent.toLocaleString()}</span> },
                { label: 'Country', node: <span className="text-foreground-100">{selected.country}</span> },
              ].map((f) => (
                <div key={f.label} className="rounded-lg border border-background-800 bg-background-950/60 p-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-foreground-500">{f.label}</p>
                  <div className="mt-1.5">{f.node}</div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">Recent orders</p>
              {customerOrders.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {customerOrders.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between rounded-lg border border-background-800 bg-background-950/50 px-4 py-3 text-sm"
                    >
                      <span className="text-foreground-100">{o.id}</span>
                      <span className="text-foreground-500">{o.date}</span>
                      <span className="font-heading text-foreground-50">${o.total.toFixed(2)}</span>
                      <Badge tone={toneForStatus(o.status)}>{o.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-foreground-500">No orders on record yet.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}