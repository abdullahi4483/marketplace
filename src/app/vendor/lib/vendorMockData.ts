import type { VendorDashboard, VendorOrder, VendorPayout, VendorProduct, VendorProfile } from "./vendorTypes"

export const vendorProfileSeed: VendorProfile = {
  id: "vendor_001",
  storeName: "Bida Craft Hub",
  ownerName: "Aminu Abdullahi",
  email: "seller@nigermart.ng",
  phone: "+234 803 456 7890",
  lga: "Bida",
  address: "Shop 12, Emir Road Market, Bida",
  category: "Pottery & Craft",
  status: "pending",
  logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
  bannerUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=360&fit=crop&auto=format",
  description: "Authentic Nupe brasswork and traditional crafts from Bida artisans.",
  returnPolicy: "Returns accepted within 7 days for damaged items reported at delivery.",
  shippingPolicy: "Same-day dispatch within Bida. Statewide delivery within 2-3 business days.",
  payoutBankName: "GTBank",
  payoutAccountName: "Aminu Abdullahi",
  payoutAccountNumber: "0123456789",
  documents: [
    { id: "cac", label: "Business Registration / CAC", status: "uploaded", fileName: "cac-certificate.pdf" },
    { id: "identity", label: "Owner Government ID", status: "verified", fileName: "nin-slip.pdf" },
    { id: "bank", label: "Bank Account Proof", status: "missing" },
  ],
}

export const vendorProductsSeed: VendorProduct[] = [
  {
    id: "vp_001",
    name: "Bida Brasswork Vase",
    sku: "BCH-BV-001",
    category: "Crafts",
    price: 8500,
    stock: 24,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=120&h=120&fit=crop&auto=format",
    updatedAt: "2026-07-01",
  },
  {
    id: "vp_002",
    name: "Nupe Hand-Woven Fabric",
    sku: "BCH-NF-006",
    category: "Fabric",
    price: 15000,
    stock: 9,
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=120&h=120&fit=crop&auto=format",
    updatedAt: "2026-07-04",
  },
  {
    id: "vp_003",
    name: "Decorative Brass Tray",
    sku: "BCH-BT-014",
    category: "Crafts",
    price: 22000,
    stock: 0,
    status: "out_of_stock",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=120&h=120&fit=crop&auto=format",
    updatedAt: "2026-06-28",
  },
]

export const vendorOrdersSeed: VendorOrder[] = [
  {
    id: "ORD-2607-001",
    buyerName: "Hauwa Suleiman",
    buyerPhone: "+234 806 123 4567",
    item: "Bida Brasswork Vase",
    quantity: 2,
    amount: 17000,
    status: "new",
    deliveryAddress: "Tunga, Minna, Niger State",
    placedAt: "2026-07-07",
  },
  {
    id: "ORD-2607-002",
    buyerName: "Musa Ibrahim",
    buyerPhone: "+234 809 222 1122",
    item: "Nupe Hand-Woven Fabric",
    quantity: 1,
    amount: 15000,
    status: "processing",
    deliveryAddress: "Bida Road, Lapai",
    placedAt: "2026-07-06",
  },
  {
    id: "ORD-2606-014",
    buyerName: "Ramatu Tanko",
    buyerPhone: "+234 703 987 4444",
    item: "Decorative Brass Tray",
    quantity: 1,
    amount: 22000,
    status: "delivered",
    deliveryAddress: "Bosso Estate, Minna",
    placedAt: "2026-06-29",
  },
]

export const vendorPayoutsSeed: VendorPayout[] = [
  { id: "PAY-001", amount: 68000, status: "paid", destination: "GTBank **** 4821", requestedAt: "2026-06-20", paidAt: "2026-06-21" },
  { id: "PAY-002", amount: 31500, status: "processing", destination: "GTBank **** 4821", requestedAt: "2026-07-05" },
]

export const vendorDashboardSeed: VendorDashboard = {
  metrics: [
    { label: "Gross Sales", value: "₦462,000", change: "+18% this month", tone: "green" },
    { label: "Open Orders", value: "12", change: "4 need action", tone: "blue" },
    { label: "Available Balance", value: "₦128,500", change: "₦31,500 pending", tone: "amber" },
    { label: "Active Products", value: "87", change: "+3 this week", tone: "purple" },
  ],
  alerts: [
    { id: "a1", title: "Verification pending", body: "Bank account proof is still required before payouts are enabled.", tone: "amber" },
    { id: "a2", title: "New orders", body: "4 incoming orders are waiting for acceptance.", tone: "green" },
  ],
  recentOrders: vendorOrdersSeed,
  topProducts: vendorProductsSeed,
  earnings: [
    { month: "Feb", revenue: 72000, orders: 19 },
    { month: "Mar", revenue: 58000, orders: 15 },
    { month: "Apr", revenue: 89000, orders: 24 },
    { month: "May", revenue: 105000, orders: 31 },
    { month: "Jun", revenue: 93000, orders: 27 },
    { month: "Jul", revenue: 45000, orders: 12 },
  ],
}
