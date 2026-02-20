"use client";

const DUMMY_TESTIMONIALS = [
  { quote: "Best place to get my weekly pulls. Fast shipping!", author: "Alex M.", rating: 5 },
  { quote: "The collection here is unmatched. Found every variant I wanted.", author: "Jordan K.", rating: 5 },
  { quote: "Prices are fair and the condition is always mint.", author: "Sam R.", rating: 5 },
];

export default function TestimonialGrid() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-black text-white mb-6">Why fans love it</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DUMMY_TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-[#FFD700]/30 p-6 text-left"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <span key={j} className="text-[#FFD700]">★</span>
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-[#FFD700] text-xs font-bold">— {t.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
