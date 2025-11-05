import EditDiseaseView from "@/components/admin-dashboard/EditDiseaseView";

export default async function EditDiseasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditDiseaseView diseaseId={id} />;
}
