// "use client";

// import ProductCard from "@/src/components/ProductCard";
// import ProductSlider from "@/src/components/ProductSlider";

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

// interface ComicsCarouselProps {
//   title: string;
//   comics: ComicItem[];
//   cardClassName?: string;
//   showDiscount?: boolean;
//   showTag?: boolean;
//   showSold?: boolean;
// }

// export default function ComicsCarousel({
//   title,
//   comics,
//   cardClassName = "",
//   showDiscount = false,
//   showTag = false,
//   showSold = false,
// }: ComicsCarouselProps) {
//   return (
//     <div className="w-full">
//       <h2 className="text-xl sm:text-2xl font-black text-white mb-4">{title}</h2>
//       <ProductSlider>
//         {comics.map((comic) => (
//           <ProductCard
//             key={comic.id}
//             comic={comic}
//             showDiscount={showDiscount}
//             showTag={showTag}
//             showSold={showSold}
//             className={cardClassName}
//           />
//         ))}
//       </ProductSlider>
//     </div>
//   );
// }
