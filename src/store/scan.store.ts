import { DiseaseInfo, ScanRecord, TreatmentItem } from "@/types/scan.types";
import { create } from "zustand";

export interface ScanData {
  scan: ScanRecord;
  disease: DiseaseInfo;
  treatments: TreatmentItem[];
}

interface ScanStore {
  scanData: ScanData | null;
  setScanData: (data: ScanData) => void;
  clearScanData: () => void;
  isScanDataLoading: boolean;
  setIsScanDataLoading: (loading: boolean) => void;
  treatmentsLocale: "sh" | "ta" | "en";
  setTreatmentsLocale: (locale: "sh" | "ta" | "en") => void;
}

const useScanStore = create<ScanStore>()((set) => ({
  scanData: null,
  setScanData: (data: ScanData) => set({ scanData: data }),
  clearScanData: () => set({ scanData: null }),
  isScanDataLoading: false,
  setIsScanDataLoading: (loading: boolean) =>
    set({ isScanDataLoading: loading }),
  treatmentsLocale: "en",
  setTreatmentsLocale: (locale: "sh" | "ta" | "en") =>
    set({ treatmentsLocale: locale }),
}));

export default useScanStore;
