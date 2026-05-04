"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/src/hooks/use-cart";
import ComicDownloadButton from "@/src/components/ComicDownloadButton";
import { getComicById, getAllComics, type Comic } from "@/src/lib/comics-api";

const ComicReader = dynamic(() => import("@/src/components/ComicReader"), { ssr: false });

function LoadingState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
        <p className="text-zinc-400">Loading comic...</p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white mb-4">Comic Not Found</h1>
        <Link href="/" className="text-yellow-400 hover:text-yellow-300">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function ComicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, getTotalItems } = useCart();
  const id = parseInt(params.id as string, 10);

  const [comic, setComic] = useState<Comic | null>(null);
  const [similarComics, setSimilarComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (isNaN(id)) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [comicData, allComicsData] = await Promise.all([
          getComicById(id),
          getAllComics(),
        ]);

        if (!comicData) {
          setComic(null);
          setLoading(false);
          return;
        }

        setComic(comicData);

        // Find similar comics by category or author
        const similar = allComicsData
          .filter((c) => c.id !== comicData.id && (c.category === comicData.category || c.author === comicData.author))
          .slice(0, 4);
        setSimilarComics(similar);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load comic");
        setComic(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("tagcomics-favorites");
      if (s) setFavoriteIds(JSON.parse(s));
    } catch {}
  }, []);

  if (loading) return <LoadingState />;
  if (!comic) return <NotFoundState />;

  const images = [comic.image, comic.image, comic.image];

  const handleAddToCart = () => {
    addToCart({
      id: comic.id,
      title: comic.title,
      author: comic.author,
      price: comic.price,
      originalPrice: comic.originalPrice,
      image: comic.image,
    }, quantity);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: comic.id,
      title: comic.title,
      author: comic.author,
      price: comic.price,
      originalPrice: comic.originalPrice,
      image: comic.image,
    }, quantity);
    router.push("/cart");
  };

  const isFavorite = favoriteIds.includes(comic.id);
  const toggleFavorite = () => {
    const next = isFavorite ? favoriteIds.filter((i) => i !== comic.id) : [...favoriteIds, comic.id];
    setFavoriteIds(next);
    try {
      localStorage.setItem("tagcomics-favorites", JSON.stringify(next));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-yellow-400">Home</Link>
            <span>/</span>
            <Link href={`/search?category=${comic.category}`} className="hover:text-yellow-400">{comic.category}</Link>
            <span>/</span>
            <span className="text-white">{comic.title}</span>
          </nav>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>✓ Added to cart successfully!</span>
            <Link href="/cart" className="text-yellow-400 hover:text-yellow-300 font-bold">
              View Cart ({getTotalItems()})
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden mb-4 border border-gray-800">
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <button className="bg-black/50 backdrop-blur-sm p-2 rounded-lg hover:bg-black/70 transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="bg-black/50 backdrop-blur-sm p-2 rounded-lg hover:bg-black/70 transition-colors cursor-pointer"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg
                    className={`w-5 h-5 ${isFavorite ? "text-yellow-400" : "text-white"}`}
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <img
                src={images[selectedImage]}
                alt={comic.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[3/4] w-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === index
                      ? "border-yellow-400"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${comic.title} ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button> 
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div>
            {/* Title & Rating */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{comic.title}</h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(comic.rating || 0) ? "text-yellow-400" : "text-gray-600"}>
                      ⭐
                    </span>
                  ))}
                  <span className="text-gray-400 text-sm ml-2">
                    {comic.rating} ({comic.sold || "0"} ratings)
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Brand: <span className="text-white">{comic.category}</span> | More from{" "}
                <Link href={`/search?q=${comic.author}`} className="text-yellow-400 hover:text-yellow-300">
                  {comic.author}
                </Link>
              </p>
            </div>

            {/* Price */}
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-black text-yellow-400">${comic.price}</span>
                {comic.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">${comic.originalPrice}</span>
                    <span className="text-sm text-red-400 font-bold">-{comic.discount}%</span>
                  </>
                )}
              </div>
              {comic.originalPrice && (
                <p className="text-sm text-gray-400">
                  List price: <span className="line-through">${comic.originalPrice}</span> ({comic.discount}% off)
                </p>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-white font-bold">Quantity:</label>
                <div className="flex items-center gap-2 border border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent text-white border-0 focus:outline-none"
                    min="1"
                    max={comic.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(comic.stock || 99, quantity + 1))}
                    className="px-3 py-2 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-sm">{comic.stock || 50} available</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all cursor-pointer"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg border border-gray-700 transition-all cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg border border-gray-700 transition-all cursor-pointer shrink-0"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${isFavorite ? "text-yellow-400" : ""}`}
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Preview: first 10 pages (ComiXology/Webtoon-style) */}
            <div className="mb-6">
              <ComicReader
                pdfUrl="/comics/Batman 001.pdf"
                title={comic.title}
                onPageView={(pageNum, total) => {
                  // Metrics-ready: e.g. gtag("event", "comic_preview_page_view", { page: pageNum, total })
                }}
              />
            </div>

            {/* Read & Download PDF (Archive.org-style) */}
            <div className="mb-6">
              <ComicDownloadButton
                pdfPath="/comics/Batman 001.pdf"
                title={comic.title}
                thumbnailSrc={comic.image}
              />
            </div>

            {/* Delivery Info */}
            <div className="mb-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800">
              <h3 className="text-white font-bold mb-3">Delivery & Returns</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>✓ <span className="text-yellow-400">Free shipping</span> on orders over $50</p>
                <p>✓ Estimated delivery: 3-5 business days</p>
                <p>✓ 30-day return policy. Buyer pays for return shipping.</p>
                <p>✓ Secure payment. Money back guarantee.</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Sold by</p>
                  <p className="text-white font-bold">Comics Universe Store</p>
                </div>
                <button className="text-yellow-400 hover:text-yellow-300 text-sm font-bold cursor-pointer">
                  Chat Now
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Positive Seller Ratings</p>
                  <p className="text-yellow-400 font-bold">99.5%</p>
                </div>
                <div>
                  <p className="text-gray-400">Ship on Time</p>
                  <p className="text-yellow-400 font-bold">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-12 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800">
          <h2 className="text-xl font-black text-white mb-4">About this item</h2>
          <p className="text-gray-400 leading-relaxed">{comic.description || `${comic.title} by ${comic.author}. A great read from the ${comic.category} collection.`}</p>
          <div className="mt-4 space-y-2 text-gray-400">
            <p>• <span className="text-white">Category:</span> {comic.category}</p>
            <p>• <span className="text-white">Author:</span> {comic.author}</p>
            <p>• <span className="text-white">Condition:</span> New</p>
            <p>• <span className="text-white">Format:</span> Physical Copy</p>
          </div>
        </div>

        {/* Similar Items */}
        {similarComics.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Similar Items</h2>
              <Link href={`/search?category=${comic.category}`} className="text-yellow-400 hover:text-yellow-300 font-bold">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarComics.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/reader/${similar.id}?cover=${encodeURIComponent(similar.image)}&title=${encodeURIComponent(similar.title)}`}
                  className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-400/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/10"
                >
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900">
                    <img
                      src={similar.image}
                      alt={similar.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                      {similar.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2">{similar.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-yellow-400">${similar.price}</span>
                      {similar.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-xs text-gray-300">{similar.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
