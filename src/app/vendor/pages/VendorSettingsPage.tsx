import { useState } from "react"
import { FileUp } from "lucide-react"
import { VendorField, vendorInputClass, vendorSelectClass, vendorTextareaClass } from "../components/VendorForm"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import type { VendorProfile } from "../lib/vendorTypes"

const LGAS = ["Bida", "Bosso", "Chanchaga", "Kontagora", "Lapai", "Lavun", "Suleja"]
const CATEGORIES = ["Crafts", "Fashion", "Food", "Electronics", "Agriculture", "Furniture", "Services"]

export function VendorSettingsPage({
  profile,
  onSave,
  onUploadDocument,
}: {
  profile: VendorProfile
  onSave: (updates: Partial<VendorProfile>) => Promise<void>
  onUploadDocument: (documentId: string, file: File) => Promise<void>
}) {
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const set = (key: keyof VendorProfile, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const updateProfilePhoto = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => set("logoUrl", String(reader.result))
    reader.readAsDataURL(file)
  }

  const save = async () => {
    setSaving(true)
    await onSave({ ...form, documents: profile.documents })
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
          <h3 className="font-bold text-gray-900">Business details</h3>
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
            <VendorField label="LGA">
              <select value={form.lga} onChange={(event) => set("lga", event.target.value)} className={vendorSelectClass}>
                {LGAS.map((lga) => <option key={lga} value={lga}>{lga}</option>)}
              </select>
            </VendorField>
            <VendorField label="Primary category">
              <select value={form.category} onChange={(event) => set("category", event.target.value)} className={vendorSelectClass}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </VendorField>
          </div>
          <VendorField label="Business address">
            <input value={form.address} onChange={(event) => set("address", event.target.value)} className={vendorInputClass} />
          </VendorField>
          <VendorField label="Vendor bio">
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
          <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/50 p-3">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Profile preview" className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-lg font-black text-white">{form.storeName.charAt(0)}</div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">Profile picture</p>
              <label className="mt-1 inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-green-200 bg-white px-3 text-xs font-bold text-green-700 hover:bg-green-50">
                <FileUp size={13} />
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) updateProfilePhoto(file)
                }} />
              </label>
            </div>
          </div>
          <VendorField label="Profile picture URL">
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
              <p className="mt-0.5 text-xs font-medium text-gray-600">{form.ownerName} · {form.category}</p>
              <p className="mt-1 text-sm text-gray-500 line-clamp-3">{form.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Verification documents</h3>
            <p className="mt-1 text-sm text-gray-500">Update onboarding documents used for vendor verification.</p>
          </div>
          <VendorStatusBadge status={profile.status} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {profile.documents.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-green-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                  {doc.fileName && <p className="mt-0.5 text-xs text-gray-500">{doc.fileName}</p>}
                </div>
                <VendorStatusBadge status={doc.status} />
              </div>
              <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-green-200 px-3 text-sm font-semibold text-green-700 hover:bg-green-50">
                <FileUp size={14} />
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void onUploadDocument(doc.id, file)
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-green-100 bg-white p-5">
        <div>
          <h3 className="font-bold text-gray-900">Payout account</h3>
          <p className="mt-1 text-sm text-gray-500">Payout requests will be sent to this bank account.</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <VendorField label="Bank name">
            <input value={form.payoutBankName ?? ""} onChange={(event) => set("payoutBankName", event.target.value)} placeholder="e.g. GTBank" className={vendorInputClass} />
          </VendorField>
          <VendorField label="Account holder name">
            <input value={form.payoutAccountName ?? ""} onChange={(event) => set("payoutAccountName", event.target.value)} placeholder="Name on the account" className={vendorInputClass} />
          </VendorField>
          <VendorField label="Account number">
            <input value={form.payoutAccountNumber ?? ""} onChange={(event) => set("payoutAccountNumber", event.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" maxLength={10} placeholder="10-digit account number" className={vendorInputClass} />
          </VendorField>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => void save()} disabled={saving} className="min-h-11 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50">
          {saving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  )
}
