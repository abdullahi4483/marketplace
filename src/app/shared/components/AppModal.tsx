import type { ReactNode } from "react"
import { X } from "lucide-react"

export function AppModal({ open, title, children, footer, onClose }: { open: boolean; title: string; children: ReactNode; footer?: ReactNode; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-green-100 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-green-50 hover:text-gray-900">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-green-100 px-4 py-3 sm:flex-row sm:justify-end sm:px-5 sm:py-4">{footer}</div>}
      </div>
    </div>
  )
}
