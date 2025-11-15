"use client";

import { formatCurrency } from "@/lib/format";
import type { DashboardMetric } from "@/types";

interface SummaryCardsProps {
  metrics: DashboardMetric[];
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {metrics.map((metric, index) => {
        const value = metric.unit
          ? formatCurrency(metric.value, metric.unit)
          : metric.value.toLocaleString();
        return (
          <div
            key={metric.label}
            className="relative overflow-hidden rounded-[1.75rem] border border-border/40 bg-surface px-6 pb-6 pt-7 shadow-floating transition-transform duration-500 ease-soft-bounce hover:-translate-y-1.5"
          >
            <div className="absolute inset-x-6 top-0 h-2 rounded-b-full bg-gradient-to-r from-accent via-accentStrong to-[#8F7BFF]" />
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-muted">
                {metric.label}
              </p>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/15 text-sm font-semibold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-6 text-4xl font-semibold tracking-tight text-foreground">{value}</p>
            <p className="mt-3 text-xs text-muted">synced to live ledgers</p>
            <div className="absolute -right-14 bottom-[-3rem] h-32 w-32 rounded-full bg-accentSoft/40 blur-3xl" />
          </div>
        );
      })}
    </div>
  );
}
