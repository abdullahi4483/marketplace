import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { AppEmptyState, AppErrorState, AppLoadingState } from "../../shared/components/AppStates"
import { AppField, appInputClass, appSelectClass } from "../../shared/components/AppForm"
import { formatNaira } from "../../shared/lib/format"
import { buyerApi } from "../lib/buyerApi"
import { useBuyer } from "../lib/BuyerContext"
import type { BuyerAddress, BuyerPaymentMethod } from "../lib/buyerTypes"
import { BuyerCartSummary } from "../components/BuyerCartSummary"

const delivery = 1500
const serviceFee = 500

const blankAddress: Omit<BuyerAddress, "id"> = {
  label: "Home",
  recipient: "",
  phone: "",
  address: "",
  lga: "Bosso",
  landmark: "",
  isDefault: false,
}

export function BuyerCheckoutPage() {
  const { cart, cartTotal, clearCart, user } = useBuyer()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<BuyerAddress[]>([])
  const [payments, setPayments] = useState<BuyerPaymentMethod[]>([])
  const [addressId, setAddressId] = useState("")
  const [paymentId, setPaymentId] = useState("")
  const [draftAddress, setDraftAddress] = useState(blankAddress)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const [nextAddresses, nextPayments] = await Promise.all([buyerApi.listAddresses(), buyerApi.listPaymentMethods()])
      setAddresses(nextAddresses)
      setPayments(nextPayments)
      setAddressId(nextAddresses.find((address) => address.isDefault)?.id ?? nextAddresses[0]?.id ?? "new")
      setPaymentId(nextPayments.find((method) => method.isDefault)?.id ?? nextPayments[0]?.id ?? "delivery")
      setDraftAddress({ ...blankAddress, recipient: user?.name ?? "", phone: user?.phone ?? "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load checkout")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const placeOrder = async () => {
    try {
      setSaving(true)
      setError("")
      const selectedAddress = addressId === "new" ? await buyerApi.saveAddress(draftAddress) : addresses.find((address) => address.id === addressId)
      const selectedPayment = payments.find((payment) => payment.id === paymentId)
      if (!selectedAddress) throw new Error("Select or create a delivery address")
      const order = await buyerApi.createOrder({
        items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity, variantId: item.variantId })),
        address: selectedAddress,
        paymentMethod: selectedPayment?.label ?? "Pay on delivery",
        total: cartTotal + delivery + serviceFee,
      })
      clearCart()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to place order")
    } finally {
      setSaving(false)
    }
  }

  if (cart.length === 0) {
    return <div className="mx-auto max-w-4xl px-4 py-10"><AppEmptyState title="No items to checkout" body="Your cart is empty." action={<Link to="/products" className="inline-flex min-h-11 items-center rounded-xl bg-green-700 px-4 text-sm font-bold text-white">Browse products</Link>} /></div>
  }
  if (loading) return <div className="mx-auto max-w-7xl px-4 py-6"><AppLoadingState label="Loading checkout" /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-black text-gray-900">Checkout</h1>
      {error && <div className="mb-4"><AppErrorState body={error} onRetry={load} /></div>}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-5">
          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h2 className="font-black text-gray-900">Delivery address</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {addresses.map((address) => (
                <label key={address.id} className={`cursor-pointer rounded-xl border p-4 ${addressId === address.id ? "border-green-700 bg-green-50" : "border-green-100"}`}>
                  <input type="radio" name="address" checked={addressId === address.id} onChange={() => setAddressId(address.id)} className="sr-only" />
                  <p className="font-bold text-gray-900">{address.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{address.recipient}, {address.phone}</p>
                  <p className="text-sm text-gray-600">{address.address}, {address.lga}</p>
                </label>
              ))}
              <label className={`cursor-pointer rounded-xl border p-4 ${addressId === "new" ? "border-green-700 bg-green-50" : "border-green-100"}`}>
                <input type="radio" name="address" checked={addressId === "new"} onChange={() => setAddressId("new")} className="sr-only" />
                <p className="font-bold text-gray-900">Use a new address</p>
                <p className="mt-1 text-sm text-gray-600">Save it while placing this order.</p>
              </label>
            </div>

            {addressId === "new" && (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <AppField label="Label"><input value={draftAddress.label} onChange={(event) => setDraftAddress({ ...draftAddress, label: event.target.value })} className={appInputClass} /></AppField>
                <AppField label="Recipient"><input value={draftAddress.recipient} onChange={(event) => setDraftAddress({ ...draftAddress, recipient: event.target.value })} className={appInputClass} /></AppField>
                <AppField label="Phone"><input value={draftAddress.phone} onChange={(event) => setDraftAddress({ ...draftAddress, phone: event.target.value })} className={appInputClass} /></AppField>
                <AppField label="LGA"><select value={draftAddress.lga} onChange={(event) => setDraftAddress({ ...draftAddress, lga: event.target.value })} className={appSelectClass}>{["Bosso", "Bida", "Chanchaga", "Lavun", "Suleja"].map((lga) => <option key={lga}>{lga}</option>)}</select></AppField>
                <div className="md:col-span-2"><AppField label="Address"><input value={draftAddress.address} onChange={(event) => setDraftAddress({ ...draftAddress, address: event.target.value })} className={appInputClass} /></AppField></div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h2 className="font-black text-gray-900">Payment method</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {payments.map((payment) => (
                <label key={payment.id} className={`cursor-pointer rounded-xl border p-4 ${paymentId === payment.id ? "border-green-700 bg-green-50" : "border-green-100"}`}>
                  <input type="radio" name="payment" checked={paymentId === payment.id} onChange={() => setPaymentId(payment.id)} className="sr-only" />
                  <p className="font-bold capitalize text-gray-900">{payment.type}</p>
                  <p className="mt-1 text-sm text-gray-600">{payment.label}{payment.last4 ? ` ending ${payment.last4}` : ""}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h2 className="font-black text-gray-900">Items</h2>
            <div className="mt-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-gray-900">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity} · {item.product.vendor.name}</p>
                  </div>
                  <span className="font-black text-green-700">{formatNaira(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BuyerCartSummary
          subtotal={cartTotal}
          delivery={delivery}
          serviceFee={serviceFee}
          action={<button onClick={() => void placeOrder()} disabled={saving} className="w-full rounded-xl bg-green-700 px-4 py-3 font-black text-white hover:bg-green-800 disabled:opacity-50">{saving ? "Placing order..." : "Place order"}</button>}
        />
      </div>
    </div>
  )
}
