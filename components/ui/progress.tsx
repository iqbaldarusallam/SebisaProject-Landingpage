import * as React from "react";
import { cn } from "@/lib/cn";

export function Progress({
  value = 0,
  className,
  indicatorClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  indicatorClassName?: string;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
      {...props}
    >
      <div
        className={cn("h-full rounded-full bg-[#173472] transition-all", indicatorClassName)}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
