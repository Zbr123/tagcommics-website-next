"use client";

import { motion } from "framer-motion";
import type React from "react";

interface LogoSliderProps {
  children: React.ReactNode;
  direction: "left" | "right";
  className?: string;
  single?: boolean;
  speedSeconds?: number;
}

export default function LogoSlider({
  children,
  direction,
  className = "",
  single = false,
  speedSeconds = 60,
}: LogoSliderProps) {
  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <motion.div
        className="flex w-max"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speedSeconds,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="flex">{children}</div>
        {!single && <div className="flex">{children}</div>}
      </motion.div>
    </div>
  );
}

interface LogoItemProps {
  children: React.ReactNode;
  icon?: boolean;
}

export function LogoItem({ children, icon = false }: LogoItemProps) {
  return (
    <div className="relative mx-4 inline-block rounded-[1.25rem] bg-gradient-to-b from-[#1F2224] to-[#16181A] p-[1px]">
      <div className="relative flex items-center rounded-[1.2rem] bg-gradient-to-b from-[#16181A] to-[#0F1011] to-70% px-8 py-4 text-[1.2rem] font-semibold text-[#F0F2FF]">
        {icon && (
          <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-sm bg-white">
            <div className="h-3 w-3 bg-black"></div>
          </div>
        )}
        <span>{children}</span>
      </div>
    </div>
  );
}

export function LogoImageItem({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`mx-4 h-16 w-auto object-contain inline-block ${className}`}
      style={{ flex: "0 0 auto" }}
    />
  );
}
