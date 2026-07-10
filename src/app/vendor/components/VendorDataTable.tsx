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
      <div className="overflow-x-auto">
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
