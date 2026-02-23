import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  sortable?: boolean
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  rowKey: keyof T
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  onRowClick,
  rowKey,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortOrder === 'asc' ? cmp : -cmp
      })
    : data

  return (
    <div className="rounded-lg border border-dark-border bg-dark-surface overflow-hidden">
      <table className="w-full">
        <thead className="bg-dark-bg border-b border-dark-border">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-400 ${col.width || ''}`}
              >
                <button
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  {col.label}
                  {col.sortable !== false && (
                    <div className="opacity-50">
                      {sortKey === col.key &&
                        (sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </div>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className={`border-0 ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-300">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
