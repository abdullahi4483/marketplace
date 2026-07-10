import type { DocumentStatus, PayoutStatus, ProductStatus, VendorOrderStatus, VendorStatus } from "../lib/vendorTypes"

type Status = VendorStatus | DocumentStatus | ProductStatus | VendorOrderStatus | PayoutStatus

const labels: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  missing: "Missing",
  uploaded: "Uploaded",
  verified: "Verified",
  active: "Active",
  out_of_stock: "Out of stock",
  suspended: "Suspended",
  new: "New",
  accepted: "Accepted",
  processing: "Processing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  paid: "Paid",
  failed: "Failed",
}

const tones: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  missing: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-700",
  uploaded: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  accepted: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  verified: "bg-emerald-100 text-emerald-700",
  active: "bg-emerald-100 text-emerald-700",
  ready: "bg-emerald-100 text-emerald-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  suspended: "bg-red-100 text-red-700",
  out_of_stock: "bg-orange-100 text-orange-700",
  new: "bg-purple-100 text-purple-700",
}

export function VendorStatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status] ?? tones.draft}`}>
      {labels[status] ?? status}
    </span>
  )
}
