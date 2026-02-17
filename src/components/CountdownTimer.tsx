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

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400 font-medium">Ends in:</span>
      <div className="flex items-center gap-1.5">
        <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-lg font-bold text-sm min-w-[2.5rem] text-center">
          {String(time.hours).padStart(2, "0")}
        </span>
        <span className="text-red-400 font-bold">:</span>
        <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-lg font-bold text-sm min-w-[2.5rem] text-center">
          {String(time.minutes).padStart(2, "0")}
        </span>
        <span className="text-red-400 font-bold">:</span>
        <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1.5 rounded-lg font-bold text-sm min-w-[2.5rem] text-center">
          {String(time.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

