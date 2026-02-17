import Link from "next/link";
import ProductCard from "@/src/components/ProductCard";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">New Arrivals</h2>
            <p className="text-gray-400 text-sm">Fresh comics just released</p>
          </div>
          <Link 
            href="/new-releases" 
            className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center gap-1 group transition-colors whitespace-nowrap"
          >
            See All
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 rounded-2xl p-6">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex gap-4">
                {comics.map((comic) => (
                  <ProductCard key={comic.id} comic={comic} showTag={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

