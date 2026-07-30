import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersAPI } from '../api/services';

export const SUPPLIERS_KEY = 'suppliers';
export const PURCHASE_ORDERS_KEY = 'purchase-orders';

export function useSuppliers() {
  return useQuery({
    queryKey: [SUPPLIERS_KEY],
    queryFn: () => suppliersAPI.getSuppliers(),
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suppliersAPI.createSupplier,
    onSuccess: () => qc.invalidateQueries({ queryKey: [SUPPLIERS_KEY] }),
  });
}

export function usePurchaseOrders() {
  return useQuery({
    queryKey: [PURCHASE_ORDERS_KEY],
    queryFn: () => suppliersAPI.getPurchaseOrders(),
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suppliersAPI.createPurchaseOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: [PURCHASE_ORDERS_KEY] }),
  });
}

export function useUpdatePurchaseOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => suppliersAPI.updatePurchaseOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: [PURCHASE_ORDERS_KEY] }),
  });
}
