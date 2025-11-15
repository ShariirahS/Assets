"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Chip, Spinner } from "@nextui-org/react";

import { AuthGate } from "@/components/auth/AuthGate";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { fetchDashboardData } from "@/lib/reports";
import { formatRelativeTime } from "@/lib/format";
import type { DashboardData } from "@/types";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const snapshot = await fetchDashboardData();
        if (!active) {
          return;
        }
        setData(snapshot);
        setError(null);
      } catch {
        if (!active) {
          return;
        }
        setError("Unable to load dashboard data");
        setData(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthGate>
      <div className="flex flex-col gap-8">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner color="primary" label="Loading dashboard..." labelColor="foreground" />
          </div>
        ) : error || !data ? (
          <div className="rounded-xl border border-danger-500/50 bg-danger-500/10 p-6 text-center">
            <p className="text-sm text-danger-500">{error ?? "Dashboard unavailable."}</p>
          </div>
        ) : (
          <>
            <SummaryCards metrics={data.metrics} />
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <PerformanceChart data={data.performance} />
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-foreground">Latest activity</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {data.recentActivity.length === 0 ? (
                    <p className="text-sm text-default-500">No activity recorded yet.</p>
                  ) : (
                    data.recentActivity.map((activity) => (
                      <div key={activity.id} className="rounded-lg border border-default-200/40 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{activity.message}</p>
                          <Chip color="primary" size="sm" variant="flat">
                            {activity.category}
                          </Chip>
                        </div>
                        <p className="text-xs text-default-500">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    ))
                  )}
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>
    </AuthGate>
  );
}
