import Panel from '@/components/admin/ui/Panel';
import StatCard from '@/components/admin/ui/StatCard';
import { RevenueAreaChart, OrdersBarChart, DonutChart, HorizontalBars } from '@/components/admin/ui/Charts';
import CountUp from '@/components/base/CountUp';
import { kpis, revenueSeries, categoryShare, trafficSources, topProducts } from '@/mocks/admin';

const funnel = [
  { stage: 'Sessions', value: 128400 },
  { stage: 'Product views', value: 68400 },
  { stage: 'Add to cart', value: 21400 },
  { stage: 'Checkout', value: 9600 },
  { stage: 'Purchases', value: 2864 },
];

export default function AdminAnalytics() {
  const funnelMax = funnel[0].value;
  const orderBars = revenueSeries.map((d) => ({ label: d.month, value: d.orders }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue (YTD)"
          value={<CountUp end={kpis.revenue} prefix="$" />}
          change={kpis.revenueChange}
          icon="ri-line-chart-line"
          accent="primary"
        />
        <StatCard
          label="Conversion"
          value={<CountUp end={kpis.conversion} suffix="%" decimals={2} />}
          change={kpis.conversionChange}
          icon="ri-percent-line"
          accent="accent"
        />
        <StatCard
          label="Refund rate"
          value={<CountUp end={kpis.refundRate} suffix="%" decimals={1} />}
          change={kpis.refundChange}
          icon="ri-refund-2-line"
          accent="secondary"
        />
        <StatCard
          label="Avg. order value"
          value={<CountUp end={kpis.aov} prefix="$" decimals={2} />}
          change={kpis.aovChange}
          icon="ri-shopping-bag-3-line"
          accent="primary"
        />
      </div>

      <Panel title="Revenue over time" subtitle="Monthly gross revenue">
        <RevenueAreaChart data={revenueSeries} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Orders per month" subtitle="Fulfilment volume" className="xl:col-span-2">
          <OrdersBarChart data={orderBars} />
        </Panel>

        <Panel title="Conversion funnel" subtitle="From discovery to purchase">
          <ul className="space-y-4">
            {funnel.map((f, i) => {
              const pct = (f.value / funnelMax) * 100;
              const stepPct = i === 0 ? 100 : (f.value / funnel[i - 1].value) * 100;
              return (
                <li key={f.stage}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground-200">{f.stage}</span>
                    <span className="text-foreground-500">
                      {f.value.toLocaleString()}
                      {i > 0 && (
                        <span className="ml-2 text-xs text-accent-400">{stepPct.toFixed(1)}%</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background-800">
                    <div
                      className="h-full rounded-full bg-secondary-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Category share" subtitle="Revenue by collection">
          <DonutChart data={categoryShare} />
        </Panel>

        <Panel title="Traffic sources" subtitle="Acquisition mix">
          <DonutChart data={trafficSources} />
        </Panel>

        <Panel title="Top products" subtitle="By revenue">
          <HorizontalBars
            data={topProducts.map((p) => ({
              label: p.name,
              value: p.revenue,
              sub: `$${p.revenue.toLocaleString()}`,
            }))}
          />
        </Panel>
      </div>

      <Panel title="Performance summary" subtitle="Key storefront benchmarks">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Returning customers', value: '42%', note: '+5.2% vs last period' },
            { label: 'Cart abandonment', value: '61%', note: '-3.8% vs last period' },
            { label: 'Avg. items / order', value: '2.7', note: '+0.4 vs last period' },
            { label: 'Email subscribers', value: '18.4k', note: '+1,240 this month' },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-background-800 bg-background-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-foreground-500">{m.label}</p>
              <p className="mt-2 font-heading text-3xl text-foreground-50">{m.value}</p>
              <p className="mt-1 text-xs text-accent-400">{m.note}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}