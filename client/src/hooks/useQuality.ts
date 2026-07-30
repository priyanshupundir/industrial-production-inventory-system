import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { qualityAPI } from '../api/services';

export const QUALITY_KEY = 'quality';
export const QUALITY_STATS_KEY = 'quality-stats';

export function useInspections() {
  return useQuery({
    queryKey: [QUALITY_KEY],
    queryFn: () => qualityAPI.getInspections(),
  });
}

export function useInspectionStats() {
  return useQuery({
    queryKey: [QUALITY_STATS_KEY],
    queryFn: () => qualityAPI.getStats(),
  });
}

export function useCreateInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: qualityAPI.createInspection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUALITY_KEY] });
      qc.invalidateQueries({ queryKey: [QUALITY_STATS_KEY] });
    },
  });
}
