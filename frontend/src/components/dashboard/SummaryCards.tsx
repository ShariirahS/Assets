"use client";

import { formatCurrency } from "@/lib/format";
import type { DashboardMetric } from "@/types";

interface SummaryCardsProps {
  metrics: DashboardMetric[];
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {metrics.map((metric, index) => {
        const value = metric.unit
          ? formatCurrency(metric.value, metric.unit)
          : metric.value.toLocaleString();

        return (
          <div
            key={metric.label}
            className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-surface px-7 pb-7 pt-8 shadow-floating transition-transform duration-500 ease-soft-bounce hover:-translate-y-1.5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accentStrong/10 opacity-90" />
            <div className="relative flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <span className="layer-chip inline-flex w-max">{metric.label}</span>
                <span className="text-4xl font-semibold tracking-tight text-foreground">{value}</span>
                <span className="text-xs text-muted">Vitals refreshed every 15 minutes</span>
              </div>
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accentStrong/20 text-sm font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="pointer-events-none absolute -bottom-16 right-6 h-32 w-32 rounded-full bg-accentSoft/40 blur-3xl" />
          </div>
        );
      })}
    </div>
  );
}
