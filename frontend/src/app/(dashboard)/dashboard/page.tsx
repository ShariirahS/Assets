"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Chip, Spinner } from "@heroui/react";
import { useShallow } from "zustand/react/shallow";

import { AuthGate } from "@/components/auth/AuthGate";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { fetchDashboardData } from "@/lib/reports";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import type { DashboardData } from "@/types";
import { useAuthStore } from "@/hooks/useAuth";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

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

  const operatorName = user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Operator";

  const renderHero = () => {
    if (!data) {
      return null;
    }

    const primaryMetric = data.metrics[0];
    const supportingMetric = data.metrics[1] ?? data.metrics[0];
    const latestActivity = data.recentActivity[0];

    const primaryValue = primaryMetric
      ? primaryMetric.unit
        ? formatCurrency(primaryMetric.value, primaryMetric.unit)
        : primaryMetric.value.toLocaleString()
      : "--";
    const supportingValue = supportingMetric
      ? supportingMetric.unit
        ? formatCurrency(supportingMetric.value, supportingMetric.unit)
        : supportingMetric.value.toLocaleString()
      : "--";

    return (
      <section className="relative overflow-hidden rounded-[2.75rem] border border-border/40 bg-surface shadow-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/85 via-accentStrong/70 to-[#89A3FF]" />
        <div className="relative grid gap-10 px-10 py-14 text-white lg:grid-cols-[1.4fr,0.8fr] lg:px-16">
          <div className="flex flex-col gap-7">
            <span className="layer-chip border-white/30 bg-white/10 text-white/80">
              Ward status • {primaryMetric?.label ?? "Pulse"}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {operatorName}, your care pod is stabilized
            </h1>
            <p className="max-w-xl text-sm text-white/85">
              Every balance, ticket, and payment is monitored like a vital sign. Follow the gradient trail to see which
              operations need attention next.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.32em] text-white/80">
                {latestActivity ? formatRelativeTime(latestActivity.timestamp) : "Awaiting updates"}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.32em] text-white/80">
                {data.recentActivity.length} events today
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="layer-glass border-white/20 bg-white/10 p-6 text-white">
              <CardBody className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
                  {primaryMetric?.label ?? "Primary metric"}
                </p>
                <p className="text-4xl font-semibold tracking-tight">{primaryValue}</p>
                <p className="text-xs text-white/80">
                  Reconciled {latestActivity ? formatRelativeTime(latestActivity.timestamp) : "moments ago"}
                </p>
              </CardBody>
            </Card>
            <Card className="layer-glass border-white/20 bg-white/10 p-6 text-white">
              <CardBody className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
                  {supportingMetric?.label ?? "Supporting metric"}
                </p>
                <p className="text-3xl font-semibold tracking-tight">{supportingValue}</p>
                <p className="text-xs text-white/80">Cleared by operations pod</p>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="pointer-events-none absolute -left-28 bottom-0 h-96 w-96 rounded-full bg-white/20 blur-[180px]" />
        <div className="pointer-events-none absolute -right-10 top-12 h-72 w-72 rounded-full bg-[#A5B4FF]/40 blur-[140px]" />
      </section>
    );
  };

  return (
    <AuthGate>
      <div className="flex flex-col gap-12">
        {isLoading ? (
          <div className="flex h-[420px] items-center justify-center rounded-hero border border-border/40 bg-surface/70 shadow-soft">
            <Spinner color="primary" label="Calibrating dashboard..." labelColor="foreground" />
          </div>
        ) : error || !data ? (
          <div className="rounded-[2rem] border border-dangerAccent/40 bg-dangerAccent/10 p-10 text-center shadow-soft">
            <p className="text-sm font-medium text-dangerAccent">{error ?? "Dashboard unavailable."}</p>
            <p className="mt-2 text-xs text-dangerAccent/70">We’ll resync your vitals shortly.</p>
          </div>
        ) : (
          <>
            {renderHero()}
            <SummaryCards metrics={data.metrics} />
            <div className="grid gap-8 xl:grid-cols-[1.5fr,1fr]">
              <PerformanceChart data={data.performance} />
              <div className="layer-card flex h-full flex-col overflow-hidden p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">Timeline</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Activity stream</h2>
                  </div>
                  <Chip
                    radius="full"
                    className="bg-accent/15 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent"
                  >
                    {data.recentActivity.length} events
                  </Chip>
                </div>
                <div className="mt-6 flex-1 space-y-5 overflow-auto pr-1">
                  {data.recentActivity.length === 0 ? (
                    <p className="text-sm text-muted">No activity recorded yet.</p>
                  ) : (
                    data.recentActivity.map((activity, idx) => (
                      <div
                        key={activity.id}
                        className="relative overflow-hidden rounded-[1.75rem] border border-border/40 bg-surfaceMuted/80 p-6 shadow-soft"
                      >
                        <div className="absolute left-6 top-6 size-2 rounded-full bg-accent shadow-soft" />
                        {idx !== data.recentActivity.length - 1 ? (
                          <div className="absolute left-[1.6rem] top-8 h-full w-px bg-border/40" />
                        ) : null}
                        <div className="ml-6 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-foreground">{activity.message}</p>
                          <span className="rounded-full bg-accent/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent">
                            {activity.category}
                          </span>
                        </div>
                        <p className="ml-6 mt-3 text-xs text-muted">{formatRelativeTime(activity.timestamp)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGate>
  );
}
