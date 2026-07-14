import { useEffect, useMemo, useState } from "react"
import { Edit, FileUp, Plus, Trash2 } from "lucide-react"
import { VendorDataTable, type VendorColumn } from "../components/VendorDataTable"
import { VendorField, vendorInputClass, vendorSelectClass } from "../components/VendorForm"
import { VendorModal } from "../components/VendorModal"
import { VendorStatusBadge } from "../components/VendorStatusBadge"
import { VendorEmptyState, VendorErrorState, VendorLoadingState } from "../components/VendorStates"
import { formatNaira } from "../lib/format"
import { vendorApi } from "../lib/vendorApi"
import type { ProductStatus, VendorProduct } from "../lib/vendorTypes"

const blankProduct: Omit<VendorProduct, "id" | "updatedAt"> = {
  name: "",
  sku: "",
  category: "Crafts",
  price: 0,
  stock: 0,
  status: "draft",
  imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=120&h=120&fit=crop&auto=format",
}

export function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<VendorProduct | null>(null)
  const [draft, setDraft] = useState<Omit<VendorProduct, "id" | "updatedAt">>(blankProduct)
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkMessage, setBulkMessage] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      setProducts(await vendorApi.listProducts())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setDraft(blankProduct)
    setModalOpen(true)
  }

  const openEdit = (product: VendorProduct) => {
    setEditing(product)
    setDraft({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      imageUrl: product.imageUrl,
    })
    setModalOpen(true)
  }

  const save = async () => {
    if (editing) {
      await vendorApi.updateProduct(editing.id, draft)
    } else {
      await vendorApi.createProduct(draft)
    }
    setModalOpen(false)
    await load()
  }

  const remove = async (id: string) => {
    await vendorApi.deleteProduct(id)
    await load()
  }

  const columns = useMemo<VendorColumn<VendorProduct>[]>(() => [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">{product.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (product) => <span className="text-gray-700">{product.category}</span> },
    { key: "price", header: "Price", render: (product) => <span className="font-bold text-green-700">{formatNaira(product.price)}</span> },
    { key: "stock", header: "Stock", render: (product) => <span>{product.stock}</span> },
    { key: "status", header: "Status", render: (product) => <VendorStatusBadge status={product.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (product) => (
        <div className="flex gap-1">
          <button onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-green-700 hover:bg-green-50"><Edit size={14} /></button>
          <button onClick={() => void remove(product.id)} aria-label={`Delete ${product.name}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ], [])

  if (loading) return <VendorLoadingState label="Loading products" />
  if (error) return <VendorErrorState body={error} onRetry={load} />

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Product management</h2>
          <p className="mt-1 text-sm text-gray-500">Create, update, delete, and bulk import vendor catalog items.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 border-green-700 px-4 text-sm font-bold text-green-700 hover:bg-green-50">
            <FileUp size={15} />
            Bulk upload
            <input
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const result = await vendorApi.bulkUploadProducts(file)
                setBulkMessage(`${result.imported} imported, ${result.failed} failed`)
              }}
            />
          </label>
          <button onClick={openCreate} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-bold text-white hover:bg-green-800">
            <Plus size={15} />
            Add product
          </button>
        </div>
      </div>

      {bulkMessage && <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm font-semibold text-green-700">{bulkMessage}</div>}

      <VendorDataTable
        columns={columns}
        rows={products}
        empty={<VendorEmptyState title="No products yet" body="Create your first product or use bulk upload to import an existing catalog." action={<button onClick={openCreate} className="min-h-11 rounded-xl bg-green-700 px-4 text-sm font-bold text-white">Add product</button>} />}
      />

      <VendorModal
        open={modalOpen}
        title={editing ? "Edit product" : "Create product"}
        onClose={() => setModalOpen(false)}
        footer={(
          <>
            <button onClick={() => setModalOpen(false)} className="min-h-11 rounded-xl border border-green-200 px-4 text-sm font-bold text-green-700 hover:bg-green-50">Cancel</button>
            <button onClick={() => void save()} disabled={!draft.name || !draft.sku} className="min-h-11 rounded-xl bg-green-700 px-4 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50">Save product</button>
          </>
        )}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <VendorField label="Product name">
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className={vendorInputClass} />
          </VendorField>
          <VendorField label="SKU">
            <input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} className={vendorInputClass} />
          </VendorField>
          <VendorField label="Category">
            <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={vendorSelectClass}>
              {["Crafts", "Fabric", "Food", "Electronics", "Services"].map((category) => <option key={category}>{category}</option>)}
            </select>
          </VendorField>
          <VendorField label="Status">
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as ProductStatus })} className={vendorSelectClass}>
              {["draft", "active", "out_of_stock", "suspended"].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </VendorField>
          <VendorField label="Price">
            <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} className={vendorInputClass} type="number" />
          </VendorField>
          <VendorField label="Stock">
            <input value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} className={vendorInputClass} type="number" />
          </VendorField>
          <div className="md:col-span-2">
            <VendorField label="Image URL">
              <input value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} className={vendorInputClass} />
            </VendorField>
          </div>
        </div>
      </VendorModal>
    </div>
  )
}
