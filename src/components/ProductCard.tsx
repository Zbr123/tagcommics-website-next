import Link from "next/link";
import Image from "next/image";

interface Comic {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  author?: string;
  rating?: number;
  sold?: string;
  tag?: string;
  image: string;
}

interface ProductCardProps {
  comic: Comic;
  showDiscount?: boolean;
  showTag?: boolean;
  showSold?: boolean;
  cardWidth?: string;
}

export default function ProductCard({
  comic,
  showDiscount = false,
  showTag = false,
  showSold = false,
  cardWidth
}: ProductCardProps) {
  return (
    <Link
      href={`/comic/${comic.id}`}
      className={`group flex-shrink-0 ${cardWidth || 'w-[160px] sm:w-[180px] md:w-[200px]'} ${cardWidth === 'w-full' ? 'max-w-[340px] mx-auto' : ''} bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-400/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/10`}
    >
      <div className="relative w-full">
        <div className="relative h-[240px] sm:h-[270px] w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <Image
            src={comic.image}
            alt={comic.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
          />
          {showDiscount && comic.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg z-10">
              -{comic.discount}%
            </div>
          )}
          {showTag && comic.tag && (
            <div className={`absolute top-2 left-2 text-xs font-black px-2.5 py-1 rounded-full shadow-lg z-10 ${
              comic.tag === "NEW" ? "bg-green-500 text-white" :
              comic.tag === "HOT" ? "bg-red-500 text-white" :
              comic.tag === "CLASSIC" ? "bg-purple-500 text-white" :
              comic.tag === "SALE" ? "bg-orange-500 text-white" :
              comic.tag === "BESTSELLER" ? "bg-yellow-500 text-black" :
              "bg-blue-500 text-white"
            }`}>
              {comic.tag}
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-yellow-400 transition-colors">
            {comic.title}
          </h3>
          {comic.author && (
            <p className="text-gray-400 text-xs mb-2 truncate">{comic.author}</p>
          )}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-yellow-400">${comic.price}</span>
              {comic.originalPrice && (
                <span className="text-xs text-gray-500 line-through">${comic.originalPrice}</span>
              )}
            </div>
            {comic.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">⭐</span>
                <span className="text-xs text-gray-300">{comic.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

