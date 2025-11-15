"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useTheme } from "next-themes";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

import type { PerformancePoint } from "@/types";

interface PerformanceChartProps {
  data: PerformancePoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="layer-card overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Weekly pulse</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Performance trajectory
          </h2>
        </div>
        <div className="hidden rounded-2xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-accent md:block">
          {isDark ? "night shift" : "day shift"}
        </div>
      </CardHeader>
      <CardBody className="h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-default-500">
            No verified payments this week.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map((point) => ({ name: point.label, value: point.value }))}>
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#0f172a", borderRadius: 12, color: "#fff" }}
              />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
