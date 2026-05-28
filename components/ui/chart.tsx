"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/cn";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ReactNode;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-slate-500",
          "[&_.recharts-cartesian-grid_line]:stroke-slate-200",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-slate-300",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-slate-200",
          "[&_.recharts-radial-bar-background-sector]:fill-slate-100",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-slate-100",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children as React.ReactElement}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = "ChartContainer";

export const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipPayloadItem = {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
  color?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: React.ReactNode;
  valueFormatter?: (value: number, name: string) => string;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-2 font-bold text-slate-950">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "");
          const color = item.color || config[key]?.color || "#173472";
          const name = String(config[key]?.label ?? item.name ?? key);
          const rawValue = Number(item.value ?? 0);

          return (
            <div
              key={`${key}-${name}`}
              className="flex items-center justify-between gap-4"
            >
              <span className="inline-flex items-center gap-2 text-slate-600">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {name}
              </span>
              <span className="font-black text-slate-950">
                {valueFormatter ? valueFormatter(rawValue, key) : rawValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
