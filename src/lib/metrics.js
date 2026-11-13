import { DAY_TIMESTAMPS, DAYS, PRODUCT_MAP } from '../data/sales.js'

export const RANGE_PRESETS = [
  { key: '7d', label: '7D', days: 7, caption: 'Last 7 days' },
  { key: '30d', label: '30D', days: 30, caption: 'Last 30 days' },
  { key: '90d', label: '90D', days: 90, caption: 'Last 90 days' },
  { key: '12m', label: '12M', days: 365, caption: 'Last 12 months' },
]

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const preciseCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const number = new Intl.NumberFormat('en-US')

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const monthDay = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const monthDayYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const chartDay = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const chartMonth = new Intl.DateTimeFormat('en-US', { month: 'short' })

function formatChartMonth(date) {
  return `${chartMonth.format(date)} '${String(date.getFullYear()).slice(-2)}`
}

export function formatCurrency(value) {
  return currency.format(value)
}

export function formatCurrencyPrecise(value) {
  return preciseCurrency.format(value)
}

export function formatNumber(value) {
  return number.format(value)
}

export function formatCompactCurrency(value) {
  return `$${compactNumber.format(value)}`
}

export function percentChange(current, previous) {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function getRange(days) {
  const endIdx = DAYS - 1
  const startIdx = Math.max(0, DAYS - days)
  const prevEndIdx = startIdx - 1
  const prevStartIdx = Math.max(0, prevEndIdx - days + 1)
  return { days, startIdx, endIdx, prevStartIdx, prevEndIdx }
}

export function filterOrders(orders, startIdx, endIdx) {
  return orders.filter((order) => order.day >= startIdx && order.day <= endIdx)
}

export function summarize(orders) {
  let revenue = 0
  let units = 0

  for (const order of orders) {
    revenue += order.revenue
    units += order.units
  }

  const count = orders.length

  return {
    revenue,
    orders: count,
    units,
    aov: count > 0 ? revenue / count : 0,
  }
}

export function formatRangeLabel(range) {
  const start = new Date(DAY_TIMESTAMPS[range.startIdx])
  const end = new Date(DAY_TIMESTAMPS[range.endIdx])
  const startLabel =
    start.getFullYear() === end.getFullYear()
      ? monthDay.format(start)
      : monthDayYear.format(start)
  return `${startLabel} – ${monthDayYear.format(end)}`
}

function buildDaily(orders, range) {
  const buckets = new Map()

  for (let day = range.startIdx; day <= range.endIdx; day += 1) {
    buckets.set(day, {
      label: chartDay.format(new Date(DAY_TIMESTAMPS[day])),
      revenue: 0,
      orders: 0,
    })
  }

  for (const order of orders) {
    const bucket = buckets.get(order.day)
    if (bucket) {
      bucket.revenue += order.revenue
      bucket.orders += 1
    }
  }

  return { mode: 'Daily', data: [...buckets.values()] }
}

function buildWeekly(orders, range) {
  const span = range.endIdx - range.startIdx + 1
  const bucketCount = Math.ceil(span / 7)
  const buckets = Array.from({ length: bucketCount }, (_, index) => {
    const day = range.startIdx + index * 7
    return {
      label: chartDay.format(new Date(DAY_TIMESTAMPS[day])),
      revenue: 0,
      orders: 0,
    }
  })

  for (const order of orders) {
    const index = Math.floor((order.day - range.startIdx) / 7)
    const bucket = buckets[index]
    if (bucket) {
      bucket.revenue += order.revenue
      bucket.orders += 1
    }
  }

  return { mode: 'Weekly', data: buckets }
}

function monthKey(timestamp) {
  const date = new Date(timestamp)
  return date.getFullYear() * 12 + date.getMonth()
}

function buildMonthly(orders, range) {
  const startKey = monthKey(DAY_TIMESTAMPS[range.startIdx])
  const endKey = monthKey(DAY_TIMESTAMPS[range.endIdx])
  const buckets = new Map()

  for (let key = startKey; key <= endKey; key += 1) {
    const year = Math.floor(key / 12)
    const month = key % 12
    buckets.set(key, {
      label: formatChartMonth(new Date(year, month, 1)),
      revenue: 0,
      orders: 0,
    })
  }

  for (const order of orders) {
    const bucket = buckets.get(monthKey(order.timestamp))
    if (bucket) {
      bucket.revenue += order.revenue
      bucket.orders += 1
    }
  }

  return { mode: 'Monthly', data: [...buckets.values()] }
}

export function buildSeries(orders, range) {
  const span = range.endIdx - range.startIdx + 1
  if (span <= 31) return buildDaily(orders, range)
  if (span <= 120) return buildWeekly(orders, range)
  return buildMonthly(orders, range)
}

export function topProducts(orders, limit = 5) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.revenue, 0)
  const grouped = new Map()

  for (const order of orders) {
    const entry = grouped.get(order.productId) ?? {
      product: PRODUCT_MAP[order.productId],
      units: 0,
      revenue: 0,
    }
    entry.units += order.units
    entry.revenue += order.revenue
    grouped.set(order.productId, entry)
  }

  return [...grouped.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((entry) => ({
      ...entry,
      share: totalRevenue > 0 ? (entry.revenue / totalRevenue) * 100 : 0,
    }))
}
