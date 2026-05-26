"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/client-utils";

interface PromoCountdownProps {
  endDate: Date;
}

export default function PromoCountdown({ endDate }: PromoCountdownProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeRemaining(endDate));

    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTime(remaining);

      if (remaining.expired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (mounted && time.expired) {
    return (
      <div className="rounded-full bg-red-600 px-2.5 py-1.5 text-center text-[9px] font-semibold text-white shadow-lg shadow-red-950/20 sm:px-4 sm:py-2 sm:text-xs">
        Promo expired
      </div>
    );
  }

  const totalHours = time.days * 24 + time.hours;
  const values = [
    String(totalHours).padStart(2, "0"),
    String(time.minutes).padStart(2, "0"),
    String(time.seconds).padStart(2, "0"),
  ];

  return (
    <div className="rounded-full bg-red-600 px-2.5 py-1.5 text-center text-white shadow-lg shadow-red-950/20 sm:px-5 sm:py-2">
      <div className="font-mono text-xs font-black leading-none sm:text-xl">
        {values.join(":")}
      </div>
    </div>
  );
}
