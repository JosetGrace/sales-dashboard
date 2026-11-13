export default function DateRangeFilter({ value, onChange, presets }) {
  return (
    <div
      role="group"
      aria-label="Date range"
      className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200"
    >
      {presets.map((preset) => {
        const active = preset.key === value
        return (
          <button
            key={preset.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(preset.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
