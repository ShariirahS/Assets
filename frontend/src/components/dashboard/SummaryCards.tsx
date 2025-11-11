"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";

const metrics = [
  { label: "Active Tickets", value: "24", trend: "+12%" },
  { label: "Wallet Balance", value: "$12,450", trend: "+4%" },
  { label: "Pending Payouts", value: "$3,200", trend: "-2%" },
];

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="flex items-center justify-between">
            <p className="text-sm font-medium text-default-500">{metric.label}</p>
            <span className="text-xs font-semibold text-success">{metric.trend}</span>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
