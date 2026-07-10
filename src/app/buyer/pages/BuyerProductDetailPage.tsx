import { useEffect, useState } from "react"
import { Heart, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Store } from "lucide-react"
import { Link, useParams } from "react-router"
import { AppEmptyState, AppErrorState, AppLoadingState } from "../../shared/components/AppStates"
import { AppStatusBadge } from "../../shared/components/AppStatusBadge"
import { buyerApi } from "../lib/buyerApi"
import { useBuyer } from "../lib/BuyerContext"
import type { BuyerProduct } from "../lib/buyerTypes"
import { BuyerPrice } from "../components/BuyerPrice"
import { BuyerRating } from "../components/BuyerRating"

export function BuyerProductDetailPage() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, wishlist } = useBuyer()
  const [product, setProduct] = useState<BuyerProduct | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [variantId, setVariantId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    if (!id) return
    try {
      setLoading(true)
      setError("")
      const next = await buyerApi.getProduct(id)
      setProduct(next)
      setVariantId(next?.variants?.[0]?.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load product")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [id])

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-6"><AppLoadingState label="Loading product" /></div>
  if (error) return <div className="mx-auto max-w-7xl px-4 py-6"><AppErrorState body={error} onRetry={load} /></div>
  if (!product) return <div className="mx-auto max-w-7xl px-4 py-6"><AppEmptyState title="Product not found" body="This product may have been removed or is no longer available." /></div>

  const wished = wishlist.includes(product.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="overflow-hidden rounded-xl border border-green-100 bg-white">
            <div className="aspect-square bg-green-50 md:aspect-[4/3]">
              <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((image, index) => (
                <button key={image} onClick={() => setActiveImage(index)} className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${activeImage === index ? "border-green-700" : "border-green-100"}`}>
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-green-100 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase text-green-700">{product.category}</p>
                <h1 className="mt-1 text-3xl font-black text-gray-900">{product.name}</h1>
              </div>
              <button onClick={() => void toggleWishlist(product.id)} className={`rounded-xl border p-3 ${wished ? "border-red-200 bg-red-50 text-red-600" : "border-green-200 text-green-700 hover:bg-green-50"}`}>
                <Heart className={wished ? "fill-red-500" : ""} size={20} />
              </button>
            </div>
            <div className="mt-3"><BuyerRating rating={product.rating} count={product.reviewCount} /></div>
            <div className="mt-4"><BuyerPrice price={product.price} originalPrice={product.originalPrice} /></div>
            <p className="mt-4 text-sm leading-6 text-gray-600">{product.description}</p>

            {product.variants && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-bold text-gray-700">Variant</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button key={variant.id} onClick={() => setVariantId(variant.id)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${variantId === variant.id ? "border-green-700 bg-green-50 text-green-700" : "border-green-100 text-gray-600 hover:border-green-300"}`}>
                      {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between rounded-xl bg-green-50 p-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{product.inStock ? `${product.stock} in stock` : "Out of stock"}</p>
                <p className="text-xs text-gray-500">Quantity</p>
              </div>
              <div className="flex items-center rounded-xl border border-green-200 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-green-700"><Minus size={16} /></button>
                <span className="w-10 text-center text-sm font-black">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 text-green-700"><Plus size={16} /></button>
              </div>
            </div>

            <button
              onClick={() => addToCart(product, quantity, variantId)}
              disabled={!product.inStock}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-black text-white hover:bg-green-800 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              Add to cart
            </button>
          </div>

          <div className="rounded-xl border border-green-100 bg-white p-5">
            <div className="flex items-center gap-3">
              <img src={product.vendor.avatar} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-black text-gray-900">{product.vendor.name}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} />{product.vendor.location}</div>
              </div>
              {product.vendor.verified && <AppStatusBadge status="verified" label="Verified" />}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-green-50 p-3"><Store size={16} className="mb-1 text-green-700" />Vendor rating {product.vendor.rating}</div>
              <div className="rounded-xl bg-green-50 p-3"><ShieldCheck size={16} className="mb-1 text-green-700" />Buyer protection</div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-xl border border-green-100 bg-white p-5">
        <h2 className="font-black text-gray-900">Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="mt-4 space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-green-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-gray-900">{review.userName}</p>
                  <span className="text-xs text-gray-500">{review.createdAt}</span>
                </div>
                <BuyerRating rating={review.rating} size={12} />
                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState title="No reviews yet" body="Reviews from verified buyers will appear here." action={<Link to="/products" className="text-sm font-bold text-green-700">Continue shopping</Link>} />
        )}
      </section>
    </div>
  )
}
