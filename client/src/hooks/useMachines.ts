import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machinesAPI } from '../api/services';

export const MACHINES_KEY = 'machines';
export const MAINTENANCE_KEY = 'maintenance';

export function useMachines() {
  return useQuery({
    queryKey: [MACHINES_KEY],
    queryFn: () => machinesAPI.getMachines(),
  });
}

export function useCreateMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: machinesAPI.createMachine,
    onSuccess: () => qc.invalidateQueries({ queryKey: [MACHINES_KEY] }),
  });
}

export function useUpdateMachineStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => machinesAPI.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: [MACHINES_KEY] }),
  });
}

export function useMaintenanceLogs() {
  return useQuery({
    queryKey: [MAINTENANCE_KEY],
    queryFn: () => machinesAPI.getMaintenanceLogs(),
  });
}

export function useCreateMaintenanceLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: machinesAPI.createMaintenanceLog,
    onSuccess: () => qc.invalidateQueries({ queryKey: [MAINTENANCE_KEY] }),
  });
}
