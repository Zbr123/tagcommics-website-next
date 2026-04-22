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
      <div className="mx-auto max-w-12xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Shop by Category</h2>
            <p className="text-sm text-zinc-400">Browse comics by genre</p>
          </div>
        </div>
        
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-black via-zinc-950 to-black p-6">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-4 lg:overflow-visible">
              <div className="flex gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
                {categories.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="group glass-card w-[160px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 sm:w-[180px] md:w-[200px] lg:w-full"
                  >
                    <div className="p-3 sm:p-4">
                      <h3 className="mb-3 line-clamp-2 text-sm font-black text-white transition-colors group-hover:text-brand">
                        {category.title}
                      </h3>

                      <div className="mb-3 grid grid-cols-2 gap-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="group/item relative"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-zinc-950/80 transition-all duration-300 group-hover/item:border-brand/40">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover transition-all duration-500 ease-out group-hover/item:scale-110 group-hover/item:opacity-100 opacity-90"
                                sizes="(max-width: 640px) 70px, (max-width: 768px) 80px, 90px"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />
                              <div className="absolute bottom-0 left-0 right-0 translate-y-full transform p-1.5 transition-transform duration-300 group-hover/item:translate-y-0">
                                <p className="rounded bg-black/75 px-1 py-0.5 text-center text-xs font-bold text-white backdrop-blur-sm">
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Link
                        href={category.link}
                        className="inline-block w-full rounded-xl border border-brand/35 bg-transparent px-3 py-2 text-center text-xs font-bold text-brand transition-all duration-300 hover:border-brand hover:bg-brand hover:text-brand-foreground"
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
