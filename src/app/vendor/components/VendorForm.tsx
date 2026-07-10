import type { ReactNode } from "react"

export function VendorField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}

export const vendorInputClass = "w-full rounded-xl border-2 border-green-200 bg-green-50/30 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-green-600"
export const vendorSelectClass = "w-full rounded-xl border-2 border-green-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-green-600"
export const vendorTextareaClass = "min-h-28 w-full rounded-xl border-2 border-green-200 bg-green-50/30 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-green-600"
