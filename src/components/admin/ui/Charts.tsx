import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { RevenuePoint, CategoryShare } from '@/mocks/admin';

const COLORS = {
  primary: 'oklch(var(--primary-500))',
  accent: 'oklch(var(--accent-500))',
  secondary: 'oklch(var(--secondary-400))',
  grid: 'oklch(var(--background-700) / 0.5)',
  axis: 'oklch(var(--foreground-500))',
};

const DONUT_COLORS = [
  'oklch(var(--primary-500))',
  'oklch(var(--accent-500))',
  'oklch(var(--secondary-500))',
  'oklch(var(--primary-700))',
  'oklch(var(--accent-700))',
];

const tooltipContentStyle = {
  background: 'oklch(var(--background-900))',
  border: '1px solid oklch(var(--background-700))',
  borderRadius: 12,
  fontSize: 12,
  color: 'oklch(var(--foreground-100))',
  padding: '8px 12px',
};

const axisTick = { fontSize: 12, fill: 'oklch(var(--foreground-500))' } as const;

export function RevenueAreaChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="deesseRevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.45} />
            <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="month" stroke={COLORS.axis} tickLine={false} axisLine={false} tick={axisTick} />
        <YAxis
          stroke={COLORS.axis}
          tickLine={false}
          axisLine={false}
          tick={axisTick}
          tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
        />
        <Tooltip
          contentStyle={tooltipContentStyle}
          cursor={{ stroke: 'oklch(var(--background-600))' }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={COLORS.primary}
          strokeWidth={2.4}
          fill="url(#deesseRevGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface SeriesPoint {
  label: string;
  value: number;
}

export function OrdersBarChart({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="label" stroke={COLORS.axis} tickLine={false} axisLine={false} tick={axisTick} />
        <YAxis stroke={COLORS.axis} tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip
          contentStyle={tooltipContentStyle}
          cursor={{ fill: 'oklch(var(--background-800) / 0.4)' }}
          formatter={(value: number) => [value.toLocaleString(), 'Orders']}
        />
        <Bar dataKey="value" fill={COLORS.accent} radius={[6, 6, 0, 0]} maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  height = 240,
  unit = '%',
}: {
  data: CategoryShare[];
  height?: number;
  unit?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipContentStyle}
          formatter={(value: number) => [`${value}${unit}`, 'Share']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({
  data,
  color = COLORS.primary,
}: {
  data: { v: number }[];
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({
  data,
}: {
  data: { label: string; value: number; sub?: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-4">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-foreground-200">{d.label}</span>
            <span className="ml-3 whitespace-nowrap text-foreground-400">
              {d.sub ?? d.value.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { COLORS, DONUT_COLORS, tooltipContentStyle };