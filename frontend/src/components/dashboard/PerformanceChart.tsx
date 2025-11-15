"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { PerformancePoint } from "@/types";

interface PerformanceChartProps {
  data: PerformancePoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Weekly Performance</h2>
          <p className="text-small text-default-500">Ticket approvals and wallet inflows</p>
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
