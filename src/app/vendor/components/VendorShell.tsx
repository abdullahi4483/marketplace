import type { ReactNode } from "react"
import { BarChart2, CreditCard, Home, Package, Settings, ShoppingBag, Store } from "lucide-react"

export type VendorSection = "onboarding" | "dashboard" | "products" | "orders" | "payouts" | "settings"

const navItems: Array<{ id: VendorSection; label: string; icon: ReactNode }> = [
  { id: "onboarding", label: "Onboarding", icon: <Store size={16} /> },
  { id: "dashboard", label: "Dashboard", icon: <Home size={16} /> },
  { id: "products", label: "Products", icon: <ShoppingBag size={16} /> },
  { id: "orders", label: "Orders", icon: <Package size={16} /> },
  { id: "payouts", label: "Payouts", icon: <CreditCard size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
]

export function VendorShell({
  active,
  storeName,
  status,
  children,
  onNavigate,
}: {
  active: VendorSection
  storeName: string
  status: ReactNode
  children: ReactNode
  onNavigate: (section: VendorSection) => void
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <BarChart2 size={15} />
              Vendor Workspace
            </div>
            <h1 className="mt-1 text-2xl font-black text-gray-900">{storeName}</h1>
          </div>
          {status}
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="md:w-64 md:shrink-0">
            <div className="rounded-xl border border-green-100 bg-white p-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${active === item.id ? "bg-green-700 text-white" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </aside>
          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </div>
    </div>
  )
}
