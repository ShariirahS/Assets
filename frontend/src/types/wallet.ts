export interface WalletSummary {
  balance: number;
  currency: string;
  status: string;
  settlementBuffer: number;
  upcomingPayouts: number;
}

export interface WalletTransaction {
  id: number;
  reference: string;
  ticketId: number;
  ticketAsset: string;
  type: string;
  amount: number;
  status: string;
  statusLabel: string;
  createdAt: string;
}

export interface WalletOverview {
  wallet: WalletSummary;
  transactions: WalletTransaction[];
}
