import { formatNaira } from "../../shared/lib/format"

export function BuyerPrice({ price, originalPrice, compact = false }: { price: number; originalPrice?: number; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={compact ? "font-black text-green-700" : "text-2xl font-black text-green-700"}>{formatNaira(price)}</span>
      {originalPrice && (
        <span className="text-sm font-medium text-gray-400 line-through">{formatNaira(originalPrice)}</span>
      )}
    </div>
  )
}
