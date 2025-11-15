"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
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
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Wallet overview</h1>
              <p className="text-small text-default-500">Monitor available balances, ledger health, and last activity.</p>
            </div>
          </CardHeader>
          <CardBody className="grid gap-6 md:grid-cols-3">
            {isLoading ? (
              <div className="col-span-3 flex h-40 items-center justify-center">
                <Spinner color="primary" label="Loading wallet..." labelColor="foreground" />
              </div>
            ) : error || !data ? (
              <div className="col-span-3 rounded-xl border border-danger-500/50 bg-danger-500/10 p-6 text-center">
                <p className="text-sm text-danger-500">{error ?? "Wallet information unavailable"}</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-default-200/40 p-4">
                  <p className="text-sm text-default-500">Available balance</p>
                  <p className="text-3xl font-semibold text-foreground">
                    {formatCurrency(data.wallet.balance, data.wallet.currency)}
                  </p>
                  <p className="text-tiny text-default-500">Status: {data.wallet.status}</p>
                </div>
                <div className="rounded-xl border border-default-200/40 p-4">
                  <p className="text-sm text-default-500">Settlement buffer</p>
                  <Progress
                    aria-label="Settlement buffer"
                    value={data.wallet.settlementBuffer}
                    color={data.wallet.settlementBuffer > 50 ? "success" : "warning"}
                    className="mt-3"
                  />
                  <p className="mt-2 text-xs text-default-500">{data.wallet.settlementBuffer}% verified inflows</p>
                </div>
                <div className="rounded-xl border border-default-200/40 p-4">
                  <p className="text-sm text-default-500">Upcoming payouts</p>
                  <p className="text-3xl font-semibold text-foreground">
                    {formatCurrency(data.wallet.upcomingPayouts, data.wallet.currency)}
                  </p>
                </div>
              </>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner color="primary" label="Loading transactions..." labelColor="foreground" />
              </div>
            ) : error || !data ? (
              <p className="text-sm text-default-500">{error ?? "Transactions unavailable."}</p>
            ) : data.transactions.length === 0 ? (
              <p className="text-sm text-default-500">No transactions recorded yet.</p>
            ) : (
              <Table removeWrapper aria-label="Recent wallet transactions">
                <TableHeader>
                  <TableColumn>Reference</TableColumn>
                  <TableColumn>Ticket</TableColumn>
                  <TableColumn>Type</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Created</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>{transaction.ticketAsset}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        {formatCurrency(transaction.amount, data.wallet.currency)}
                      </TableCell>
                      <TableCell>{transaction.statusLabel}</TableCell>
                      <TableCell>{formatRelativeTime(transaction.createdAt)}</TableCell>
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
