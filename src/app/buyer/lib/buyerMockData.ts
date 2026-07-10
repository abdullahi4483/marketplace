import type { BuyerAddress, BuyerCategory, BuyerOrder, BuyerPaymentMethod, BuyerProduct, BuyerUser } from "./buyerTypes"

const vendors = [
  {
    id: "s1",
    name: "Bida Craft Hub",
    location: "Bida, Niger State",
    rating: 4.8,
    verified: true,
    phone: "+234 803 456 7890",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
  },
  {
    id: "s4",
    name: "Minna Tech Store",
    location: "Bosso, Niger State",
    rating: 4.7,
    verified: true,
    phone: "+234 803 234 5678",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format",
  },
  {
    id: "s3",
    name: "Niger Farm Direct",
    location: "Lavun, Niger State",
    rating: 4.6,
    verified: true,
    phone: "+234 812 345 6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format",
  },
]

export const buyerProductsSeed: BuyerProduct[] = [
  {
    id: "bp_001",
    name: "Bida Brasswork Vase",
    nameHa: "Kwano na Tagulla na Bida",
    price: 8500,
    originalPrice: 12000,
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&auto=format",
    ],
    category: "crafts",
    lga: "Bida",
    location: "Bida",
    vendor: vendors[0],
    rating: 4.8,
    reviewCount: 124,
    description: "Authentic hand-crafted brasswork vase from renowned Bida artisans.",
    inStock: true,
    stock: 24,
    tags: ["brasswork", "nupe", "handmade"],
    variants: [{ id: "small", label: "Size", value: "Small" }, { id: "large", label: "Size", value: "Large" }],
    reviews: [
      { id: "r1", userName: "Aisha Bello", rating: 5, comment: "Excellent quality and fast delivery.", createdAt: "2026-06-15" },
      { id: "r2", userName: "Ibrahim Tanko", rating: 4, comment: "Very good product. Packaging could be better.", createdAt: "2026-06-18" },
    ],
  },
  {
    id: "bp_002",
    name: "Samsung Galaxy A55",
    price: 285000,
    originalPrice: 320000,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format"],
    category: "electronics",
    lga: "Bosso",
    location: "Minna",
    vendor: vendors[1],
    rating: 4.7,
    reviewCount: 56,
    description: "Brand new Samsung Galaxy A55 5G with 256GB storage and warranty.",
    inStock: true,
    stock: 12,
    tags: ["phone", "samsung", "electronics"],
    reviews: [{ id: "r3", userName: "Fatima Umar", rating: 5, comment: "Original device. Seller was responsive.", createdAt: "2026-06-22" }],
  },
  {
    id: "bp_003",
    name: "Niger Local Rice (50kg Bag)",
    price: 38000,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop&auto=format"],
    category: "food",
    lga: "Lavun",
    location: "Lavun",
    vendor: vendors[2],
    rating: 4.6,
    reviewCount: 203,
    description: "Fresh locally grown Nigerian parboiled rice from Lavun LGA farms.",
    inStock: true,
    stock: 45,
    tags: ["rice", "local", "farm"],
    reviews: [],
  },
  {
    id: "bp_004",
    name: "Modern Sofa Set",
    price: 195000,
    originalPrice: 240000,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format"],
    category: "furniture",
    lga: "Suleja",
    location: "Suleja",
    vendor: { ...vendors[0], id: "s7", name: "Suleja Home Depot", location: "Suleja, Niger State" },
    rating: 4.4,
    reviewCount: 38,
    description: "Premium 3+1+1 modern sofa set with high-density foam cushioning.",
    inStock: true,
    stock: 4,
    tags: ["sofa", "furniture", "home"],
    reviews: [],
  },
]

export const buyerCategoriesSeed: BuyerCategory[] = [
  { id: "crafts", name: "Crafts", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=260&fit=crop&auto=format", count: 245 },
  { id: "electronics", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=260&fit=crop&auto=format", count: 267 },
  { id: "food", name: "Groceries", image: "https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=260&fit=crop&auto=format", count: 456 },
  { id: "furniture", name: "Furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=260&fit=crop&auto=format", count: 178 },
]

export const buyerUserSeed: BuyerUser = {
  id: "buyer_001",
  name: "Aminu Bello",
  email: "aminu.bello@email.com",
  phone: "+234 803 456 7890",
  verified: false,
  lga: "Bosso",
}

export const buyerAddressesSeed: BuyerAddress[] = [
  { id: "addr_1", label: "Home", recipient: "Aminu Bello", phone: "+234 803 456 7890", address: "House 14, Bosso Estate", lga: "Bosso", landmark: "Near central mosque", isDefault: true },
  { id: "addr_2", label: "Office", recipient: "Aminu Bello", phone: "+234 803 456 7890", address: "Tunga Business District", lga: "Chanchaga", isDefault: false },
]

export const buyerPaymentMethodsSeed: BuyerPaymentMethod[] = [
  { id: "pay_1", type: "card", label: "Verve card", last4: "4242", isDefault: true },
  { id: "pay_2", type: "delivery", label: "Pay on delivery", isDefault: false },
]

export const buyerOrdersSeed: BuyerOrder[] = [
  {
    id: "ORD-2026-001",
    status: "shipped",
    placedAt: "2026-07-04",
    total: 25500,
    address: buyerAddressesSeed[0],
    paymentMethod: "Card",
    tracking: [
      { label: "Order placed", date: "2026-07-04", done: true },
      { label: "Vendor accepted", date: "2026-07-04", done: true },
      { label: "Shipped", date: "2026-07-05", done: true },
      { label: "Delivered", date: "Pending", done: false },
    ],
    items: [
      { id: "oi_1", productId: "bp_001", productName: "Bida Brasswork Vase", productImage: buyerProductsSeed[0].images[0], vendorName: "Bida Craft Hub", quantity: 3, amount: 25500, reviewed: false },
    ],
  },
]
