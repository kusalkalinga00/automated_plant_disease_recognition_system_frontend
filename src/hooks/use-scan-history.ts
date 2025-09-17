import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getScans } from "@/services/scan.services";
import { ApiResponse } from "@/types/common.types";
import { ScanRecord } from "@/types/scan.types";

interface UseScanHistoryOptions {
  accessToken?: string;
  page: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useScanHistory({
  accessToken,
  page,
  pageSize = 5,
  enabled = true,
}: UseScanHistoryOptions): UseQueryResult<ApiResponse<ScanRecord[] | null>> {
  return useQuery<ApiResponse<ScanRecord[] | null>>({
    queryKey: ["scans", page, pageSize, accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return {
          success: false,
          message: "Not authenticated",
          payload: null,
        } as ApiResponse<null>;
      }
      return getScans(accessToken, page, pageSize);
    },
    enabled: enabled && !!accessToken,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
