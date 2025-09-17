"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useScanDetails } from "@/hooks/use-scan-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ScanHistoryInnerPageProps {
  scanId: string;
}

const ScanHistoryInnerPage: React.FC<ScanHistoryInnerPageProps> = ({
  scanId,
}) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const query = useScanDetails({ accessToken, scanId });

  const data = query.data?.payload;
  const scan = data?.scan;
  const disease = data?.disease;
  const treatments = data?.treatments || [];

  return (
    <div className="space-y-6 mx-auto max-w-5xl px-4 py-6 lg:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Scan Details</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/protected/scan-history">Back to history</Link>
        </Button>
      </div>

      {query.isLoading && (
        <p className="text-sm text-muted-foreground">Loading scan details...</p>
      )}
      {query.isError && (
        <p className="text-sm text-destructive">Error loading scan details.</p>
      )}
      {!query.isLoading && !query.isError && !scan && (
        <p className="text-sm text-muted-foreground">Scan not found.</p>
      )}

      {scan && (
        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-5">
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={scan.image_url}
                alt={scan.predicted_label}
                className="w-full max-h-96 object-contain rounded-md border"
              />
              <div className="mt-4 space-y-1 text-sm">
                <p>
                  <span className="font-medium">Predicted:</span>{" "}
                  {scan.predicted_label}
                </p>
                <p>
                  <span className="font-medium">Confidence:</span>{" "}
                  {(scan.confidence * 100).toFixed(2)}%
                </p>
                <p>
                  <span className="font-medium">Model:</span>{" "}
                  {scan.model_version}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(scan.created_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-7">
            <CardHeader>
              <CardTitle>Disease & Treatments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {disease && (
                <div>
                  <h2 className="font-medium mb-1">{disease.display_name}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {disease.description}
                  </p>
                </div>
              )}

              {scan.top_k && scan.top_k.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Top Predictions</h3>
                  <ul className="space-y-1 text-sm">
                    {scan.top_k.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between"
                      >
                        <span>{item.label}</span>
                        <span className="tabular-nums">
                          {(item.confidence * 100).toFixed(2)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {treatments.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Treatments</h3>
                  <ul className="space-y-3">
                    {treatments.map((t) => (
                      <li key={t.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{t.title}</span>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            {t.type}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed mb-1 whitespace-pre-line">
                          {t.instructions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dosage: {t.dosage}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScanHistoryInnerPage;
