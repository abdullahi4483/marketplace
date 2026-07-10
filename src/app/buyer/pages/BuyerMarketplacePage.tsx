import { useEffect, useMemo, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "react-router"
import { AppEmptyState, AppErrorState, AppLoadingState } from "../../shared/components/AppStates"
import { appInputClass, appSelectClass } from "../../shared/components/AppForm"
import { buyerApi } from "../lib/buyerApi"
import type { BuyerCategory, BuyerProduct, ProductQuery } from "../lib/buyerTypes"
import { BuyerProductCard } from "../components/BuyerProductCard"

const lgas = ["", "Bida", "Bosso", "Chanchaga", "Lavun", "Suleja"]

export function BuyerMarketplacePage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<BuyerProduct[]>([])
  const [categories, setCategories] = useState<BuyerCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const query = useMemo<ProductQuery>(() => ({
    q: params.get("q") || undefined,
    category: params.get("category") || undefined,
    lga: params.get("lga") || undefined,
    minRating: params.get("minRating") ? Number(params.get("minRating")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    sort: (params.get("sort") as ProductQuery["sort"]) || "featured",
  }), [params])

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const [nextProducts, nextCategories] = await Promise.all([
        buyerApi.listProducts(query),
        buyerApi.listCategories(),
      ])
      setProducts(nextProducts)
      setCategories(nextCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load marketplace")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [query.q, query.category, query.lga, query.minRating, query.maxPrice, query.sort])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-6"><AppLoadingState label="Loading marketplace" /></div>
  if (error) return <div className="mx-auto max-w-7xl px-4 py-6"><AppErrorState body={error} onRetry={load} /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-green-800 text-white">
          <div className="grid min-h-64 md:grid-cols-2">
            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="text-sm font-bold text-green-200">Niger State marketplace</p>
              <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">Shop verified local vendors across every LGA.</h1>
              <p className="mt-3 max-w-xl text-sm text-green-100">Browse products, compare vendors, save favorites, and check out with a cart that keeps each seller clear.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1543168256-418811576931?w=900&h=620&fit=crop&auto=format" alt="Marketplace goods" className="h-full min-h-48 w-full object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.slice(0, 4).map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter("category", category.id)}
              className={`overflow-hidden rounded-xl border text-left ${query.category === category.id ? "border-green-700 ring-2 ring-green-200" : "border-green-100"}`}
            >
              <img src={category.image} alt="" className="h-24 w-full object-cover" />
              <div className="bg-white p-3">
                <p className="font-bold text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category.count} listings</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-xl border border-green-100 bg-white p-4">
          <div className="mb-4 flex items-center gap-2 font-black text-gray-900">
            <SlidersHorizontal size={17} />
            Filters
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">Category</span>
              <select value={query.category ?? ""} onChange={(event) => setFilter("category", event.target.value)} className={appSelectClass}>
                <option value="">All categories</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">LGA</span>
              <select value={query.lga ?? ""} onChange={(event) => setFilter("lga", event.target.value)} className={appSelectClass}>
                {lgas.map((lga) => <option key={lga} value={lga}>{lga || "All LGAs"}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">Max price</span>
              <input value={query.maxPrice ?? ""} onChange={(event) => setFilter("maxPrice", event.target.value)} type="number" className={appInputClass} placeholder="Any price" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">Minimum rating</span>
              <select value={query.minRating ?? ""} onChange={(event) => setFilter("minRating", event.target.value)} className={appSelectClass}>
                <option value="">Any rating</option>
                <option value="4">4 stars and up</option>
                <option value="4.5">4.5 stars and up</option>
              </select>
            </label>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">{query.q ? `Results for "${query.q}"` : "Featured products"}</h2>
              <p className="text-sm text-gray-500">{products.length} items available</p>
            </div>
            <select value={query.sort ?? "featured"} onChange={(event) => setFilter("sort", event.target.value)} className={`${appSelectClass} md:w-52`}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => <BuyerProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <AppEmptyState title="No products found" body="Try a different search, category, LGA, or price range." />
          )}
        </div>
      </section>
    </div>
  )
}
