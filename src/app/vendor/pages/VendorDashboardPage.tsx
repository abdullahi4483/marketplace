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
    <>
    
    <div className="space-y-6">
      <div className="ms-3">
        <div>
        <img src="data:image/png;base64,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" alt="ven" className="mb-5 rounded-lg h-20 w-20" style={{ borderRadius: '2.5rem', marginBottom: '1.25rem' }}/>
        </div>
        <div className="w-200 bg-white p-4 rounded-xxl border border-green-100" style={{borderRadius: '2.5rem'}}>
        <p className="mt-1 text-sm text-gray-500">Sales, order activity, earnings, and account alerts.kdlasjhblsak;dbnsadxnsadxl;asbdxs;a.dvxsa.;dxkagbs.kfaskljdbaiodahboihb</p>
        </div>
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
    </>
  )
}
