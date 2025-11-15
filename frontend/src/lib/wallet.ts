import { api } from "@/lib/api";
import type { WalletOverview } from "@/types";

export async function fetchWalletOverview(): Promise<WalletOverview> {
  const { data } = await api.get<WalletOverview>("/wallet/overview");
  return data;
}
