"use client";

import Link from "next/link";
import { Card, CardBody, Chip } from "@heroui/react";

import { AppButton } from "@/components/ui/AppButton";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { heroGradient } from "@/styles/theme";

export default function HomePage() {
  const { status, lastCheckedLabel, error, isChecking, refresh, isHealthy } =
    useBackendHealth(20000);

  const statusTone = isHealthy
    ? "success"
    : status === "error" && !isChecking
      ? "danger"
      : "default";

  return (
    <section className="flex flex-col gap-12">
      <div className={`glass-panel mx-auto flex max-w-4xl flex-col items-center gap-6 px-8 py-14 text-center bg-gradient-to-br ${heroGradient}`}>
        <Chip color="primary" variant="flat">
          Activate Architecture Shell
        </Chip>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Assets Platform brings lending, wallets, and reporting together.
        </h1>
        <p className="text-lg text-default-400 md:text-xl">
          Launch faster with our Django Ninja API and Next.js dashboard starter.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AppButton as={Link} href="/auth/register" size="lg">
            Get Started
          </AppButton>
          <AppButton as={Link} href="/dashboard" size="lg" variant="bordered">
            View Dashboard
          </AppButton>
        </div>
      </div>
      <Card className="mx-auto w-full max-w-3xl border border-default-200/60 bg-background/80">
        <CardBody className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-start gap-1 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-default-500">
              Backend health
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Chip color={statusTone} variant="flat">
                {isChecking
                  ? "Checking"
                  : isHealthy
                    ? "Healthy"
                    : status === "error"
                      ? "Unavailable"
                      : "Checking"}
              </Chip>
              {lastCheckedLabel ? (
                <span className="text-xs text-default-400">Last checked {lastCheckedLabel}</span>
              ) : null}
            </div>
            {error ? <p className="text-xs text-danger">{error}</p> : null}
          </div>
          <AppButton
            size="sm"
            variant="bordered"
            isLoading={isChecking}
            onPress={() => {
              void refresh();
            }}
          >
            Refresh status
          </AppButton>
        </CardBody>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Wallet Monitoring",
            description: "Track balances, settlements, and payouts in real time.",
          },
          {
            title: "Ticket Automation",
            description: "Approve, settle, and audit the entire lending journey.",
          },
          {
            title: "Insights",
            description: "Visualize KPIs across assets, teams, and payment partners.",
          },
        ].map((feature) => (
          <Card key={feature.title} className="border border-default-200/50 bg-background/60">
            <CardBody className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-default-400">{feature.description}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
