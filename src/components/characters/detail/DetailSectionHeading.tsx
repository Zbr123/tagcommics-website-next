interface DetailSectionHeadingProps {
  white: string;
  brand: string;
  className?: string;
  align?: "center" | "left";
}

export default function DetailSectionHeading({
  white,
  brand,
  className = "",
  align = "center",
}: DetailSectionHeadingProps) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  return (
    <h2
      className={`${alignClass} text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl md:text-6xl lg:text-[3.25rem] ${className}`.trim()}
    >
      <span className="text-white">{white}</span>
      <span className="text-brand">{brand}</span>
    </h2>
  );
}
