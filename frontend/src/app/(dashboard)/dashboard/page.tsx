"use client";

import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

const recentActivity = [
  { id: "TK-120", message: "New ticket submitted", time: "2m ago" },
  { id: "WL-448", message: "Wallet top-up approved", time: "10m ago" },
  { id: "PM-330", message: "Payment webhook verified", time: "35m ago" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <SummaryCards />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <PerformanceChart />
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Latest activity</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="rounded-lg border border-default-200/40 p-4">
                <p className="text-sm font-medium text-foreground">{activity.message}</p>
                <p className="text-xs text-default-500">{activity.id} • {activity.time}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
