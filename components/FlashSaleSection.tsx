import Link from "next/link";
import ProductCard from "./ProductCard";
import CountdownTimer from "./CountdownTimer";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Flash Sale</h2>
            <div className="hidden sm:block">
              <CountdownTimer />
            </div>
          </div>
          <Link 
            href="/flash-sale" 
            className="border-2 border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black font-bold px-6 py-2.5 rounded-lg transition-all whitespace-nowrap text-sm sm:text-base"
          >
            SHOP ALL PRODUCTS
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl p-6">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex gap-4">
                {comics.map((comic) => (
                  <ProductCard key={comic.id} comic={comic} showDiscount={true} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

