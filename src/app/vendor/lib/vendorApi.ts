import {
  vendorDashboardSeed,
  vendorOrdersSeed,
  vendorPayoutsSeed,
  vendorProductsSeed,
  vendorProfileSeed,
} from "./vendorMockData"
import type {
  VendorApiContract,
  VendorDocument,
  VendorOrder,
  VendorOrderStatus,
  VendorProduct,
  VendorProfile,
} from "./vendorTypes"

const wait = <T,>(value: T, ms = 250) =>
  new Promise<T>((resolve) => window.setTimeout(() => resolve(value), ms))

let profile = { ...vendorProfileSeed, documents: vendorProfileSeed.documents.map((doc) => ({ ...doc })) }
let products = vendorProductsSeed.map((product) => ({ ...product }))
let orders = vendorOrdersSeed.map((order) => ({ ...order }))
let payouts = vendorPayoutsSeed.map((payout) => ({ ...payout }))

// TODO API: replace mocks with real backend endpoints once contract is provided.
// Assumed endpoints:
// GET /api/vendor/profile
// PATCH /api/vendor/profile
// POST /api/vendor/onboarding/submit
// POST /api/vendor/documents/:documentId
// GET /api/vendor/dashboard
// GET|POST /api/vendor/products
// PATCH|DELETE /api/vendor/products/:id
// POST /api/vendor/products/bulk-upload
// GET /api/vendor/orders
// PATCH /api/vendor/orders/:id/status
// GET /api/vendor/payouts
// POST /api/vendor/payouts/request
export const vendorApi: VendorApiContract = {
  getProfile: () => wait({ ...profile, documents: profile.documents.map((doc) => ({ ...doc })) }),
  saveProfile: async (updates) => {
    profile = { ...profile, ...updates, documents: updates.documents ?? profile.documents }
    return wait({ ...profile })
  },
  submitOnboarding: async (updates) => {
    profile = { ...profile, ...updates, status: "pending" }
    return wait({ ...profile })
  },
  uploadDocument: async (documentId: string, file: File): Promise<VendorDocument> => {
    const uploaded = { id: documentId, label: profile.documents.find((doc) => doc.id === documentId)?.label ?? "Document", status: "uploaded" as const, fileName: file.name }
    profile = {
      ...profile,
      documents: profile.documents.map((doc) => doc.id === documentId ? uploaded : doc),
    }
    return wait(uploaded)
  },
  getDashboard: () => wait({
    ...vendorDashboardSeed,
    recentOrders: orders.slice(0, 3),
    topProducts: products.slice(0, 3),
  }),
  listProducts: () => wait(products.map((product) => ({ ...product }))),
  createProduct: async (product) => {
    const created: VendorProduct = { ...product, id: `vp_${Date.now()}`, updatedAt: new Date().toISOString().slice(0, 10) }
    products = [created, ...products]
    return wait(created)
  },
  updateProduct: async (id, updates) => {
    let updated = products.find((product) => product.id === id)
    if (!updated) throw new Error("Product not found")
    updated = { ...updated, ...updates, updatedAt: new Date().toISOString().slice(0, 10) }
    products = products.map((product) => product.id === id ? updated as VendorProduct : product)
    return wait(updated)
  },
  deleteProduct: async (id) => {
    products = products.filter((product) => product.id !== id)
    return wait(undefined)
  },
  bulkUploadProducts: async () => wait({ imported: 12, failed: 1 }),
  listOrders: () => wait(orders.map((order) => ({ ...order }))),
  updateOrderStatus: async (id: string, status: VendorOrderStatus): Promise<VendorOrder> => {
    let updated = orders.find((order) => order.id === id)
    if (!updated) throw new Error("Order not found")
    updated = { ...updated, status }
    orders = orders.map((order) => order.id === id ? updated as VendorOrder : order)
    return wait(updated)
  },
  listPayouts: () => wait({ balance: 128500, pending: 31500, history: payouts.map((payout) => ({ ...payout })) }),
  requestPayout: async (amount) => {
    const payout = { id: `PAY-${Date.now()}`, amount, status: "pending" as const, destination: "GTBank **** 4821", requestedAt: new Date().toISOString().slice(0, 10) }
    payouts = [payout, ...payouts]
    return wait(payout)
  },
}

export type { VendorProfile }
