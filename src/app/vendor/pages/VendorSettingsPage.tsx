import { useState } from "react"
import { VendorField, vendorInputClass, vendorTextareaClass } from "../components/VendorForm"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import type { VendorProfile } from "../lib/vendorTypes"

export function VendorSettingsPage({ profile, onSave }: { profile: VendorProfile; onSave: (updates: Partial<VendorProfile>) => Promise<void> }) {
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const set = (key: keyof VendorProfile, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const save = async () => {
    setSaving(true)
    await onSave(form)
    setMessage("Settings saved")
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Vendor settings</h2>
          <p className="mt-1 text-sm text-gray-500">Manage public store information, branding, and policies.</p>
        </div>
        <VendorStatusBadge status={profile.status} />
      </div>

      {message && <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm font-semibold text-green-700">{message}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border border-green-100 bg-white p-5 lg:col-span-2">
          <h3 className="font-bold text-gray-900">Store profile</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <VendorField label="Store name">
              <input value={form.storeName} onChange={(event) => set("storeName", event.target.value)} className={vendorInputClass} />
            </VendorField>
            <VendorField label="Owner name">
              <input value={form.ownerName} onChange={(event) => set("ownerName", event.target.value)} className={vendorInputClass} />
            </VendorField>
            <VendorField label="Phone">
              <input value={form.phone} onChange={(event) => set("phone", event.target.value)} className={vendorInputClass} />
            </VendorField>
            <VendorField label="Email">
              <input value={form.email} onChange={(event) => set("email", event.target.value)} className={vendorInputClass} />
            </VendorField>
          </div>
          <VendorField label="Store description">
            <textarea value={form.description} onChange={(event) => set("description", event.target.value)} className={vendorTextareaClass} />
          </VendorField>
          <VendorField label="Return policy">
            <textarea value={form.returnPolicy} onChange={(event) => set("returnPolicy", event.target.value)} className={vendorTextareaClass} />
          </VendorField>
          <VendorField label="Shipping policy">
            <textarea value={form.shippingPolicy} onChange={(event) => set("shippingPolicy", event.target.value)} className={vendorTextareaClass} />
          </VendorField>
        </div>

        <div className="space-y-4 rounded-xl border border-green-100 bg-white p-5">
          <h3 className="font-bold text-gray-900">Branding</h3>
          <VendorField label="Logo URL">
            <input value={form.logoUrl ?? ""} onChange={(event) => set("logoUrl", event.target.value)} className={vendorInputClass} />
          </VendorField>
          <VendorField label="Banner URL">
            <input value={form.bannerUrl ?? ""} onChange={(event) => set("bannerUrl", event.target.value)} className={vendorInputClass} />
          </VendorField>
          <div className="overflow-hidden rounded-xl border border-green-100">
            {form.bannerUrl && <img src={form.bannerUrl} alt="" className="h-28 w-full object-cover" />}
            <div className="p-4">
              {form.logoUrl && <img src={form.logoUrl} alt="" className="-mt-10 mb-3 h-16 w-16 rounded-xl border-4 border-white object-cover shadow" />}
              <p className="font-bold text-gray-900">{form.storeName}</p>
              <p className="mt-1 text-sm text-gray-500 line-clamp-3">{form.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => void save()} disabled={saving} className="rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50">
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  )
}
