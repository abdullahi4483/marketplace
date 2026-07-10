import { useState } from "react"
import { AlertCircle, CheckCircle, FileUp, Send } from "lucide-react"
import { VendorField, vendorInputClass, vendorSelectClass, vendorTextareaClass } from "../components/VendorForm"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import type { VendorProfile } from "../lib/vendorTypes"

const LGAS = ["Bida", "Bosso", "Chanchaga", "Kontagora", "Lapai", "Lavun", "Suleja"]
const CATEGORIES = ["Crafts", "Fashion", "Food", "Electronics", "Agriculture", "Furniture", "Services"]

export function VendorOnboardingPage({
  profile,
  onSubmit,
  onUploadDocument,
}: {
  profile: VendorProfile
  onSubmit: (updates: Partial<VendorProfile>) => Promise<void>
  onUploadDocument: (documentId: string, file: File) => Promise<void>
}) {
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const set = (key: keyof VendorProfile, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const missingDocs = profile.documents.filter((doc) => doc.status === "missing" || doc.status === "rejected")
  const canSubmit = form.storeName && form.ownerName && form.phone && form.lga && form.address && missingDocs.length === 0

  const submit = async () => {
    setSaving(true)
    await onSubmit(form)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-green-100 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">Vendor onboarding</h2>
            <p className="mt-1 text-sm text-gray-500">Complete business details and verification documents before the store goes live.</p>
          </div>
          <VendorStatusBadge status={profile.status} />
        </div>

        {profile.status === "rejected" && (
          <div className="mt-4 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{profile.rejectionReason ?? "Your submission needs correction. Update the highlighted details and resubmit."}</span>
          </div>
        )}

        {profile.status === "approved" && (
          <div className="mt-4 flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Your store is approved. You can manage products, orders, payouts, and settings from this workspace.</span>
          </div>
        )}
      </div>

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
            <VendorField label="Email">
              <input value={form.email} onChange={(event) => set("email", event.target.value)} className={vendorInputClass} type="email" />
            </VendorField>
            <VendorField label="Phone">
              <input value={form.phone} onChange={(event) => set("phone", event.target.value)} className={vendorInputClass} />
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
          <VendorField label="Store description">
            <textarea value={form.description} onChange={(event) => set("description", event.target.value)} className={vendorTextareaClass} />
          </VendorField>
        </div>

        <div className="rounded-xl border border-green-100 bg-white p-5">
          <h3 className="font-bold text-gray-900">Verification documents</h3>
          <p className="mt-1 text-sm text-gray-500">Upload the required documents. The backend should validate file type and size.</p>
          <div className="mt-4 space-y-3">
            {profile.documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-green-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{doc.label}</p>
                    {doc.fileName && <p className="mt-0.5 text-xs text-gray-500">{doc.fileName}</p>}
                  </div>
                  <VendorStatusBadge status={doc.status} />
                </div>
                <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50">
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
      </div>

      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={!canSubmit || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={15} />
          {saving ? "Submitting..." : "Submit for review"}
        </button>
      </div>
    </div>
  )
}
