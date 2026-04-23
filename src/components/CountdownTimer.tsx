"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [time, setTime] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const digitClass =
    "min-w-[2.5rem] rounded-lg border border-brand/35 bg-brand/10 px-3 py-1.5 text-center text-sm font-bold text-brand tabular-nums";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-zinc-400">Ends in:</span>
      <div className="flex items-center gap-1.5">
        <span className={digitClass}>{String(time.hours).padStart(2, "0")}</span>
        <span className="font-bold text-brand">:</span>
        <span className={digitClass}>{String(time.minutes).padStart(2, "0")}</span>
        <span className="font-bold text-brand">:</span>
        <span className={digitClass}>{String(time.seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

