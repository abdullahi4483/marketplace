import type { ReactNode } from "react"

export type VendorStatus = "draft" | "pending" | "approved" | "rejected"
export type DocumentStatus = "missing" | "uploaded" | "verified" | "rejected"
export type ProductStatus = "draft" | "active" | "out_of_stock" | "suspended"
export type VendorOrderStatus = "new" | "accepted" | "processing" | "ready" | "shipped" | "delivered" | "cancelled"
export type PayoutStatus = "pending" | "processing" | "paid" | "failed"

export interface VendorDocument {
  id: string
  label: string
  status: DocumentStatus
  fileName?: string
  note?: string
}

export interface VendorProfile {
  id: string
  storeName: string
  ownerName: string
  email: string
  phone: string
  lga: string
  address: string
  category: string
  status: VendorStatus
  rejectionReason?: string
  logoUrl?: string
  bannerUrl?: string
  description: string
  returnPolicy: string
  shippingPolicy: string
  payoutBankName?: string
  payoutAccountName?: string
  payoutAccountNumber?: string
  documents: VendorDocument[]
}

export interface VendorMetric {
  label: string
  value: string
  change?: string
  tone?: "green" | "blue" | "amber" | "purple" | "red"
  icon?: ReactNode
}

export interface VendorProduct {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  imageUrl: string
  updatedAt: string
}

export interface VendorOrder {
  id: string
  buyerName: string
  buyerPhone: string
  item: string
  quantity: number
  amount: number
  status: VendorOrderStatus
  deliveryAddress: string
  placedAt: string
}

export interface VendorPayout {
  id: string
  amount: number
  status: PayoutStatus
  destination: string
  requestedAt: string
  paidAt?: string
}

export interface VendorDashboard {
  metrics: VendorMetric[]
  alerts: Array<{ id: string; title: string; body: string; tone: "green" | "amber" | "red" }>
  recentOrders: VendorOrder[]
  topProducts: VendorProduct[]
  earnings: Array<{ month: string; revenue: number; orders: number }>
}

export interface VendorApiContract {
  getProfile: () => Promise<VendorProfile>
  saveProfile: (profile: Partial<VendorProfile>) => Promise<VendorProfile>
  submitOnboarding: (profile: Partial<VendorProfile>) => Promise<VendorProfile>
  uploadDocument: (documentId: string, file: File) => Promise<VendorDocument>
  getDashboard: () => Promise<VendorDashboard>
  listProducts: () => Promise<VendorProduct[]>
  createProduct: (product: Omit<VendorProduct, "id" | "updatedAt">) => Promise<VendorProduct>
  updateProduct: (id: string, product: Partial<VendorProduct>) => Promise<VendorProduct>
  deleteProduct: (id: string) => Promise<void>
  bulkUploadProducts: (file: File) => Promise<{ imported: number; failed: number }>
  listOrders: () => Promise<VendorOrder[]>
  updateOrderStatus: (id: string, status: VendorOrderStatus) => Promise<VendorOrder>
  listPayouts: () => Promise<{ balance: number; pending: number; history: VendorPayout[] }>
  requestPayout: (amount: number) => Promise<VendorPayout>
}
