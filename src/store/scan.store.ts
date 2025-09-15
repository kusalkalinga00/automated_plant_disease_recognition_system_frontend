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
}

const useScanStore = create<ScanStore>()((set) => ({
  scanData: null,
  setScanData: (data: ScanData) => set({ scanData: data }),
  clearScanData: () => set({ scanData: null }),
}));

export default useScanStore;
