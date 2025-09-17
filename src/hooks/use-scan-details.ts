import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getScanById } from "@/services/scan.services";
import { ApiResponse } from "@/types/common.types";
import { DiseaseInfo, ScanRecord, TreatmentItem } from "@/types/scan.types";

interface UseScanDetailsOptions {
  accessToken?: string;
  scanId?: string;
  enabled?: boolean;
}

export function useScanDetails({
  accessToken,
  scanId,
  enabled = true,
}: UseScanDetailsOptions): UseQueryResult<
  ApiResponse<{
    scan: ScanRecord;
    disease: DiseaseInfo;
    treatments: TreatmentItem[];
  } | null>
> {
  return useQuery({
    queryKey: ["scan", scanId, accessToken],
    queryFn: async () => {
      if (!accessToken || !scanId) {
        return {
          success: false,
          message: "Missing auth or scan id",
          payload: null,
        } as ApiResponse<null>;
      }
      return getScanById(accessToken, scanId);
    },
    enabled: enabled && !!accessToken && !!scanId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
