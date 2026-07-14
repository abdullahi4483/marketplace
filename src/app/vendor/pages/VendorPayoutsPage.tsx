import { useEffect, useMemo, useState } from "react"
import { CreditCard, Plus } from "lucide-react"
import { VendorDataTable, type VendorColumn } from "../components/VendorDataTable"
import { VendorMetricCard } from "../components/VendorMetricCard"
import { VendorModal } from "../components/VendorModal"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import { VendorEmptyState, VendorErrorState, VendorLoadingState } from "../components/VendorStates"
import { formatNaira } from "../lib/format"
import { vendorApi } from "../lib/vendorApi"
import type { VendorPayout, VendorProfile } from "../lib/vendorTypes"

const payoutDestination = (profile: VendorProfile) => {
  if (!profile.payoutBankName || !profile.payoutAccountName || !/^\d{10}$/.test(profile.payoutAccountNumber)) return ""
  return `${profile.payoutBankName} · ${profile.payoutAccountName} · **** ${profile.payoutAccountNumber.slice(-4)}`
}

export function VendorPayoutsPage() {
  const [balance, setBalance] = useState(0)
  const [pending, setPending] = useState(0)
  const [history, setHistory] = useState<VendorPayout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [destination, setDestination] = useState("")
  const [requestError, setRequestError] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const [result, profile] = await Promise.all([vendorApi.listPayouts(), vendorApi.getProfile()])
      setBalance(result.balance)
      setPending(result.pending)
      setHistory(result.history)
      setDestination(payoutDestination(profile))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load payouts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const request = async () => {
    try {
      setRequestError("")
      await vendorApi.requestPayout(amount)
      setModalOpen(false)
      setAmount(0)
      await load()
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Unable to request payout")
    }
  }

  const columns = useMemo<VendorColumn<VendorPayout>[]>(() => [
    { key: "id", header: "Payout ID", render: (payout) => <span className="font-mono text-xs text-gray-500">{payout.id}</span> },
    { key: "amount", header: "Amount", render: (payout) => <span className="font-bold text-green-700">{formatNaira(payout.amount)}</span> },
    { key: "destination", header: "Destination", render: (payout) => <span>{payout.destination}</span> },
    { key: "requested", header: "Requested", render: (payout) => <span className="text-gray-600">{payout.requestedAt}</span> },
    { key: "status", header: "Status", render: (payout) => <VendorStatusBadge status={payout.status} /> },
  ], [])

  if (loading) return <VendorLoadingState label="Loading payouts" />
  if (error) return <VendorErrorState body={error} onRetry={load} />

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Payouts and earnings</h2>
          <p className="mt-1 text-sm text-gray-500">Track available balance, pending settlements, and payout history.</p>
        </div>
        <button onClick={() => { setRequestError(""); setModalOpen(true) }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-bold text-white hover:bg-green-800">
          <Plus size={15} />
          Request payout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <VendorMetricCard label="Available balance" value={formatNaira(balance)} change="Ready for payout" icon={<CreditCard size={20} />} tone="green" />
        <VendorMetricCard label="Pending settlement" value={formatNaira(pending)} change="Processing" icon={<CreditCard size={20} />} tone="amber" />
        <VendorMetricCard label="Lifetime payouts" value={formatNaira(history.reduce((sum, payout) => sum + payout.amount, 0))} change={`${history.length} transactions`} icon={<CreditCard size={20} />} tone="blue" />
      </div>

      <VendorDataTable
        columns={columns}
        rows={history}
        empty={<VendorEmptyState title="No payout history" body="Payout requests and completed transfers will appear here." />}
      />

      <VendorModal
        open={modalOpen}
        title="Request payout"
        onClose={() => setModalOpen(false)}
        footer={(
          <>
            <button onClick={() => setModalOpen(false)} className="min-h-11 rounded-xl border border-green-200 px-4 text-sm font-bold text-green-700 hover:bg-green-50">Cancel</button>
            <button onClick={() => void request()} disabled={!destination || amount < 1000 || amount > balance} className="min-h-11 rounded-xl bg-green-700 px-4 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50">Submit request</button>
          </>
        )}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Available balance: <span className="font-bold text-green-700">{formatNaira(balance)}</span></p>
          {destination ? (
            <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-gray-700">Funds will be sent to <span className="font-bold text-gray-900">{destination}</span>.</div>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">No payout account saved. Add your bank account in Settings before submitting a request.</div>
          )}
          <input value={amount} onChange={(event) => setAmount(Number(event.target.value))} type="number" className="min-h-11 w-full rounded-xl border-2 border-green-200 bg-green-50/30 px-4 py-2.5 text-sm outline-none focus:border-green-600" />
          {requestError && <p className="text-sm font-semibold text-red-600">{requestError}</p>}
          <p className="text-xs text-gray-500">Backend should enforce minimum payout, bank verification, settlement windows, and fraud checks.</p>
        </div>
      </VendorModal>
    </div>
  )
}
