import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
} from '../lib/metrics'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900 tabular-nums">
        {formatCurrency(point.revenue)}
      </p>
      <p className="text-xs text-slate-500">
        {formatNumber(point.orders)} orders
      </p>
    </div>
  )
}

export default function RevenueChart({ data, mode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Revenue over time
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode} revenue for the selected period
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
          <span className="size-2 rounded-full bg-emerald-500" />
          Revenue
        </div>
      </div>

      <div className="mt-5 h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              dy={8}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={58}
              tickFormatter={formatCompactCurrency}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#059669"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
