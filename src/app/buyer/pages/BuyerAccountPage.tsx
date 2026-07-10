import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router"
import { AppDataTable, type AppColumn } from "../../shared/components/AppDataTable"
import { AppEmptyState, AppErrorState, AppLoadingState } from "../../shared/components/AppStates"
import { AppField, appInputClass, appSelectClass, appTextareaClass } from "../../shared/components/AppForm"
import { AppStatusBadge } from "../../shared/components/AppStatusBadge"
import { formatNaira } from "../../shared/lib/format"
import { buyerApi } from "../lib/buyerApi"
import { useBuyer } from "../lib/BuyerContext"
import type { BuyerAddress, BuyerOrder, BuyerOrderItem, BuyerPaymentMethod, BuyerProduct, BuyerUser } from "../lib/buyerTypes"
import { BuyerProductCard } from "../components/BuyerProductCard"
import { BuyerRating } from "../components/BuyerRating"

type AccountTab = "overview" | "orders" | "addresses" | "payments" | "profile" | "wishlist"

function useTab(): AccountTab {
  const location = useLocation()
  const tab = new URLSearchParams(location.search).get("tab") as AccountTab | null
  return tab ?? "overview"
}

export function BuyerAccountPage() {
  const { user, updateProfile, wishlist } = useBuyer()
  const navigate = useNavigate()
  const tab = useTab()
  const [orders, setOrders] = useState<BuyerOrder[]>([])
  const [addresses, setAddresses] = useState<BuyerAddress[]>([])
  const [payments, setPayments] = useState<BuyerPaymentMethod[]>([])
  const [wishlistProducts, setWishlistProducts] = useState<BuyerProduct[]>([])
  const [draftUser, setDraftUser] = useState<Partial<BuyerUser>>({})
  const [draftAddress, setDraftAddress] = useState<Omit<BuyerAddress, "id">>({ label: "Home", recipient: "", phone: "", address: "", lga: "Bosso", isDefault: false })
  const [draftPayment, setDraftPayment] = useState<Omit<BuyerPaymentMethod, "id">>({ type: "delivery", label: "Pay on delivery", isDefault: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const [nextOrders, nextAddresses, nextPayments, products] = await Promise.all([
        buyerApi.listOrders(),
        buyerApi.listAddresses(),
        buyerApi.listPaymentMethods(),
        buyerApi.listProducts(),
      ])
      setOrders(nextOrders)
      setAddresses(nextAddresses)
      setPayments(nextPayments)
      setWishlistProducts(products.filter((product) => wishlist.includes(product.id)))
      setDraftUser(user ?? {})
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load buyer account")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [wishlist.length, user?.id])

  const orderColumns = useMemo<AppColumn<BuyerOrder>[]>(() => [
    { key: "id", header: "Order", render: (order) => <span className="font-mono text-xs text-gray-500">{order.id}</span> },
    { key: "date", header: "Placed", render: (order) => <span>{order.placedAt}</span> },
    { key: "items", header: "Items", render: (order) => <span>{order.items.length} item{order.items.length === 1 ? "" : "s"}</span> },
    { key: "total", header: "Total", render: (order) => <span className="font-black text-green-700">{formatNaira(order.total)}</span> },
    { key: "status", header: "Status", render: (order) => <AppStatusBadge status={order.status} /> },
    { key: "action", header: "Action", render: (order) => <Link to={`/orders/${order.id}`} className="font-bold text-green-700">View</Link> },
  ], [])

  if (!user) {
    return <div className="mx-auto max-w-4xl px-4 py-10"><AppEmptyState title="Login required" body="Login to view orders, addresses, payments, and profile settings." action={<button onClick={() => navigate("/auth")} className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white">Login</button>} /></div>
  }
  if (loading) return <div className="mx-auto max-w-7xl px-4 py-6"><AppLoadingState label="Loading buyer account" /></div>
  if (error) return <div className="mx-auto max-w-7xl px-4 py-6"><AppErrorState body={error} onRetry={load} /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <p className="text-sm font-bold text-green-700">Buyer workspace</p>
        <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border border-green-100 bg-white p-3">
          {(["overview", "orders", "addresses", "payments", "profile", "wishlist"] as AccountTab[]).map((item) => (
            <Link key={item} to={`/dashboard?tab=${item}`} className={`mb-1 block rounded-xl px-3 py-2.5 text-sm font-bold capitalize ${tab === item ? "bg-green-700 text-white" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>{item}</Link>
          ))}
        </aside>

        <section className="min-w-0">
          {tab === "overview" && (
            <div className="grid gap-4 md:grid-cols-3">
              {[{ label: "Orders", value: orders.length }, { label: "Addresses", value: addresses.length }, { label: "Wishlist", value: wishlist.length }].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-green-100 bg-white p-5">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-black text-green-700">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "orders" && <AppDataTable columns={orderColumns} rows={orders} empty={<AppEmptyState title="No orders yet" body="Orders will appear here after checkout." />} />}

          {tab === "addresses" && (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-xl border border-green-100 bg-white p-4">
                    <p className="font-black text-gray-900">{address.label}</p>
                    <p className="mt-1 text-sm text-gray-600">{address.recipient}, {address.phone}</p>
                    <p className="text-sm text-gray-600">{address.address}, {address.lga}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-green-100 bg-white p-5">
                <h2 className="font-black text-gray-900">Add address</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <AppField label="Label"><input value={draftAddress.label} onChange={(event) => setDraftAddress({ ...draftAddress, label: event.target.value })} className={appInputClass} /></AppField>
                  <AppField label="Recipient"><input value={draftAddress.recipient} onChange={(event) => setDraftAddress({ ...draftAddress, recipient: event.target.value })} className={appInputClass} /></AppField>
                  <AppField label="Phone"><input value={draftAddress.phone} onChange={(event) => setDraftAddress({ ...draftAddress, phone: event.target.value })} className={appInputClass} /></AppField>
                  <AppField label="LGA"><input value={draftAddress.lga} onChange={(event) => setDraftAddress({ ...draftAddress, lga: event.target.value })} className={appInputClass} /></AppField>
                  <div className="md:col-span-2"><AppField label="Address"><input value={draftAddress.address} onChange={(event) => setDraftAddress({ ...draftAddress, address: event.target.value })} className={appInputClass} /></AppField></div>
                </div>
                <button onClick={async () => { await buyerApi.saveAddress(draftAddress); await load() }} className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white">Save address</button>
              </div>
            </div>
          )}

          {tab === "payments" && (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-xl border border-green-100 bg-white p-4">
                    <p className="font-black capitalize text-gray-900">{payment.type}</p>
                    <p className="mt-1 text-sm text-gray-600">{payment.label}{payment.last4 ? ` ending ${payment.last4}` : ""}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-green-100 bg-white p-5">
                <h2 className="font-black text-gray-900">Add payment method</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <AppField label="Type"><select value={draftPayment.type} onChange={(event) => setDraftPayment({ ...draftPayment, type: event.target.value as BuyerPaymentMethod["type"] })} className={appSelectClass}>{["card", "bank", "ussd", "delivery"].map((type) => <option key={type}>{type}</option>)}</select></AppField>
                  <AppField label="Label"><input value={draftPayment.label} onChange={(event) => setDraftPayment({ ...draftPayment, label: event.target.value })} className={appInputClass} /></AppField>
                </div>
                <button onClick={async () => { await buyerApi.savePaymentMethod(draftPayment); await load() }} className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white">Save payment</button>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="rounded-xl border border-green-100 bg-white p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <AppField label="Name"><input value={draftUser.name ?? ""} onChange={(event) => setDraftUser({ ...draftUser, name: event.target.value })} className={appInputClass} /></AppField>
                <AppField label="Email"><input value={draftUser.email ?? ""} onChange={(event) => setDraftUser({ ...draftUser, email: event.target.value })} className={appInputClass} /></AppField>
                <AppField label="Phone"><input value={draftUser.phone ?? ""} onChange={(event) => setDraftUser({ ...draftUser, phone: event.target.value })} className={appInputClass} /></AppField>
                <AppField label="LGA"><input value={draftUser.lga ?? ""} onChange={(event) => setDraftUser({ ...draftUser, lga: event.target.value })} className={appInputClass} /></AppField>
              </div>
              <button onClick={() => void updateProfile(draftUser)} className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white">Save profile</button>
            </div>
          )}

          {tab === "wishlist" && (
            wishlistProducts.length > 0 ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{wishlistProducts.map((product) => <BuyerProductCard key={product.id} product={product} />)}</div> : <AppEmptyState title="Wishlist is empty" body="Save products you want to revisit later." />
          )}
        </section>
      </div>
    </div>
  )
}

export function BuyerOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<BuyerOrder | null>(null)
  const [reviewing, setReviewing] = useState<BuyerOrderItem | null>(null)
  const [review, setReview] = useState({ rating: 5, comment: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError("")
      setOrder(await buyerApi.getOrder(id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [id])

  const submitReview = async () => {
    if (!reviewing) return
    await buyerApi.submitReview(reviewing.productId, { userName: "Verified buyer", rating: review.rating, comment: review.comment })
    setReviewing(null)
    setReview({ rating: 5, comment: "" })
  }

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-6"><AppLoadingState label="Loading order" /></div>
  if (error) return <div className="mx-auto max-w-5xl px-4 py-6"><AppErrorState body={error} onRetry={load} /></div>
  if (!order) return <div className="mx-auto max-w-5xl px-4 py-6"><AppEmptyState title="Order not found" body="This order could not be found." /></div>

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{order.id}</h1>
          <p className="text-sm text-gray-500">Placed {order.placedAt}</p>
        </div>
        <AppStatusBadge status={order.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-5">
          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h2 className="font-black text-gray-900">Tracking</h2>
            <div className="mt-4 space-y-3">
              {order.tracking.map((step) => (
                <div key={step.label} className="flex gap-3">
                  <div className={`mt-1 h-3 w-3 rounded-full ${step.done ? "bg-green-700" : "bg-gray-300"}`} />
                  <div>
                    <p className="font-bold text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-green-100 bg-white p-5">
            <h2 className="font-black text-gray-900">Items</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.productImage} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity} · {item.vendorName}</p>
                  </div>
                  <span className="font-black text-green-700">{formatNaira(item.amount)}</span>
                  <button onClick={() => setReviewing(item)} className="rounded-xl border border-green-200 px-3 py-2 text-sm font-bold text-green-700 hover:bg-green-50">Review</button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="h-fit rounded-xl border border-green-100 bg-white p-5">
          <h2 className="font-black text-gray-900">Delivery</h2>
          <p className="mt-3 text-sm text-gray-600">{order.address.recipient}</p>
          <p className="text-sm text-gray-600">{order.address.phone}</p>
          <p className="text-sm text-gray-600">{order.address.address}, {order.address.lga}</p>
          <div className="mt-4 border-t border-green-100 pt-4">
            <p className="text-sm text-gray-500">Payment</p>
            <p className="font-bold text-gray-900">{order.paymentMethod}</p>
            <p className="mt-2 text-2xl font-black text-green-700">{formatNaira(order.total)}</p>
          </div>
        </aside>
      </div>

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5">
            <h2 className="font-black text-gray-900">Review {reviewing.productName}</h2>
            <div className="mt-4 space-y-4">
              <BuyerRating rating={review.rating} />
              <AppField label="Rating"><select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })} className={appSelectClass}>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}</option>)}</select></AppField>
              <AppField label="Comment"><textarea value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} className={appTextareaClass} /></AppField>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setReviewing(null)} className="rounded-xl border border-green-200 px-4 py-2 text-sm font-bold text-green-700">Cancel</button>
              <button onClick={() => void submitReview()} className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white">Submit review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
