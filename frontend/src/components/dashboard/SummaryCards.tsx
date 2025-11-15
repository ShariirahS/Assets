"use client";

import { formatCurrency } from "@/lib/format";
import type { DashboardMetric } from "@/types";

import { formatCurrency } from "@/lib/format";
import type { DashboardMetric } from "@/types";

interface SummaryCardsProps {
  metrics: DashboardMetric[];
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => {
        const value = metric.unit
          ? formatCurrency(metric.value, metric.unit)
          : metric.value.toLocaleString();
        return (
          <Card key={metric.label}>
            <CardHeader>
              <p className="text-sm font-medium text-default-500">{metric.label}</p>
            </CardHeader>
            <CardBody>
              <p className="text-2xl font-semibold text-foreground">{value}</p>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
