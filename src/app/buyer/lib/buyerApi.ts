import { buyerAddressesSeed, buyerCategoriesSeed, buyerOrdersSeed, buyerPaymentMethodsSeed, buyerProductsSeed, buyerUserSeed } from "./buyerMockData"
import { buyerApiRequest, hasBuyerBackend } from "./buyerApiClient"
import type { BuyerAddress, BuyerOrder, BuyerPaymentMethod, BuyerProduct, BuyerReview, BuyerUser, CheckoutPayload, ProductQuery } from "./buyerTypes"

const wait = <T,>(value: T, ms = 220) => new Promise<T>((resolve) => window.setTimeout(() => resolve(value), ms))

let user = { ...buyerUserSeed }
let products = buyerProductsSeed.map((product) => ({ ...product, reviews: [...product.reviews] }))
let addresses = buyerAddressesSeed.map((address) => ({ ...address }))
let paymentMethods = buyerPaymentMethodsSeed.map((method) => ({ ...method }))
let orders = buyerOrdersSeed.map((order) => ({ ...order, items: order.items.map((item) => ({ ...item })) }))
let wishlist = ["bp_001"]

// TODO API: replace mocks with real buyer backend once route docs are provided.
// Assumed endpoints:
// POST /api/auth/register
// POST /api/auth/login
// POST /api/auth/password/forgot
// POST /api/auth/verify
// GET /api/products
// GET /api/products/:id
// GET|POST|PATCH|DELETE /api/cart
// POST /api/checkout
// GET /api/buyer/orders
// GET /api/buyer/orders/:id
// POST /api/products/:id/reviews
// GET|POST|PATCH|DELETE /api/buyer/addresses
// GET|POST|DELETE /api/buyer/payment-methods
// GET|POST|DELETE /api/buyer/wishlist
export const buyerApi = {
  login: (email: string, password?: string) => hasBuyerBackend()
    ? buyerApiRequest<{ token: string; user: BuyerUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
    : wait({ token: "mock-buyer-token", user: { ...user, email } }),
  register: (payload: Partial<BuyerUser>) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<{ token: string; user: BuyerUser }>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) })
    }
    user = { ...user, ...payload, id: "buyer_new", verified: false }
    return wait({ token: "mock-buyer-token", user })
  },
  requestPasswordReset: (email: string) => hasBuyerBackend()
    ? buyerApiRequest<{ ok: boolean; email: string }>("/api/auth/password/forgot", { method: "POST", body: JSON.stringify({ email }) })
    : wait({ ok: true, email }),
  verifyAccount: (code: string) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<BuyerUser>("/api/auth/verify", { method: "POST", body: JSON.stringify({ code }) })
    }
    user = { ...user, verified: code.length >= 4 }
    return wait({ ...user })
  },
  getMe: () => hasBuyerBackend() ? buyerApiRequest<BuyerUser>("/api/buyer/me") : wait({ ...user }),
  saveMe: (updates: Partial<BuyerUser>) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<BuyerUser>("/api/buyer/me", { method: "PATCH", body: JSON.stringify(updates) })
    }
    user = { ...user, ...updates }
    return wait({ ...user })
  },
  listCategories: () => wait(buyerCategoriesSeed.map((category) => ({ ...category }))),
  listProducts: (query: ProductQuery = {}) => {
    if (hasBuyerBackend()) {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") params.set(key, String(value))
      })
      return buyerApiRequest<BuyerProduct[]>(`/api/products?${params.toString()}`)
    }
    const filtered = products.filter((product) => {
      if (query.q && !`${product.name} ${product.tags.join(" ")} ${product.category}`.toLowerCase().includes(query.q.toLowerCase())) return false
      if (query.category && product.category !== query.category) return false
      if (query.lga && product.lga !== query.lga) return false
      if (query.minRating && product.rating < query.minRating) return false
      if (query.maxPrice && product.price > query.maxPrice) return false
      return true
    }).sort((a, b) => {
      if (query.sort === "price-asc") return a.price - b.price
      if (query.sort === "price-desc") return b.price - a.price
      if (query.sort === "rating") return b.rating - a.rating
      return 0
    })
    return wait(filtered.map((product) => ({ ...product })))
  },
  getProduct: (id: string) => hasBuyerBackend() ? buyerApiRequest<BuyerProduct | null>(`/api/products/${id}`) : wait(products.find((product) => product.id === id) ?? null),
  listOrders: () => hasBuyerBackend() ? buyerApiRequest<BuyerOrder[]>("/api/buyer/orders") : wait(orders.map((order) => ({ ...order }))),
  getOrder: (id: string) => hasBuyerBackend() ? buyerApiRequest<BuyerOrder | null>(`/api/buyer/orders/${id}`) : wait(orders.find((order) => order.id === id) ?? null),
  createOrder: (payload: CheckoutPayload) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<BuyerOrder>("/api/checkout", { method: "POST", body: JSON.stringify(payload) })
    }
    const order: BuyerOrder = {
      id: `ORD-${Date.now()}`,
      status: "pending",
      placedAt: new Date().toISOString().slice(0, 10),
      total: payload.total,
      address: payload.address,
      paymentMethod: payload.paymentMethod,
      tracking: [{ label: "Order placed", date: new Date().toISOString().slice(0, 10), done: true }],
      items: payload.items.map((item) => {
        const product = products.find((entry) => entry.id === item.productId)!
        return { id: `oi_${item.productId}`, productId: product.id, productName: product.name, productImage: product.images[0], vendorName: product.vendor.name, quantity: item.quantity, amount: product.price * item.quantity, reviewed: false }
      }),
    }
    orders = [order, ...orders]
    return wait(order)
  },
  submitReview: (productId: string, review: Omit<BuyerReview, "id" | "createdAt">) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<BuyerReview>(`/api/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(review) })
    }
    const created = { ...review, id: `rev_${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }
    products = products.map((product) => product.id === productId ? { ...product, reviews: [created, ...product.reviews], reviewCount: product.reviewCount + 1 } : product)
    return wait(created)
  },
  listAddresses: () => hasBuyerBackend() ? buyerApiRequest<BuyerAddress[]>("/api/buyer/addresses") : wait(addresses.map((address) => ({ ...address }))),
  saveAddress: (address: Omit<BuyerAddress, "id"> & { id?: string }) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<BuyerAddress>(address.id ? `/api/buyer/addresses/${address.id}` : "/api/buyer/addresses", { method: address.id ? "PATCH" : "POST", body: JSON.stringify(address) })
    }
    const saved = { ...address, id: address.id ?? `addr_${Date.now()}` }
    addresses = address.id ? addresses.map((entry) => entry.id === address.id ? saved : entry) : [saved, ...addresses]
    return wait(saved)
  },
  listPaymentMethods: () => hasBuyerBackend() ? buyerApiRequest<BuyerPaymentMethod[]>("/api/buyer/payment-methods") : wait(paymentMethods.map((method) => ({ ...method }))),
  savePaymentMethod: (method: Omit<BuyerPaymentMethod, "id"> & { id?: string }) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<BuyerPaymentMethod>(method.id ? `/api/buyer/payment-methods/${method.id}` : "/api/buyer/payment-methods", { method: method.id ? "PATCH" : "POST", body: JSON.stringify(method) })
    }
    const saved = { ...method, id: method.id ?? `pay_${Date.now()}` }
    paymentMethods = method.id ? paymentMethods.map((entry) => entry.id === method.id ? saved : entry) : [saved, ...paymentMethods]
    return wait(saved)
  },
  listWishlist: () => hasBuyerBackend() ? buyerApiRequest<string[]>("/api/buyer/wishlist") : wait(wishlist),
  toggleWishlist: (productId: string) => {
    if (hasBuyerBackend()) {
      return buyerApiRequest<string[]>("/api/buyer/wishlist", { method: "POST", body: JSON.stringify({ productId }) })
    }
    wishlist = wishlist.includes(productId) ? wishlist.filter((id) => id !== productId) : [productId, ...wishlist]
    return wait([...wishlist])
  },
}
