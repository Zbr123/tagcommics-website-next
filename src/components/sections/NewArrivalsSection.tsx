import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";
import ProductSlider from "@/src/components/ProductSlider";

interface Comic {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  tag: string;
}

interface NewArrivalsSectionProps {
  comics: Comic[];
}

export default function NewArrivalsSection({ comics }: NewArrivalsSectionProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">New Arrivals</h2>
            <p className="text-sm text-zinc-400">Fresh comics just released</p>
          </div>
          <Link
            href="/new-releases"
            className="group flex items-center gap-1 whitespace-nowrap text-sm font-bold text-brand transition-colors hover:text-white sm:text-base"
          >
            See All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-2xl p-6 py-12">
          <ProductSlider>
            {comics.map((comic) => (
              <ProductCard key={comic.id} comic={comic} showTag={true} />
            ))}
          </ProductSlider>
        </div>
      </div>
    </section>
  );
}

