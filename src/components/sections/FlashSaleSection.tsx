import Link from "next/link";
import ProductCard from "../ProductCard";
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

export default function FlashSaleSection({ comics }: FlashSaleSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Flash Sale</h2>
            <div className="hidden sm:block">
              <CountdownTimer />
            </div>
          </div>
          <Link
            href="/flash-sale"
            className="rounded-xl border-2 border-brand/55 bg-transparent px-6 py-2.5 text-sm font-bold text-brand transition-all hover:border-brand hover:bg-brand hover:text-brand-foreground sm:text-base whitespace-nowrap"
          >
            SHOP ALL PRODUCTS
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-black via-zinc-950 to-black p-6 py-12">
          <ProductSlider>
            {comics.map((comic) => (
              <ProductCard key={comic.id} comic={comic} showDiscount={true} />
            ))}
          </ProductSlider>
        </div>
      </div>
    </section>
  );
}

