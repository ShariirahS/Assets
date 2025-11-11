"use client";

import { Card, CardBody, CardHeader, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

const tickets = [
  { id: "TK-120", asset: "Dell XPS 15", status: "Pending", owner: "Ali Rad", updated: "5m" },
  { id: "TK-098", asset: "MacBook Pro", status: "Approved", owner: "Sara Noor", updated: "20m" },
  { id: "TK-077", asset: "Canon EOS", status: "Returned", owner: "Omid Kay", updated: "1h" },
];

const statusColor: Record<string, "warning" | "success" | "default"> = {
  Pending: "warning",
  Approved: "success",
  Returned: "default",
};

export default function TicketsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Tickets</h1>
            <p className="text-small text-default-500">Manage the full lifecycle of asset lending requests.</p>
          </div>
        </CardHeader>
        <CardBody>
          <Table removeWrapper aria-label="Tickets table">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>Asset</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Updated</TableColumn>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.asset}</TableCell>
                  <TableCell>
                    <Chip color={statusColor[ticket.status]} variant="flat">
                      {ticket.status}
                    </Chip>
                  </TableCell>
                  <TableCell>{ticket.owner}</TableCell>
                  <TableCell>{ticket.updated} ago</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
