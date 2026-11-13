import { PackageOpen } from 'lucide-react'
import { formatCurrency, formatNumber } from '../lib/metrics'

export default function TopProducts({ products }) {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-end justify-between gap-2 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Top products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Best sellers by revenue in the selected period
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400">
          Top {products.length}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <PackageOpen className="size-8 text-slate-300" />
          <p className="text-sm text-slate-500">
            No sales in this date range yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium sm:px-6">Product</th>
                <th className="px-5 py-3 text-right font-medium">Units</th>
                <th className="px-5 py-3 text-right font-medium">Revenue</th>
                <th className="px-5 py-3 pr-6 font-medium">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(({ product, units, revenue, share }, index) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-3.5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-semibold text-slate-400 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${product.tone}`}
                      >
                        {product.short}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-600 tabular-nums">
                    {formatNumber(units)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-900 tabular-nums">
                    {formatCurrency(revenue)}
                  </td>
                  <td className="px-5 py-3.5 pr-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-medium text-slate-600 tabular-nums">
                        {share.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
