import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productionAPI } from '../api/services';

export const PRODUCTION_KEY = 'production';

// ── Fetch all production orders ──────────────────────────────────────────────
export function useProductionOrders() {
  return useQuery({
    queryKey: [PRODUCTION_KEY],
    queryFn: () => productionAPI.getOrders(),
  });
}

// ── Create a new production order ────────────────────────────────────────────
export function useCreateProductionOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productionAPI.createOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTION_KEY] }),
  });
}

// ── Advance / update order status ────────────────────────────────────────────
export function useUpdateProductionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      completedQuantity,
    }: {
      id: string;
      status: string;
      completedQuantity?: number;
    }) => productionAPI.updateStatus(id, status, completedQuantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PRODUCTION_KEY] }),
  });
}
