import Link from "next/link";
import ProductCard from "../ProductCard";
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

export default function BestSellersSection({ comics }: BestSellersSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Best Sellers</h2>
            <p className="text-sm text-zinc-400">Most popular comics this week</p>
          </div>
          <Link
            href="/bestsellers"
            className="group flex items-center gap-1 whitespace-nowrap text-sm font-bold text-brand transition-colors hover:text-white sm:text-base"
          >
            View All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl p-6 py-12">
          <ProductSlider>
            {comics.map((comic) => (
              <ProductCard key={comic.id} comic={comic} showSold={true} />
            ))}
          </ProductSlider>
        </div>
      </div>
    </section>
  );
}

