import type { ReactNode } from "react"

const tones = {
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
  red: "bg-red-50 text-red-700",
}

export function VendorMetricCard({ label, value, change, icon, tone = "green" }: { label: string; value: string; change?: string; icon?: ReactNode; tone?: keyof typeof tones }) {
  return (
    <div className="rounded-xl border border-green-100 bg-white p-4">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon ?? <span className="h-2 w-2 rounded-full bg-current" />}
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      {change && <p className="mt-2 text-xs font-semibold text-green-700">{change}</p>}
    </div>
  )
}
