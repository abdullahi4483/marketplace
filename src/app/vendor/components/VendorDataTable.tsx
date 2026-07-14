import type { ReactNode } from "react"

export interface VendorColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export function VendorDataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
}: {
  columns: VendorColumn<T>[]
  rows: T[]
  empty: ReactNode
}) {
  if (rows.length === 0) return <>{empty}</>

  return (
    <div className="overflow-hidden rounded-xl border border-green-100 bg-white">
      <div className="divide-y divide-green-50 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="space-y-3 p-4">
            {columns.map((column) => (
              <div key={column.key} className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{column.header}</span>
                <div className="min-w-0 text-sm text-gray-900">{column.render(row)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-green-100 bg-green-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-green-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-green-50/30">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 align-middle ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
