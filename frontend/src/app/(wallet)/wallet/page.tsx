"use client";

import { useEffect, useState } from "react";
import {
  Progress,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

import { AuthGate } from "@/components/auth/AuthGate";
import { fetchWalletOverview } from "@/lib/wallet";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import type { WalletOverview } from "@/types";

export default function WalletPage() {
  const [data, setData] = useState<WalletOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const overview = await fetchWalletOverview();
        if (!active) {
          return;
        }
        setData(overview);
        setError(null);
      } catch {
        if (!active) {
          return;
        }
        setError("Unable to load wallet data");
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
      <div className="flex flex-col gap-12">
        {isLoading ? (
          <div className="flex h-[360px] items-center justify-center rounded-hero border border-border/40 bg-surface/70 shadow-soft">
            <Spinner color="primary" label="Balancing ledgers..." labelColor="foreground" />
          </div>
        ) : error || !data ? (
          <div className="rounded-[2rem] border border-dangerAccent/40 bg-dangerAccent/10 p-8 text-center shadow-soft">
            <p className="text-sm font-medium text-dangerAccent">{error ?? "Wallet information unavailable"}</p>
          </div>
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="relative overflow-hidden rounded-[2.25rem] border border-accent/30 bg-surface shadow-hero">
                <div className="absolute inset-0 layer-gradient opacity-95" />
                <div className="relative flex h-full flex-col gap-6 px-8 py-10 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Wallet reserve</p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                      {formatCurrency(data.wallet.balance, data.wallet.currency)}
                    </h1>
                    <p className="mt-3 text-sm text-white/75">Status · {data.wallet.status.toUpperCase()}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-6 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">Settlement buffer</p>
                    <div className="mt-4 flex items-center gap-4">
                      <Progress
                        aria-label="Settlement buffer"
                        value={data.wallet.settlementBuffer}
                        classNames={{
                          base: "flex-1",
                          indicator: "bg-white",
                          track: "bg-white/20",
                        }}
                      />
                      <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                        {data.wallet.settlementBuffer}%
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-white/70">Verified inflows secured across counterparties.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">Next payouts</p>
                    <p className="mt-4 text-2xl font-semibold tracking-tight">
                      {formatCurrency(data.wallet.upcomingPayouts, data.wallet.currency)}
                    </p>
                    <p className="mt-2 text-xs text-white/70">
                      Latest activity {data.transactions[0] ? formatRelativeTime(data.transactions[0].createdAt) : "pending"}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-20 top-20 h-60 w-60 rounded-full bg-white/25 blur-[140px]" />
              </div>
              <div className="layer-card flex flex-col gap-6 p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Ledger posture</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">Operational vitals</h2>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-border/40 bg-surfaceMuted/70 p-5 shadow-soft">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted">Clearing focus</p>
                    <p className="mt-3 text-sm text-foreground">
                      Automated sweeps watch {data.transactions.length.toString()} transactions right now.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/40 bg-surfaceMuted/70 p-5 shadow-soft">
                    <p className="text-xs uppercase tracking-[0.32em] text-muted">Compliance sync</p>
                    <p className="mt-3 text-sm text-foreground">
                      Every payout is mirrored with ledger-grade audit trails in under five minutes.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="layer-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/30 px-8 py-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">Recent transactions</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Wallet movements</h2>
                </div>
                <span className="hidden rounded-full bg-accent/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-accent md:block">
                  {data.transactions.length} entries
                </span>
              </div>
              <div className="px-2 pb-6 pt-4">
                {data.transactions.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-muted">No transactions recorded yet.</p>
                ) : (
                  <Table
                    removeWrapper
                    aria-label="Recent wallet transactions"
                    classNames={{
                      base: "rounded-[1.75rem]", // not used? but we can keep
                      table: "min-w-full", 
                      thead: "[&_th]:bg-transparent", 
                      th: "border-b border-border/30 px-6 py-4 text-left text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted",
                      td: "px-6 py-5 text-sm text-foreground",
                      tr: "border-b border-border/20 last:border-none transition-colors hover:bg-surfaceMuted/60",
                      wrapper: "", 
                    }}
                  >
                    <TableHeader>
                      <TableColumn>Reference</TableColumn>
                      <TableColumn>Ticket</TableColumn>
                      <TableColumn>Type</TableColumn>
                      <TableColumn>Amount</TableColumn>
                      <TableColumn>Status</TableColumn>
                      <TableColumn>Created</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={""}>
                      {data.transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-semibold text-foreground">{transaction.reference}</TableCell>
                          <TableCell className="text-muted">{transaction.ticketAsset}</TableCell>
                          <TableCell className="uppercase tracking-[0.28em] text-xs text-muted">
                            {transaction.type}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {formatCurrency(transaction.amount, data.wallet.currency)}
                          </TableCell>
                          <TableCell>
                            <span className="rounded-full bg-accent/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent">
                              {transaction.statusLabel}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs uppercase tracking-[0.28em] text-muted">
                            {formatRelativeTime(transaction.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AuthGate>
  );
}
