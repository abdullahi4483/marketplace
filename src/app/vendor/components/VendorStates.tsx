import { AlertCircle, Inbox, Loader2 } from "lucide-react"

export function VendorLoadingState({ label = "Loading vendor data" }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-green-100 bg-white p-8 text-sm text-gray-500">
      <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-700" />
      {label}
    </div>
  )
}

export function VendorEmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-green-200 bg-white p-8 text-center">
      <Inbox className="mb-3 h-9 w-9 text-green-300" />
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function VendorErrorState({ title = "Something went wrong", body, onRetry }: { title?: string; body: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-5">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
        <div>
          <h3 className="font-bold text-red-900">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{body}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-3 min-h-11 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
