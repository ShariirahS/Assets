"use client";

import { Card, CardBody, CardHeader, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

const transactions = [
  { id: "TX-901", type: "Top-up", amount: "+$500", status: "Completed" },
  { id: "TX-902", type: "Settlement", amount: "-$120", status: "Processing" },
  { id: "TX-903", type: "Payout", amount: "-$340", status: "Completed" },
];

export default function WalletPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Wallet overview</h1>
            <p className="text-small text-default-500">Monitor available balances, ledger health, and last activity.</p>
          </div>
        </CardHeader>
        <CardBody className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-default-200/40 p-4">
            <p className="text-sm text-default-500">Available balance</p>
            <p className="text-3xl font-semibold text-foreground">$12,450</p>
          </div>
          <div className="rounded-xl border border-default-200/40 p-4">
            <p className="text-sm text-default-500">Settlement buffer</p>
            <Progress aria-label="Settlement buffer" value={72} color="primary" className="mt-3" />
          </div>
          <div className="rounded-xl border border-default-200/40 p-4">
            <p className="text-sm text-default-500">Upcoming payouts</p>
            <p className="text-3xl font-semibold text-foreground">$3,200</p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label="Recent wallet transactions">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Amount</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
