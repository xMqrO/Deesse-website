import { useState } from 'react';
import { Link } from 'react-router-dom';
import Panel from '@/components/admin/ui/Panel';
import StatCard from '@/components/admin/ui/StatCard';
import Badge, { toneForStatus } from '@/components/admin/ui/Badge';
import { RevenueAreaChart, OrdersBarChart, DonutChart, HorizontalBars } from '@/components/admin/ui/Charts';
import CountUp from '@/components/base/CountUp';
import {
  kpis,
  revenueSeries,
  weeklySales,
  categoryShare,
  trafficSources,
  topProducts,
  adminOrders,
} from '@/mocks/admin';

export default function AdminOverview() {
  const [range, setRange] = useState<'7d' | '12m'>('12m');

  const chartData =
    range === '7d'
      ? weeklySales.map((d) => ({ month: d.day, revenue: d.revenue, orders: d.orders }))
      : revenueSeries;

  const orderBars = weeklySales.map((d) => ({ label: d.day, value: d.orders }));

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={<CountUp end={kpis.revenue} prefix="$" />}
          change={kpis.revenueChange}
          icon="ri-money-dollar-circle-line"
          accent="primary"
        />
        <StatCard
          label="Orders"
          value={<CountUp end={kpis.orders} />}
          change={kpis.ordersChange}
          icon="ri-shopping-bag-3-line"
          accent="accent"
        />
        <StatCard
          label="Customers"
          value={<CountUp end={kpis.customers} />}
          change={kpis.customersChange}
          icon="ri-group-line"
          accent="secondary"
        />
        <StatCard
          label="Avg. Order Value"
          value={<CountUp end={kpis.aov} prefix="$" decimals={2} />}
          change={kpis.aovChange}
          icon="ri-price-tag-2-line"
          accent="primary"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Revenue trend"
          subtitle="Gross revenue across the period"
          action={
            <div className="flex items-center gap-1 rounded-full border border-background-700 p-1">
              {(['7d', '12m'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide transition-colors cursor-pointer ${
                    range === r
                      ? 'bg-primary-500 text-foreground-50'
                      : 'text-foreground-400 hover:text-foreground-100'
                  }`}
                >
                  {r === '7d' ? '7 days' : '12 months'}
                </button>
              ))}
            </div>
          }
        >
          <RevenueAreaChart data={chartData} />
        </Panel>

        <Panel title="Category share" subtitle="Revenue by collection">
          <DonutChart data={categoryShare} />
          <ul className="mt-4 space-y-2">
            {categoryShare.map((c, i) => (
              <li key={c.name} className="flex items-center gap-3 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: [
                      'oklch(var(--primary-500))',
                      'oklch(var(--accent-500))',
                      'oklch(var(--secondary-500))',
                      'oklch(var(--primary-700))',
                      'oklch(var(--accent-700))',
                    ][i % 5],
                  }}
                />
                <span className="text-foreground-300">{c.name}</span>
                <span className="ml-auto text-foreground-500">{c.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Orders this week" subtitle="Daily order volume">
          <OrdersBarChart data={orderBars} />
        </Panel>

        <Panel title="Top products" subtitle="By revenue this month">
          <HorizontalBars
            data={topProducts.map((p) => ({
              label: p.name,
              value: p.revenue,
              sub: `$${p.revenue.toLocaleString()}`,
            }))}
          />
        </Panel>

        <Panel title="Traffic sources" subtitle="Where clients discover us">
          <DonutChart data={trafficSources} />
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {trafficSources.map((t, i) => (
              <li key={t.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: [
                      'oklch(var(--primary-500))',
                      'oklch(var(--accent-500))',
                      'oklch(var(--secondary-500))',
                      'oklch(var(--primary-700))',
                      'oklch(var(--accent-700))',
                    ][i % 5],
                  }}
                />
                <span className="text-foreground-400">{t.name}</span>
                <span className="ml-auto text-foreground-500">{t.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Recent orders */}
      <Panel
        title="Recent orders"
        subtitle="Latest activity across the store"
        bodyClassName="p-0"
        action={
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-foreground-300 hover:text-foreground-50 transition-colors cursor-pointer"
          >
            View all <i className="ri-arrow-right-line" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-800">
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-5 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminOrders.slice(0, 6).map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-background-800/60 last:border-0 hover:bg-background-800/40 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground-100">{o.id}</td>
                  <td className="px-5 py-3.5 text-foreground-300">{o.customer}</td>
                  <td className="px-5 py-3.5 text-foreground-400">{o.items}</td>
                  <td className="px-5 py-3.5 font-heading text-foreground-50">
                    ${o.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={toneForStatus(o.status)} dot>
                      {o.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-foreground-500">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}