import ScanHistoryInnerPage from "@/view/scan-history-inner-page/ScanHistoryInnerPage";

export default function ScanInnerPage({
  params,
}: {
  params: { scanId: string };
}) {
  const { scanId } = params;
  return <ScanHistoryInnerPage scanId={scanId} />;
}
