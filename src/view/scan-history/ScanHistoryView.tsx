"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 5;

const ScanHistoryView = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [page, setPage] = useState(1);

  const query = useScanHistory({ accessToken, page, pageSize: PAGE_SIZE });

  const totalPages = query.data?.meta?.total_pages || 1;
  const scans = query.data?.payload || [];

  return (
    <div className="space-y-4 mx-auto max-w-7xl px-4 py-6 lg:py-8 ">
      <Card>
        <CardHeader>
          <CardTitle>Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading && (
            <p className="text-sm text-muted-foreground">Loading scans...</p>
          )}
          {query.isError && (
            <p className="text-sm text-destructive">
              Error loading scan history.
            </p>
          )}
          {!query.isLoading && !query.isError && scans.length === 0 && (
            <p className="text-sm text-muted-foreground">No scans found.</p>
          )}

          {scans.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Image</th>
                    <th className="py-2 pr-4">Prediction</th>
                    <th className="py-2 pr-4">Confidence</th>
                    <th className="py-2 pr-4">Model</th>
                    <th className="py-2 pr-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan.id} className="border-b last:border-none">
                      <td className="py-2 pr-4">
                        <img
                          src={scan.image_url}
                          alt={scan.predicted_label}
                          className="h-12 w-12 object-cover rounded-md border"
                        />
                      </td>
                      <td className="py-2 pr-4 font-medium">
                        {scan.predicted_label}
                      </td>
                      <td className="py-2 pr-4">
                        {(scan.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 pr-4">{scan.model_version}</td>
                      <td className="py-2 pr-4">
                        {new Date(scan.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1 || query.isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || query.isFetching}
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanHistoryView;
