import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertCircle, CreditCard, Package, ShoppingBag, TrendingUp } from "lucide-react"
import { VendorMetricCard } from "../components/VendorMetricCard"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import { VendorErrorState, VendorLoadingState } from "../components/VendorStates"
import { vendorApi } from "../lib/vendorApi"
import { formatNaira } from "../lib/format"
import type { VendorDashboard } from "../lib/vendorTypes"

const icons = [<TrendingUp size={20} />, <Package size={20} />, <CreditCard size={20} />, <ShoppingBag size={20} />]

export function VendorDashboardPage() {
  const [dashboard, setDashboard] = useState<VendorDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      setDashboard(await vendorApi.getDashboard())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  if (loading) return <VendorLoadingState label="Loading dashboard" />
  if (error || !dashboard) return <VendorErrorState body={error || "Dashboard data was not found"} onRetry={load} />

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Sales, order activity, earnings, and account alerts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric, index) => (
          <VendorMetricCard key={metric.label} {...metric} icon={icons[index]} />
        ))}
      </div>

      {dashboard.alerts.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {dashboard.alerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl border p-4 ${alert.tone === "amber" ? "border-amber-100 bg-amber-50" : alert.tone === "red" ? "border-red-100 bg-red-50" : "border-green-100 bg-green-50"}`}>
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 text-current" />
                <div>
                  <p className="font-bold text-gray-900">{alert.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{alert.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-green-100 bg-white p-5 xl:col-span-2">
          <h3 className="mb-4 font-bold text-gray-900">Earnings overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dashboard.earnings}>
              <defs>
                <linearGradient id="vendorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecfdf5" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₦${Number(value) / 1000}k`} />
              <Tooltip formatter={(value: number) => [formatNaira(value), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#15803d" strokeWidth={2.5} fill="url(#vendorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-green-100 bg-white p-5">
          <h3 className="mb-4 font-bold text-gray-900">Recent orders</h3>
          <div className="space-y-3">
            {dashboard.recentOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-green-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.item}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{order.id} · {order.buyerName}</p>
                  </div>
                  <VendorStatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm font-bold text-green-700">{formatNaira(order.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-5">
        <h3 className="mb-4 font-bold text-gray-900">Top products</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {dashboard.topProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-3 rounded-xl border border-green-50 p-3">
              <img src={product.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.stock} in stock</p>
              </div>
              <p className="ml-auto text-sm font-bold text-green-700">{formatNaira(product.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
