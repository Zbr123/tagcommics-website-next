"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faBrain,
  faHandFist,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { AttributeScores } from "@/src/data/characterDetailProfile";
import DetailSectionHeading from "./DetailSectionHeading";
import DetailSectionShell from "./DetailSectionShell";

const ATTRIBUTE_CARDS: {
  key: keyof AttributeScores;
  label: string;
  icon: IconDefinition;
}[] = [
  { key: "strength", label: "Strength", icon: faHandFist },
  { key: "speed", label: "Speed", icon: faBolt },
  { key: "intelligence", label: "Intelligence", icon: faBrain },
  { key: "durability", label: "Durability", icon: faShieldHalved },
];

/** Unified icon box so fist / bolt / brain / shield read the same visual weight as the reference */
const ICON_BOX_PX = 64;

function AttributeCard({
  label,
  value,
  icon,
  reveal,
}: {
  label: string;
  value: number;
  icon: IconDefinition;
  reveal: boolean;
}) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div
      className="group relative flex h-full min-h-[268px] flex-col rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-[28px] shadow-[0_14px_40px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_22px_56px_rgba(0,0,0,0.68),0_0_0_1px_rgba(88,232,193,0.12),0_0_40px_rgba(88,232,193,0.14)] lg:min-h-[260px]"
    >
      <div
        className="pointer-events-none absolute right-[26px] top-[26px] flex items-center justify-center text-brand opacity-[0.11] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-[0.2] group-hover:drop-shadow-[0_0_18px_rgba(88,232,193,0.25)]"
        style={{ width: ICON_BOX_PX, height: ICON_BOX_PX }}
        aria-hidden
      >
        <FontAwesomeIcon
          icon={icon}
          className="block leading-none"
          style={{
            fontSize: ICON_BOX_PX,
            width: "1em",
            height: "1em",
            color: "rgb(88, 232, 193)",
          }}
        />
      </div>

      <p className="relative z-[1] pr-[76px] text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500">
        {label.toUpperCase()}
      </p>

      <div className="relative z-[1] mt-5 flex flex-1 flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-[clamp(2.75rem,4.2vw,3.65rem)] font-black tabular-nums leading-none tracking-tight text-white">
            {value}
          </span>
          <span className="translate-y-0.5 text-base font-bold tabular-nums text-brand sm:text-lg md:text-xl">/100</span>
        </div>
      </div>

      <div className="relative z-[1] mt-auto pt-7">
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800/90">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand via-cyan-300 to-brand shadow-[0_0_12px_rgba(88,232,193,0.45)] transition-[width,box-shadow] duration-1000 ease-out group-hover:shadow-[0_0_20px_rgba(88,232,193,0.85),0_0_36px_rgba(88,232,193,0.35)]"
            style={{ width: reveal ? `${pct}%` : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function CharacterKeyAttributes({ attributes }: { attributes: AttributeScores }) {
  const [revealBars, setRevealBars] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealBars(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <DetailSectionShell>
      <DetailSectionHeading
        white="KEY "
        brand="ATTRIBUTES"
        align="left"
        className="!tracking-tight mb-10 md:mb-14 lg:mb-16"
      />
      <div className="grid auto-rows-fr grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-4">
        {ATTRIBUTE_CARDS.map(({ key, label, icon }) => (
          <AttributeCard
            key={key}
            label={label}
            value={attributes[key]}
            icon={icon}
            reveal={revealBars}
          />
        ))}
      </div>
    </DetailSectionShell>
  );
}
