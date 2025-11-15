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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const axisColor = isDark ? "#A9B5D9" : "#7284A7";
  const gridColor = isDark ? "rgba(169, 181, 217, 0.12)" : "rgba(114, 132, 167, 0.18)";
  const lineStart = isDark ? "#5BE7FF" : "#18A4FF";
  const lineEnd = isDark ? "#8F7BFF" : "#6F4BFF";
  const tooltipBg = isDark ? "#111A2F" : "#FFFFFF";
  const tooltipColor = isDark ? "#E7EDFF" : "#18243B";

  const renderTooltip: TooltipProps<number, string>["content"] = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        className="rounded-2xl border border-border/50 px-4 py-3 shadow-soft"
        style={{
          background: tooltipBg,
          color: tooltipColor,
        }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
        <p className="text-lg font-semibold text-foreground">
          {payload[0]?.value?.toLocaleString()}
        </p>
      </div>
    );
  };

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
      <CardBody className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No verified payments this week.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.map((point) => ({ name: point.label, value: point.value }))}>
              <defs>
                <linearGradient id="performanceLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={lineStart} />
                  <stop offset="100%" stopColor={lineEnd} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 12" vertical={false} />
              <XAxis
                dataKey="name"
                stroke={axisColor}
                tickLine={false}
                axisLine={false}
                tickMargin={14}
                fontSize={12}
              />
              <YAxis
                stroke={axisColor}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                fontSize={12}
              />
              <Tooltip cursor={{ stroke: lineStart, strokeDasharray: "4 8", strokeWidth: 2 }} content={renderTooltip} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#performanceLine)"
                strokeWidth={4}
                dot={{ r: 5, fill: lineStart, stroke: lineEnd, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
