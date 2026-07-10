export type BuyerOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentMethodType = "card" | "bank" | "ussd" | "delivery"

export interface BuyerUser {
  id: string
  name: string
  email: string
  phone: string
  verified: boolean
  lga?: string
}

export interface BuyerAddress {
  id: string
  label: string
  recipient: string
  phone: string
  address: string
  lga: string
  landmark?: string
  isDefault: boolean
}

export interface BuyerPaymentMethod {
  id: string
  type: PaymentMethodType
  label: string
  last4?: string
  isDefault: boolean
}

export interface BuyerVendor {
  id: string
  name: string
  location: string
  rating: number
  verified: boolean
  phone: string
  avatar: string
}

export interface BuyerReview {
  id: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface BuyerProduct {
  id: string
  name: string
  nameHa?: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  lga: string
  location: string
  vendor: BuyerVendor
  rating: number
  reviewCount: number
  description: string
  inStock: boolean
  stock: number
  tags: string[]
  variants?: Array<{ id: string; label: string; value: string }>
  reviews: BuyerReview[]
}

export interface BuyerCartItem {
  product: BuyerProduct
  quantity: number
  variantId?: string
}

export interface BuyerOrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  vendorName: string
  quantity: number
  amount: number
  reviewed: boolean
}

export interface BuyerOrder {
  id: string
  status: BuyerOrderStatus
  placedAt: string
  total: number
  address: BuyerAddress
  paymentMethod: string
  tracking: Array<{ label: string; date: string; done: boolean }>
  items: BuyerOrderItem[]
}

export interface ProductQuery {
  q?: string
  category?: string
  lga?: string
  minRating?: number
  maxPrice?: number
  sort?: "featured" | "price-asc" | "price-desc" | "rating"
}

export interface BuyerCategory {
  id: string
  name: string
  image: string
  count: number
}

export interface CheckoutPayload {
  items: Array<{ productId: string; quantity: number; variantId?: string }>
  address: BuyerAddress
  paymentMethod: string
  total: number
}
