// "use client";

// interface CategoryFiltersProps {
//   options: string[];
//   selected: string;
//   onChange: (value: string) => void;
//   variant?: "chips" | "dropdown";
//   /** For chips: accent color class (e.g. 'bg-[#FF69B4]') */
//   accentClass?: string;
// }

// export default function CategoryFilters({
//   options,
//   selected,
//   onChange,
//   variant = "dropdown",
//   accentClass = "bg-yellow-400 text-black",
// }: CategoryFiltersProps) {
//   if (variant === "chips") {
//     return (
//       <div className="flex flex-wrap gap-2">
//         {options.map((opt) => (
//           <button
//             key={opt}
//             type="button"
//             onClick={() => onChange(opt)}
//             className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
//               selected === opt
//                 ? `${accentClass}`
//                 : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
//             }`}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-3">
//       <label className="text-gray-400 text-sm font-medium">Filter:</label>
//       <select
//         value={selected}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-white/30 min-w-[150px] cursor-pointer"
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
