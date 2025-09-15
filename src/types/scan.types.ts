export type TreatmentType = "organic" | "chemical";

export interface TopKItem {
  label: string;
  confidence: number; // 0..1
}

export interface ScanRecord {
  id: string;
  image_url: string;
  predicted_label: string;
  confidence: number; // 0..1
  top_k: TopKItem[];
  model_version: string;
  created_at: string; // ISO timestamp
}

export interface DiseaseInfo {
  label: string;
  display_name: string;
  description: string;
}

export interface TreatmentItem {
  id: string;
  type: TreatmentType;
  title: string;
  instructions: string;
  dosage: string;
  locale: string;
}

export interface CreateScanResponsePayload {
  scan: ScanRecord;
  disease: DiseaseInfo;
  treatments: TreatmentItem[];
}

export interface ModelHealthPayload {
  service: string;
  env: string;
  time_utc: string; // ISO timestamp
  model_loaded: boolean;
  num_classes: number;
  img_size: [number, number];
  model_version: string;
}
