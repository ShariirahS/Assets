export interface DashboardMetric {
  label: string;
  value: number;
  unit: string | null;
}

export interface PerformancePoint {
  label: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  category: string;
  timestamp: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  performance: PerformancePoint[];
  recentActivity: ActivityItem[];
}
