"use client";

import { useEffect, useState } from "react";
import { Chip, Spinner } from "@nextui-org/react";
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
      <section className="relative overflow-hidden rounded-hero border border-accent/30 bg-surface shadow-hero">
        <div className="absolute inset-0 layer-gradient opacity-95" />
        <div className="relative grid gap-10 px-8 py-12 text-white lg:grid-cols-[1.3fr,0.7fr] lg:px-12 lg:py-14">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-white/70">
              Materialize ward overview
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Hey {operatorName}, your asset clinic is thriving
            </h1>
            <p className="max-w-xl text-sm text-white/80">
              We’re stabilizing inflows and approvals in real time so every portfolio pulse stays strong.
              Track the most critical vitals without breaking stride.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.3em] text-white/80">
                {primaryMetric?.label ?? "Live metric"}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.3em] text-white/80">
                {latestActivity ? formatRelativeTime(latestActivity.timestamp) : "Awaiting updates"}
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-white/25 bg-white/15 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
                {primaryMetric?.label ?? "Active balance"}
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-tight">{primaryValue}</p>
              <p className="mt-3 text-xs text-white/70">
                Reconciled against treasury {latestActivity ? formatRelativeTime(latestActivity.timestamp) : "moments ago"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
                {supportingMetric?.label ?? "Open tickets"}
              </p>
              <p className="mt-4 text-3xl font-semibold tracking-tight">{supportingValue}</p>
              <p className="mt-3 text-xs text-white/70">
                Monitored by operations pod for rapid clearances
              </p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 top-16 h-64 w-64 rounded-full bg-white/20 blur-[140px]" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#8F7BFF]/40 blur-[160px]" />
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
            <div className="grid gap-8 xl:grid-cols-[1.45fr,1fr]">
              <PerformanceChart data={data.performance} />
              <div className="layer-card flex h-full flex-col overflow-hidden p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Latest rounds</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Activity triage</h2>
                  </div>
                  <Chip radius="full" className="bg-accent/15 text-xs font-medium uppercase tracking-[0.28em] text-accent">
                    {data.recentActivity.length} logs
                  </Chip>
                </div>
                <div className="mt-6 flex-1 space-y-5 overflow-auto pr-2">
                  {data.recentActivity.length === 0 ? (
                    <p className="text-sm text-muted">No activity recorded yet.</p>
                  ) : (
                    data.recentActivity.map((activity, idx) => (
                      <div
                        key={activity.id}
                        className="group relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-surfaceMuted/70 p-5 shadow-soft"
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
