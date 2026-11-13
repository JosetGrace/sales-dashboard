import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function KpiCard({ label, value, change, hint, icon: Icon, tone }) {
  const hasChange = change !== null && Number.isFinite(change)
  const positive = hasChange && change >= 0

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="size-5" />
        </span>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl">
        {value}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {hasChange ? (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
              positive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {positive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-500">
            No prior data
          </span>
        )}
        <span className="text-slate-400">{hint}</span>
      </div>
    </div>
  )
}
