import { formatNaira } from "../../shared/lib/format"
import type { ReactNode } from "react"

export function BuyerCartSummary({
  subtotal,
  delivery,
  serviceFee,
  action,
}: {
  subtotal: number
  delivery: number
  serviceFee: number
  action?: ReactNode
}) {
  const total = subtotal + delivery + serviceFee

  return (
    <aside className="rounded-xl border border-green-100 bg-white p-5">
      <h2 className="font-black text-gray-900">Order summary</h2>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>{formatNaira(delivery)}</span></div>
        <div className="flex justify-between"><span>Service fee</span><span>{formatNaira(serviceFee)}</span></div>
        <div className="flex justify-between border-t border-green-100 pt-3 text-base font-black text-green-700">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
      </div>
      {action && <div className="mt-5">{action}</div>}
    </aside>
  )
}
