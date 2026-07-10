import type { ReactNode } from "react"
import { X } from "lucide-react"

export function VendorModal({
  open,
  title,
  children,
  footer,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-green-100 px-5 py-4">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-gray-900">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-green-100 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
