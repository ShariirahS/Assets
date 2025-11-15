"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type ChipProps,
} from "@nextui-org/react";

import { AuthGate } from "@/components/auth/AuthGate";
import { fetchTickets } from "@/lib/tickets";
import { formatRelativeTime } from "@/lib/format";
import type { TicketItem } from "@/types";

const STATUS_COLORS: Partial<Record<TicketItem["status"], ChipProps["color"]>> = {
  pending: "warning",
  accepted: "primary",
  active: "success",
  completed: "success",
  cancelled: "danger",
};

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

  return (
    <AuthGate>
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Tickets</h1>
              <p className="text-small text-default-500">Manage the full lifecycle of asset lending requests.</p>
            </div>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner color="primary" label="Loading tickets..." labelColor="foreground" />
              </div>
            ) : error ? (
              <p className="text-sm text-danger-500">{error}</p>
            ) : sortedTickets.length === 0 ? (
              <p className="text-sm text-default-500">No tickets available yet.</p>
            ) : (
              <Table removeWrapper aria-label="Tickets table">
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>Asset</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Borrower</TableColumn>
                  <TableColumn>Lender</TableColumn>
                  <TableColumn>Updated</TableColumn>
                </TableHeader>
                <TableBody>
                  {sortedTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>TK-{ticket.id.toString().padStart(3, "0")}</TableCell>
                      <TableCell>{ticket.assetName}</TableCell>
                      <TableCell>
                        <Chip color={STATUS_COLORS[ticket.status] ?? "default"} variant="flat">
                          {ticket.statusLabel}
                        </Chip>
                      </TableCell>
                      <TableCell>{ticket.borrower}</TableCell>
                      <TableCell>{ticket.lender}</TableCell>
                      <TableCell>{formatRelativeTime(ticket.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </AuthGate>
  );
}
