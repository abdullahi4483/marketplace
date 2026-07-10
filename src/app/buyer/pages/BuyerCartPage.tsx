import { Link, useNavigate } from "react-router"
import { Minus, Plus, Trash2 } from "lucide-react"
import { AppEmptyState } from "../../shared/components/AppStates"
import { formatNaira } from "../../shared/lib/format"
import { useBuyer } from "../lib/BuyerContext"
import { BuyerCartSummary } from "../components/BuyerCartSummary"

const delivery = 1500
const serviceFee = 500

export function BuyerCartPage() {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, clearCart } = useBuyer()
  const navigate = useNavigate()

  const grouped = cart.reduce<Record<string, typeof cart>>((groups, item) => {
    const key = item.product.vendor.id
    groups[key] = groups[key] ? [...groups[key], item] : [item]
    return groups
  }, {})

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <AppEmptyState
          title="Your cart is empty"
          body="Add products from verified NigerMart vendors to start checkout."
          action={<Link to="/products" className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white">Browse products</Link>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cart</h1>
          <p className="text-sm text-gray-500">{cart.length} line items grouped by vendor</p>
        </div>
        <button onClick={clearCart} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Clear cart</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {Object.entries(grouped).map(([vendorId, items]) => (
            <div key={vendorId} className="overflow-hidden rounded-xl border border-green-100 bg-white">
              <div className="border-b border-green-100 bg-green-50 px-4 py-3">
                <p className="font-black text-gray-900">{items[0].product.vendor.name}</p>
                <p className="text-xs text-gray-500">{items[0].product.vendor.location}</p>
              </div>
              <div className="divide-y divide-green-50">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variantId ?? "default"}`} className="flex gap-4 p-4">
                    <img src={item.product.images[0]} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${item.product.id}`} className="font-bold text-gray-900 hover:text-green-700">{item.product.name}</Link>
                      {item.variantId && <p className="text-xs text-gray-500">Variant: {item.product.variants?.find((variant) => variant.id === item.variantId)?.value ?? item.variantId}</p>}
                      <p className="mt-1 font-black text-green-700">{formatNaira(item.product.price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2">
                      <button onClick={() => removeFromCart(item.product.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Remove item"><Trash2 size={16} /></button>
                      <div className="flex items-center rounded-xl border border-green-200">
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-2 text-green-700"><Minus size={15} /></button>
                        <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-2 text-green-700"><Plus size={15} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <BuyerCartSummary
          subtotal={cartTotal}
          delivery={delivery}
          serviceFee={serviceFee}
          action={<button onClick={() => navigate("/checkout")} className="w-full rounded-xl bg-green-700 px-4 py-3 font-black text-white hover:bg-green-800">Continue to checkout</button>}
        />
      </div>
    </div>
  )
}
