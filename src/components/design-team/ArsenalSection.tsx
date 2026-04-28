"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact, faFigma } from "@fortawesome/free-brands-svg-icons";
import { faPenNib, faCube, faCode, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

interface ToolTile {
  name: string;
  icon: "figma" | "pen-nib" | "cube" | "code" | "react" | "wand-magic-sparkles";
}

const TOOLS: ToolTile[] = [
  { name: "Figma", icon: "figma" },
  { name: "Illustrator", icon: "pen-nib" },
  { name: "Cinema 4D", icon: "cube" },
  { name: "Tailwind", icon: "code" },
  { name: "React", icon: "react" },
  { name: "Midjourney", icon: "wand-magic-sparkles" },
];

function getToolIcon(icon: ToolTile["icon"]) {
  switch (icon) {
    case "figma":
      return faFigma;
    case "pen-nib":
      return faPenNib;
    case "cube":
      return faCube;
    case "code":
      return faCode;
    case "react":
      return faReact;
    case "wand-magic-sparkles":
      return faWandMagicSparkles;
    default:
      return faCode;
  }
}

export default function ArsenalSection() {
  return (
    <div>
      <h2 className="text-[42px] font-black uppercase leading-[0.95] tracking-tight text-white md:text-4xl">
        The <span className="text-[#58E8C1]">Arsenal</span>
      </h2>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Instruments of Creation</p>

      <div className="mt-10 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 sm:p-6 hover:border-brand/30 hover:shadow-[0_14px_30px_rgba(88,232,193,0.12)]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <article
              key={tool.name}
              className="group flex h-[180px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-[#111319] text-center transition-all duration-300 hover:-translate-y-[4px] hover:scale-[1.02] hover:border-cyan-300/30"
            >
              <FontAwesomeIcon
                icon={getToolIcon(tool.icon)}
                className="h-9 w-9 text-zinc-200 transition-colors duration-300 group-hover:text-[#58E8C1]"
              />
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-zinc-300">{tool.name}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
