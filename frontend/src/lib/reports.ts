import { api } from "@/lib/api";
import type { DashboardData } from "@/types";

export async function fetchDashboardData(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/reports/dashboard");
  return data;
}
