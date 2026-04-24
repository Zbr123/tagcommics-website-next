import Link from "next/link";
import Image from "next/image";
import ProductSlider from "../ProductSlider";
import CountdownTimer from "../CountdownTimer";

interface Comic {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
}

interface FlashSaleSectionProps {
  comics: Comic[];
}

function FlashSaleSlideCard({ comic }: { comic: Comic }) {
  return (
    <Link
      href={`/reader/${comic.id}`}
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
        <span className="absolute right-2.5 top-2.5 z-10 rounded-lg border border-red-400/40 bg-red-950/90 px-2 py-0.5 text-[11px] font-bold tabular-nums text-red-200">
          -{comic.discount}%
        </span>
      </div>
      <div className="mt-3 translate-y-1 px-0.5 transition-transform duration-500 group-hover:translate-y-0">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-white md:text-lg">{comic.title}</h3>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-2 text-xs">
          <span className="font-black text-brand">${comic.price}</span>
          <span className="text-zinc-500 line-through">${comic.originalPrice}</span>
        </p>
      </div>
    </Link>
  );
}

export default function FlashSaleSection({ comics }: FlashSaleSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-black sm:text-3xl">
              <span className="text-white">Flash</span>{" "}
              <span className="text-brand">Sale</span>
            </h2>
            <div className="hidden sm:block">
              <CountdownTimer />
            </div>
          </div>
          <Link
            href="/flash-sale"
            className="whitespace-nowrap rounded-xl border-2 border-brand/55 bg-transparent px-6 py-2.5 text-sm font-bold text-brand transition-all hover:border-brand hover:bg-brand hover:text-brand-foreground sm:text-base"
          >
            SHOP ALL PRODUCTS
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-zinc-950 p-6 py-10 md:py-12">
          <ProductSlider>
            {comics.map((comic) => (
              <FlashSaleSlideCard key={comic.id} comic={comic} />
            ))}
          </ProductSlider>
        </div>
      </div>
    </section>
  );
}
