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

const tagBadgeClass = (tag: string) => {
  switch (tag) {
    case "NEW":
      return "bg-emerald-500/12 border border-emerald-400/25 text-emerald-300";
    case "HOT":
      return "bg-red-500/12 border border-red-400/25 text-red-300";
    case "CLASSIC":
      return "bg-violet-500/12 border border-violet-400/25 text-violet-300";
    case "SALE":
      return "bg-orange-500/12 border border-orange-400/25 text-orange-300";
    case "BESTSELLER":
      return "bg-brand/12 border border-brand/25 text-brand";
    default:
      return "bg-sky-500/12 border border-sky-400/25 text-sky-300";
  }
};

const badgePill =
  "inline-flex rounded-lg px-3 py-1 text-[11px] font-bold tracking-wider backdrop-blur-sm";

export default function ProductCard({
  comic,
  showDiscount = false,
  showTag = false,
  showSold = false,
  cardWidth,
}: ProductCardProps) {
  const widthClass =
    cardWidth ||
    "w-[160px] sm:w-[180px] md:w-[200px] min-w-[160px] sm:min-w-[180px] md:min-w-[200px]";

  return (
    <Link
      href={`/comic/${comic.id}`}
      className={`group relative block flex-shrink-0 overflow-hidden rounded-2xl glass-card aspect-[2/3] ${widthClass} ${
        cardWidth === "w-full" ? "max-w-[340px] min-w-0 mx-auto w-full" : ""
      }`}
    >
      <Image
        src={comic.image}
        alt={comic.title}
        fill
        className="object-cover opacity-80 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
        sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="absolute bottom-0 left-0 right-0 translate-y-2 transform p-4 transition-transform duration-500 group-hover:translate-y-0 sm:p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          {showDiscount && comic.discount ? (
            <span
              className={`${badgePill} bg-red-500/12 border border-red-400/25 text-red-300`}
            >
              -{comic.discount}%
            </span>
          ) : null}
          {showTag && comic.tag ? (
            <span className={`${badgePill} ${tagBadgeClass(comic.tag)}`}>{comic.tag}</span>
          ) : null}
        </div>

        <h3 className="text-base font-bold leading-tight text-white md:text-lg">{comic.title}</h3>

        {comic.author ? (
          <p className="mt-1 truncate text-sm text-zinc-400">{comic.author}</p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-2">
            <span className="text-base font-black text-brand sm:text-lg">${comic.price}</span>
            {comic.originalPrice != null ? (
              <span className="text-xs text-zinc-500 line-through">${comic.originalPrice}</span>
            ) : null}
          </div>
          {comic.rating ? (
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-xs text-brand">⭐</span>
              <span className="text-xs text-zinc-300">{comic.rating}</span>
            </div>
          ) : null}
        </div>

        {showSold && comic.sold ? (
          <p className="mt-1.5 text-xs text-zinc-500">{comic.sold}</p>
        ) : null}
      </div>
    </Link>
  );
}
