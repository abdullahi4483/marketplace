const tones: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
  paid: "bg-green-100 text-green-700",
  active: "bg-emerald-100 text-emerald-700",
  verified: "bg-emerald-100 text-emerald-700",
  new: "bg-purple-100 text-purple-700",
}

export function AppStatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status] ?? "bg-gray-100 text-gray-700"}`}>
      {label ?? status.replaceAll("_", " ")}
    </span>
  )
}
