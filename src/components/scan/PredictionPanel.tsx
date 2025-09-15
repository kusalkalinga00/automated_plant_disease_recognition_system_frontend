"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useScanStore from "@/store/scan.store";
import { confidenceWidth, formatConfidence } from "@/lib/utils";

type PredictionPanelProps = {
  loading?: boolean;
};

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className ?? "h-4"}`} />
);

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  loading,
}) => {
  const scanData = useScanStore((state) => state.scanData);
  const confidence = scanData?.scan?.confidence ?? null;
  const topK = scanData?.scan?.top_k ?? [];

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Prediction</CardTitle>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            v1.0
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-foreground/70">
            Confidence
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Predicted label */}
        <div>
          {loading ? (
            <Skeleton className="h-7 w-2/3" />
          ) : (
            <h3 className="text-xl font-semibold">
              {scanData?.disease.display_name}
            </h3>
          )}
          {/* <p className="mt-1 text-xs text-muted-foreground">
            Results are illustrative. This is a UI preview.
          </p> */}
        </div>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Confidence</span>
            <span>
              {loading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                formatConfidence(confidence ?? undefined)
              )}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full bg-emerald-500 ${
                loading ? "w-0" : ""
              }`}
              style={
                !loading
                  ? { width: confidenceWidth(confidence ?? undefined) }
                  : undefined
              }
              aria-valuenow={Math.round((confidence ?? 0) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
        </div>

        {/* Top-K chips */}
        <div>
          <p className="mb-3 text-sm font-medium">Top predictions</p>
          <div className="flex flex-wrap gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-32" />
              ))
            ) : topK.length > 0 ? (
              topK
                .slice()
                .sort((a, b) => b.confidence - a.confidence)
                .map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold">
                      {formatConfidence(item.confidence)}
                    </span>
                  </span>
                ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No predictions available
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionPanel;
