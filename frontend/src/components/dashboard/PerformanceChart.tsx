"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 980 },
  { name: "Wed", value: 1430 },
  { name: "Thu", value: 1120 },
  { name: "Fri", value: 1680 },
];

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Weekly Performance</h2>
          <p className="text-small text-default-500">Ticket approvals and wallet inflows</p>
        </div>
      </CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "#0f172a", borderRadius: 12, color: "#fff" }}
            />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
