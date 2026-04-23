import Link from "next/link";
import Image from "next/image";
import ProductSlider from "../ProductSlider";

interface Comic {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
  sold: string;
  image: string;
}

interface BestSellersSectionProps {
  comics: Comic[];
}

function BestSellerSlideCard({ comic }: { comic: Comic }) {
  return (
    <Link
      href={`/comic/${comic.id}`}
      className="group block w-[min(92vw,300px)] flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:min-w-[260px] sm:w-[min(46vw,300px)] md:w-[280px] lg:w-[300px] xl:w-[308px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl glass-card">
        <Image
          src={comic.image}
          alt={comic.title}
          fill
          className="object-cover transition-all duration-700 ease-out opacity-80 group-hover:scale-110 group-hover:opacity-100"
          sizes="(max-width: 640px) 300px, (max-width: 1024px) 280px, 308px"
        />
        <span className="absolute right-2.5 top-2.5 z-10 rounded-lg border border-brand/35 bg-zinc-950/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
          Best
        </span>
      </div>
      <div className="mt-3 translate-y-1 px-0.5 transition-transform duration-500 group-hover:translate-y-0">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-white md:text-lg">{comic.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 transition-colors duration-500 group-hover:text-zinc-300">
          {comic.author}
          <span className="text-zinc-600"> • </span>
          {comic.sold} sold
        </p>
      </div>
    </Link>
  );
}

export default function BestSellersSection({ comics }: BestSellersSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-black sm:text-3xl">
              <span className="text-white">Best</span>{" "}
              <span className="text-brand">Sellers</span>
            </h2>
            <p className="text-sm text-zinc-400">Most popular comics this week</p>
          </div>
          <Link
            href="/bestsellers"
            className="group flex items-center gap-1 whitespace-nowrap text-sm font-bold text-brand transition-colors hover:text-white sm:text-base"
          >
            View All
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-zinc-950 p-6 py-10 md:py-12">
          <ProductSlider>
            {comics.map((comic) => (
              <BestSellerSlideCard key={comic.id} comic={comic} />
            ))}
          </ProductSlider>
        </div>
      </div>
    </section>
  );
}
