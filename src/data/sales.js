export const PRODUCTS = [
  {
    id: 'aurora-headphones',
    name: 'Aurora Headphones',
    category: 'Audio',
    price: 189,
    weight: 20,
    short: 'AH',
    tone: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'lumen-smartwatch',
    name: 'Lumen Smartwatch',
    category: 'Wearables',
    price: 249,
    weight: 12,
    short: 'LS',
    tone: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'nimbus-speaker',
    name: 'Nimbus Speaker',
    category: 'Audio',
    price: 129,
    weight: 15,
    short: 'NS',
    tone: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'pulse-fitness-band',
    name: 'Pulse Fitness Band',
    category: 'Wearables',
    price: 89,
    weight: 12,
    short: 'PF',
    tone: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'vertex-laptop-stand',
    name: 'Vertex Laptop Stand',
    category: 'Accessories',
    price: 59,
    weight: 10,
    short: 'VL',
    tone: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'halo-desk-lamp',
    name: 'Halo Desk Lamp',
    category: 'Home',
    price: 79,
    weight: 8,
    short: 'HD',
    tone: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'drift-keyboard',
    name: 'Drift Keyboard',
    category: 'Accessories',
    price: 149,
    weight: 9,
    short: 'DK',
    tone: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'echo-mini-projector',
    name: 'Echo Mini Projector',
    category: 'Home',
    price: 329,
    weight: 5,
    short: 'EP',
    tone: 'bg-orange-100 text-orange-700',
  },
]

export const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map((product) => [product.id, product]),
)

export const DAYS = 730

function startOfDay(date) {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const today = startOfDay(new Date())

export const DAY_TIMESTAMPS = Array.from({ length: DAYS }, (_, index) => {
  const date = new Date(today)
  date.setDate(today.getDate() - (DAYS - 1 - index))
  return date.getTime()
})

function mulberry32(seed) {
  let value = seed
  return function random() {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let result = Math.imul(value ^ (value >>> 15), 1 | value)
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function pickProduct(random, totalWeight) {
  let roll = random() * totalWeight
  for (const product of PRODUCTS) {
    if (roll < product.weight) return product
    roll -= product.weight
  }
  return PRODUCTS[PRODUCTS.length - 1]
}

function createOrders() {
  const random = mulberry32(20261113)
  const totalWeight = PRODUCTS.reduce((sum, product) => sum + product.weight, 0)
  const orders = []
  let counter = 0

  for (let day = 0; day < DAYS; day += 1) {
    const weekday = new Date(DAY_TIMESTAMPS[day]).getDay()
    const weekendLift = weekday === 0 || weekday === 6 ? 1.35 : 1
    const trend = 0.85 + (day / (DAYS - 1)) * 0.5
    const season = 1 + 0.16 * Math.sin((day / 365) * Math.PI * 2 - 0.6)
    const promo = random() < 0.04 ? 1.7 : 1
    const count = Math.max(
      3,
      Math.round((9 + random() * 7) * weekendLift * trend * season * promo),
    )

    for (let index = 0; index < count; index += 1) {
      const product = pickProduct(random, totalWeight)
      const roll = random()
      const units = roll < 0.55 ? 1 : roll < 0.85 ? 2 : 3
      counter += 1
      orders.push({
        id: `ORD-${String(counter).padStart(5, '0')}`,
        day,
        timestamp: DAY_TIMESTAMPS[day],
        productId: product.id,
        units,
        revenue: units * product.price,
        channel: random() < 0.62 ? 'Online' : 'In-store',
      })
    }
  }

  return orders
}

export const ORDERS = createOrders()
