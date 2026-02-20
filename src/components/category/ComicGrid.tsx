// "use client";

// import ProductCard from "@/src/components/ProductCard";

// export interface ComicItem {
//   id: number;
//   title: string;
//   author?: string;
//   price: number;
//   originalPrice?: number;
//   discount?: number;
//   rating?: number;
//   sold?: string;
//   image: string;
//   tag?: string;
// }



// interface ComicGridProps {
//   comics: ComicItem[];
//   /** Responsive: default "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" */
//   gridClass?: string;
//   cardClassName?: string;
//   showDiscount?: boolean;
//   showTag?: boolean;
//   showSold?: boolean;
// }

// export default function ComicGrid({
//   comics,
//   gridClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
//   cardClassName = "",
//   showDiscount = false,
//   showTag = false,
//   showSold = false,
// }: ComicGridProps) {
//   return (
//     <div className={`grid gap-4 sm:gap-6 ${gridClass}`}>
//       {comics.map((comic) => (
//         <ProductCard
//           key={comic.id}
//           comic={comic}
//           cardWidth="w-full"
//           showDiscount={showDiscount}
//           showTag={showTag}
//           showSold={showSold}
//           className={cardClassName}
//         />
//       ))}
//     </div>
//   );
// }
