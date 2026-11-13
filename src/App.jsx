import { useMemo, useState } from 'react'
import {
  CalendarDays,
  DollarSign,
  Package,
  Receipt,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'
import DateRangeFilter from './components/DateRangeFilter'
import KpiCard from './components/KpiCard'
import RevenueChart from './components/RevenueChart'
import Sidebar from './components/Sidebar'
import TopProducts from './components/TopProducts'
import { ORDERS } from './data/sales'
import {
  buildSeries,
  filterOrders,
  formatCurrency,
  formatCurrencyPrecise,
  formatNumber,
  formatRangeLabel,
  getRange,
  percentChange,
  RANGE_PRESETS,
  summarize,
  topProducts,
} from './lib/metrics'

export default function App() {
  const [rangeKey, setRangeKey] = useState('30d')
  const preset =
    RANGE_PRESETS.find((item) => item.key === rangeKey) ?? RANGE_PRESETS[1]

  const range = useMemo(() => getRange(preset.days), [preset.days])
  const currentOrders = useMemo(
    () => filterOrders(ORDERS, range.startIdx, range.endIdx),
    [range],
  )
  const previousOrders = useMemo(
    () => filterOrders(ORDERS, range.prevStartIdx, range.prevEndIdx),
    [range],
  )

  const stats = useMemo(() => summarize(currentOrders), [currentOrders])
  const prevStats = useMemo(() => summarize(previousOrders), [previousOrders])
  const series = useMemo(
    () => buildSeries(currentOrders, range),
    [currentOrders, range],
  )
  const products = useMemo(() => topProducts(currentOrders), [currentOrders])

  const changes = {
    revenue: percentChange(stats.revenue, prevStats.revenue),
    orders: percentChange(stats.orders, prevStats.orders),
    units: percentChange(stats.units, prevStats.units),
    aov: percentChange(stats.aov, prevStats.aov),
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <TrendingUp className="size-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              SalesBoard
            </span>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            SO
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Overview</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Sales dashboard
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="size-4 text-slate-400" />
                <span>
                  {preset.caption} · {formatRangeLabel(range)}
                </span>
              </div>
            </div>

            <DateRangeFilter
              value={rangeKey}
              onChange={setRangeKey}
              presets={RANGE_PRESETS}
            />
          </header>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Total revenue"
              value={formatCurrency(stats.revenue)}
              change={changes.revenue}
              hint="vs previous period"
              icon={DollarSign}
              tone="bg-emerald-50 text-emerald-600"
            />
            <KpiCard
              label="Sales"
              value={formatNumber(stats.orders)}
              change={changes.orders}
              hint="vs previous period"
              icon={ShoppingBag}
              tone="bg-sky-50 text-sky-600"
            />
            <KpiCard
              label="Units sold"
              value={formatNumber(stats.units)}
              change={changes.units}
              hint="vs previous period"
              icon={Package}
              tone="bg-violet-50 text-violet-600"
            />
            <KpiCard
              label="Avg. order value"
              value={formatCurrencyPrecise(stats.aov)}
              change={changes.aov}
              hint="vs previous period"
              icon={Receipt}
              tone="bg-amber-50 text-amber-600"
            />
          </div>

          <div className="mt-6">
            <RevenueChart data={series.data} mode={series.mode} />
          </div>

          <div className="mt-6">
            <TopProducts products={products} />
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Demo dashboard · figures are generated from sample data.
          </p>
        </div>
      </main>
    </div>
  )
}
