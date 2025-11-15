"use client";

import { Card, CardBody, CardHeader, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { AuthGate } from "@/components/auth/AuthGate";

const auditLog = [
  { action: "Role change", actor: "Leila Karimi", target: "Analyst", time: "1h ago" },
  { action: "Ticket export", actor: "Parsa Rezai", target: "CSV", time: "3h ago" },
  { action: "Payment override", actor: "Admin", target: "WL-112", time: "6h ago" },
];

export default function AdminPage() {
  return (
    <AuthGate roles={["admin"]} loadingLabel="Checking admin status...">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Admin command center</h1>
              <p className="text-small text-default-500">Monitor privileged operations across the platform.</p>
            </div>
            <Chip color="warning" variant="flat">
              Sandbox mode
            </Chip>
          </CardHeader>
          <CardBody className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Open approvals", value: 6 },
              { label: "Flagged wallets", value: 2 },
              { label: "Pending payouts", value: 4 },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-default-200/40 p-4">
                <p className="text-sm text-default-500">{item.label}</p>
                <p className="text-2xl font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">Audit trail</h2>
          </CardHeader>
          <CardBody>
            <Table removeWrapper aria-label="Recent administrative actions">
              <TableHeader>
                <TableColumn>Action</TableColumn>
                <TableColumn>Actor</TableColumn>
                <TableColumn>Target</TableColumn>
                <TableColumn>Time</TableColumn>
              </TableHeader>
              <TableBody>
                {auditLog.map((entry) => (
                  <TableRow key={`${entry.action}-${entry.time}`}>
                    <TableCell>{entry.action}</TableCell>
                    <TableCell>{entry.actor}</TableCell>
                    <TableCell>{entry.target}</TableCell>
                    <TableCell>{entry.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </AuthGate>
  );
}
