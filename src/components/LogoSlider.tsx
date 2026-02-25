"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from 'next/image';
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
  // normalize children to array so we can clone the duplicates with unique keys
  const items = React.Children.toArray(children);

  const initialX = direction === "left" ? "0%" : "-50%";
  const animateX = direction === "left" ? "-50%" : "0%";

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <motion.div
        className="flex w-max"
        initial={{ x: initialX }}
        animate={{ x: animateX }}
        transition={{
          duration: speedSeconds,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="flex">{items}</div>

        {!single && (
          // duplicate the set for a seamless loop; clone elements to avoid duplicate keys
          <div className="flex pointer-events-none" aria-hidden>
            {items.map((child, idx) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { key: `dup-${idx}` });
              }
              return child;
            })}
          </div>
        )}
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
    <div className={`mx-4 md:mx-6 inline-block ${className}`}>
      <div className="w-28 md:w-36 h-12 md:h-16 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={160}
          height={64}
          className="w-auto h-full object-contain"
          sizes="(max-width: 768px) 80px, 160px"
        />
      </div>
    </div>
  );
}



