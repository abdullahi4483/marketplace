import { useEffect, useMemo, useState } from "react"
import { Eye } from "lucide-react"
import { VendorDataTable, type VendorColumn } from "../components/VendorDataTable"
import { VendorModal } from "../components/VendorModal"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import { VendorEmptyState, VendorErrorState, VendorLoadingState } from "../components/VendorStates"
import { formatNaira } from "../lib/format"
import { vendorApi } from "../lib/vendorApi"
import type { VendorOrder, VendorOrderStatus } from "../lib/vendorTypes"

const nextStatuses: VendorOrderStatus[] = ["accepted", "processing", "ready", "shipped", "delivered", "cancelled"]

export function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([])
  const [selected, setSelected] = useState<VendorOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      setOrders(await vendorApi.listOrders())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const updateStatus = async (id: string, status: VendorOrderStatus) => {
    const updated = await vendorApi.updateOrderStatus(id, status)
    setOrders((current) => current.map((order) => order.id === id ? updated : order))
    setSelected((current) => current?.id === id ? updated : current)
  }

  const columns = useMemo<VendorColumn<VendorOrder>[]>(() => [
    { key: "id", header: "Order ID", render: (order) => <span className="font-mono text-xs text-gray-500">{order.id}</span> },
    {
      key: "order",
      header: "Order",
      render: (order) => (
        <div>
          <p className="font-semibold text-gray-900">{order.item}</p>
          <p className="text-xs text-gray-500">Qty {order.quantity} · {order.buyerName}</p>
        </div>
      ),
    },
    { key: "date", header: "Date", render: (order) => <span className="text-gray-600">{order.placedAt}</span> },
    { key: "amount", header: "Amount", render: (order) => <span className="font-bold text-green-700">{formatNaira(order.amount)}</span> },
    { key: "status", header: "Status", render: (order) => <VendorStatusBadge status={order.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (order) => (
        <button onClick={() => setSelected(order)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50">
          <Eye size={14} />
          View
        </button>
      ),
    },
  ], [])

  if (loading) return <VendorLoadingState label="Loading orders" />
  if (error) return <VendorErrorState body={error} onRetry={load} />

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-gray-900">Order management</h2>
        <p className="mt-1 text-sm text-gray-500">Review incoming orders, inspect buyer details, and update fulfillment status.</p>
      </div>

      <VendorDataTable
        columns={columns}
        rows={orders}
        empty={<VendorEmptyState title="No orders yet" body="Incoming vendor orders will appear here when buyers place orders." />}
      />

      <VendorModal
        open={Boolean(selected)}
        title={selected ? selected.id : "Order details"}
        onClose={() => setSelected(null)}
        footer={selected && (
          <>
            <button onClick={() => setSelected(null)} className="rounded-xl border border-green-200 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-50">Close</button>
            <select
              value={selected.status}
              onChange={(event) => void updateStatus(selected.id, event.target.value as VendorOrderStatus)}
              className="rounded-xl border-2 border-green-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 outline-none focus:border-green-600"
            >
              {[selected.status, ...nextStatuses.filter((status) => status !== selected.status)].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </>
        )}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 rounded-xl bg-green-50 p-4">
              <div>
                <p className="font-bold text-gray-900">{selected.item}</p>
                <p className="mt-1 text-sm text-gray-600">Quantity {selected.quantity}</p>
              </div>
              <VendorStatusBadge status={selected.status} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-green-100 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Buyer</p>
                <p className="mt-2 font-bold text-gray-900">{selected.buyerName}</p>
                <p className="text-sm text-gray-600">{selected.buyerPhone}</p>
              </div>
              <div className="rounded-xl border border-green-100 p-4">
                <p className="text-xs font-semibold uppercase text-gray-500">Payment</p>
                <p className="mt-2 text-xl font-black text-green-700">{formatNaira(selected.amount)}</p>
                <p className="text-sm text-gray-600">Placed {selected.placedAt}</p>
              </div>
            </div>
            <div className="rounded-xl border border-green-100 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Delivery address</p>
              <p className="mt-2 text-sm text-gray-700">{selected.deliveryAddress}</p>
            </div>
          </div>
        )}
      </VendorModal>
    </div>
  )
}
