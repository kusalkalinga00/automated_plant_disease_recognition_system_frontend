import React from "react";

interface ScanHistoryInnerPageProps {
  scanId: string;
}

const ScanHistoryInnerPage: React.FC<ScanHistoryInnerPageProps> = (props) => {
  const { scanId } = props;

  return <div>ScanHistoryInnerPage</div>;
};

export default ScanHistoryInnerPage;
