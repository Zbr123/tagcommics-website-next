"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accent?: "brand" | "green" | "blue" | "red" | "purple" | "gray";
  delay?: number;
}

const ACCENT_STYLES: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  brand: "text-brand border-brand/30",
  green: "text-green-400 border-green-500/30",
  blue: "text-blue-400 border-blue-500/30",
  red: "text-red-400 border-red-500/30",
  purple: "text-purple-400 border-purple-500/30",
  gray: "text-gray-300 border-gray-700",
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accent = "gray",
  delay = 0,
}: MetricCardProps) {
  const accentClass = ACCENT_STYLES[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={`rounded-xl border ${accentClass} bg-gradient-to-br from-gray-900 to-gray-800 p-6`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
          {subtitle ? <p className="mt-2 text-xs text-gray-400">{subtitle}</p> : null}
        </div>
        {icon ? <div className="text-gray-400">{icon}</div> : null}
      </div>
    </motion.div>
  );
}
