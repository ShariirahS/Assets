"use client";

import { useEffect, useMemo, useState } from "react";
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

import { AuthGate } from "@/components/auth/AuthGate";
import { fetchTickets } from "@/lib/tickets";
import { formatRelativeTime } from "@/lib/format";
import type { TicketItem } from "@/types";

const STATUS_BADGES: Partial<Record<TicketItem["status"], string>> = {
  pending: "bg-warningAccent/15 text-warningAccent",
  accepted: "bg-accent/15 text-accent",
  active: "bg-successAccent/15 text-successAccent",
  completed: "bg-successAccent/15 text-successAccent",
  cancelled: "bg-dangerAccent/15 text-dangerAccent",
};

const PRIORITY_STATUSES = new Set<TicketItem["status"]>(["pending", "accepted", "active"]);

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetchTickets();
        if (!active) {
          return;
        }
        setTickets(response);
        setError(null);
      } catch {
        if (!active) {
          return;
        }
        setError("Unable to load tickets");
        setTickets([]);
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

  const sortedTickets = useMemo(
    () =>
      [...tickets].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [tickets],
  );

  const statusTotals = useMemo(() => {
    return sortedTickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] ?? 0) + 1;
      return acc;
    }, {});
  }, [sortedTickets]);

  return (
    <AuthGate>
      <div className="flex flex-col gap-12">
        {isLoading ? (
          <div className="flex h-[320px] items-center justify-center rounded-hero border border-border/40 bg-surface/70 shadow-soft">
            <Spinner color="primary" label="Syncing tickets..." labelColor="foreground" />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-dangerAccent/40 bg-dangerAccent/10 p-8 text-center shadow-soft">
            <p className="text-sm font-medium text-dangerAccent">{error}</p>
          </div>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-[2.75rem] border border-border/40 bg-surface shadow-hero">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/80 via-accentStrong/70 to-[#8FA8FF]" />
              <div className="relative grid gap-8 px-10 py-12 text-white lg:grid-cols-[1.3fr,0.7fr]">
                <div className="flex flex-col gap-6">
                  <span className="layer-chip border-white/30 bg-white/10 text-white/80">Ticket observatory</span>
                  <h1 className="text-4xl font-semibold tracking-tight">Lifecycle control center</h1>
                  <p className="max-w-lg text-sm text-white/85">
                    Track borrower and lender coordination without missing a beat. High-priority rounds glow brighter so
                    your triage squad reacts instantly.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.32em] text-white/80">
                      {sortedTickets.length} total tickets
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase tracking-[0.32em] text-white/80">
                      {statusTotals.active ?? 0} active rounds
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    ["pending", "accepted", "active", "completed", "cancelled"] as TicketItem["status"][]
                  ).map((status) => (
                    <div
                      key={status}
                      className="layer-glass border-white/20 bg-white/10 p-6 text-white"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">{status}</p>
                      <p className="mt-4 text-3xl font-semibold tracking-tight">
                        {(statusTotals[status] ?? 0).toString().padStart(2, "0")}
                      </p>
                      <p className="mt-2 text-xs text-white/80">{PRIORITY_STATUSES.has(status) ? "Priority" : "Monitoring"}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-white/25 blur-[150px]" />
              <div className="pointer-events-none absolute -right-16 top-12 h-72 w-72 rounded-full bg-[#B2C5FF]/35 blur-[140px]" />
            </section>
            <section className="layer-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/30 px-8 py-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">Ticket registry</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Active roster</h2>
                </div>
                <span className="hidden rounded-full bg-accent/15 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-accent md:block">
                  refreshed {formatRelativeTime(sortedTickets[0]?.updatedAt ?? new Date().toISOString())}
                </span>
              </div>
              <div className="px-2 pb-6 pt-4">
                {sortedTickets.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-muted">No tickets available yet.</p>
                ) : (
                  <Table
                    removeWrapper
                    aria-label="Tickets table"
                    classNames={{
                      table: "min-w-full",
                      thead: "[&_th]:bg-transparent",
                      th: "border-b border-border/30 px-6 py-4 text-left text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-muted",
                      td: "px-6 py-5 text-sm text-foreground",
                      tr: "border-b border-border/20 last:border-none transition-colors hover:bg-surfaceMuted/60",
                    }}
                  >
                    <TableHeader>
                      <TableColumn>ID</TableColumn>
                      <TableColumn>Asset</TableColumn>
                      <TableColumn>Status</TableColumn>
                      <TableColumn>Borrower</TableColumn>
                      <TableColumn>Lender</TableColumn>
                      <TableColumn>Updated</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={""}>
                      {sortedTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-semibold text-foreground">
                            TK-{ticket.id.toString().padStart(3, "0")}
                          </TableCell>
                          <TableCell className="text-muted">{ticket.assetName}</TableCell>
                          <TableCell>
                            <span
                              className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${
                                STATUS_BADGES[ticket.status] ?? "bg-surfaceMuted/60 text-foreground"
                              }`}
                            >
                              {ticket.statusLabel}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-foreground">{ticket.borrower}</TableCell>
                          <TableCell className="text-sm text-foreground">{ticket.lender}</TableCell>
                          <TableCell className="text-xs uppercase tracking-[0.28em] text-muted">
                            {formatRelativeTime(ticket.updatedAt)}
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
