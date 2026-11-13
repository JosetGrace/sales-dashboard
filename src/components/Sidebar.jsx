import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  ReceiptText,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Orders', icon: ReceiptText },
  { label: 'Products', icon: Boxes },
  { label: 'Customers', icon: Users },
  { label: 'Reports', icon: BarChart3 },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-6 md:flex lg:w-64 lg:px-5">
      <div className="flex items-center gap-3 px-1 lg:px-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
          <TrendingUp className="size-5" strokeWidth={2.5} />
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold tracking-tight text-slate-900">
            SalesBoard
          </p>
          <p className="text-xs text-slate-500">Business analytics</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition lg:justify-start ${
              active
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="size-5 shrink-0" />
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        title="Settings"
        className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:justify-start"
      >
        <Settings className="size-5 shrink-0" />
        <span className="hidden lg:inline">Settings</span>
      </button>

      <div className="mt-4 hidden items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 lg:flex">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          SO
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            Store Owner
          </p>
          <p className="truncate text-xs text-slate-500">Administrator</p>
        </div>
      </div>
    </aside>
  )
}
