import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api/services';

export const DASHBOARD_KEY = 'dashboard';

// ── Fetch dashboard metrics + chart data ─────────────────────────────────────
export function useDashboard() {
  return useQuery({
    queryKey: [DASHBOARD_KEY],
    queryFn: () => dashboardAPI.getMetrics(),
    // refresh every 60 s to keep KPIs live
    staleTime: 60_000,
  });
}
