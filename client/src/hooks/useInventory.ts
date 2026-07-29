import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryAPI } from '../api/services';

export const INVENTORY_KEY = 'inventory';

// ── Fetch all inventory items ────────────────────────────────────────────────
export function useInventory(category?: string, search?: string) {
  return useQuery({
    queryKey: [INVENTORY_KEY, category, search],
    queryFn: () => inventoryAPI.getItems(category, search),
  });
}

// ── Add a new inventory item ─────────────────────────────────────────────────
export function useAddInventoryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryAPI.addItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: [INVENTORY_KEY] }),
  });
}

// ── Adjust stock (IN / OUT) ──────────────────────────────────────────────────
export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      type,
      quantity,
      notes,
    }: {
      id: string;
      type: 'STOCK_IN' | 'STOCK_OUT';
      quantity: number;
      notes?: string;
    }) => inventoryAPI.updateStock(id, type, quantity, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: [INVENTORY_KEY] }),
  });
}
