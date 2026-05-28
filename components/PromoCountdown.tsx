"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/client-utils";

interface PromoCountdownProps {
  claimHref: string;
  endDate: Date;
}

export default function PromoCountdown({
  claimHref,
  endDate,
}: PromoCountdownProps) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeRemaining(endDate));

    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endDate);
      setTime(remaining);

      if (remaining.expired) {
        setHidden(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (hidden || (mounted && time.expired)) {
    return null;
  }

  const totalHours = time.days * 24 + time.hours;
  const values = [
    String(totalHours).padStart(2, "0"),
    String(time.minutes).padStart(2, "0"),
    String(time.seconds).padStart(2, "0"),
  ];

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
      <div className="rounded-full bg-red-600 px-2.5 py-1.5 text-center text-white shadow-lg shadow-red-950/20 sm:px-5 sm:py-2">
        <div className="font-mono text-xs font-black leading-none sm:text-xl">
          {values.join(":")}
        </div>
      </div>

      <a
        href={claimHref}
        className="inline-flex min-h-7 items-center justify-center rounded-md border border-white/70 px-2 py-1 text-[8px] font-extrabold uppercase leading-tight text-white transition hover:bg-white hover:text-[#131C36] sm:min-h-8 sm:px-5 sm:text-[10px]"
      >
        CLAIM SEKARANG
      </a>
    </div>
  );
}
