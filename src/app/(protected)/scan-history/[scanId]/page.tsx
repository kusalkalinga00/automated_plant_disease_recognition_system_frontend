import ScanHistoryInnerPage from "@/view/scan-history-inner-page/ScanHistoryInnerPage";

export default async function ScanInnerPage({
  params,
}: {
  params: Promise<{ scanId: string }>;
}) {
  const { scanId } = await params;

  return <ScanHistoryInnerPage scanId={scanId} />;
}
