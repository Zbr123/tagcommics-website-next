import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
  name: string;
  image: string;
}

interface Category {
  title: string;
  items: CategoryItem[];
  link: string;
}

const categories: Category[] = [
  {
    title: "Explore Superhero Comics",
    link: "/category/superhero",
    items: [
      { name: "Marvel", image: "/comic-slider1.png" },
      { name: "DC Comics", image: "/comic-slider5.png" },
      { name: "Indie Heroes", image: "/comic-slider3.png" },
      { name: "Team Ups", image: "/comic-slide4.png" },
    ],
  },
  {
    title: "Discover Manga Series",
    link: "/category/manga",
    items: [
      { name: "Shonen", image: "/comic-slider1.png" },
      { name: "Shojo", image: "/comic-slider5.png" },
      { name: "Seinen", image: "/comic-slider3.png" },
      { name: "Isekai", image: "/comic-slide4.png" },
    ],
  },
  {
    title: "Dive into Horror Stories",
    link: "/category/horror",
    items: [
      { name: "Zombie", image: "/comic-slider1.png" },
      { name: "Supernatural", image: "/comic-slider5.png" },
      { name: "Psychological", image: "/comic-slider3.png" },
      { name: "Classic Horror", image: "/comic-slide4.png" },
    ],
  },
  {
    title: "Journey to Fantasy Worlds",
    link: "/category/fantasy",
    items: [
      { name: "Epic Fantasy", image: "/comic-slider1.png" },
      { name: "Urban Fantasy", image: "/comic-slider5.png" },
      { name: "Dark Fantasy", image: "/comic-slider3.png" },
      { name: "Fantasy Romance", image: "/comic-slide4.png" },
    ],
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Shop by Category</h2>
            <p className="text-gray-400 text-sm">Browse comics by genre</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-950 via-black to-gray-950 rounded-2xl p-6">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-4 lg:overflow-visible">
              <div className="flex gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
                {categories.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 hover:border-yellow-400/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-400/10 flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-full overflow-hidden"
                  >
                    <div className="p-3 sm:p-4">
                      <h3 className="text-white font-black text-sm mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                        {category.title}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {category.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            href={`${category.link}/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className="group relative"
                          >
                            <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 group-hover:border-yellow-400/50 transition-all duration-300">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-500 ease-out"
                                sizes="(max-width: 640px) 70px, (max-width: 768px) 80px, 90px"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-1.5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-xs font-bold text-center bg-black/80 backdrop-blur-sm rounded px-1 py-0.5">
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      <Link
                        href={category.link}
                        className="text-yellow-400 hover:text-yellow-300 font-bold text-xs hover:underline inline-block w-full text-center bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-yellow-400/50 rounded-lg px-3 py-2 transition-all duration-300"
                      >
                        See more →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
