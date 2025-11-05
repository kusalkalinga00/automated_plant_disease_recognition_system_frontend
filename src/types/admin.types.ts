export interface IDiseaseInfo {
  id: string;
  label: string;
  display_name: string;
  description: string;
}

export interface ITreatmentInfo {
  id: string;
  disease_id: string;
  type: string;
  title: string;
  instructions: string;
  dosage: string;
  locale: string;
  disease_label: string;
}
