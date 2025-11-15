import { api } from "@/lib/api";
import type { NotificationItem } from "@/types";

export async function fetchRecentNotifications(): Promise<NotificationItem[]> {
  const { data } = await api.get<NotificationItem[]>("/notifications/recent");
  return data;
}
