import { api } from "@/lib/api";
import type { TicketItem } from "@/types";

export async function fetchTickets(): Promise<TicketItem[]> {
  const { data } = await api.get<TicketItem[]>("/tickets");
  return data;
}
