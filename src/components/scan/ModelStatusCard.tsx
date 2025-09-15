"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getModelHealth } from "@/services/scan.services";

export const ModelStatusCard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["model-health"],
    queryFn: getModelHealth,
    staleTime: 60_000,
  });

  const payload = data?.payload ?? null;
  const modelLoaded = payload?.model_loaded ?? false;
  const classes = payload?.num_classes ?? 0;
  const size = payload?.img_size ?? [224, 224];
  const version = payload?.model_version ?? "—";

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Model status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Model Loaded</div>
            <div className="font-medium">
              {isLoading ? "—" : modelLoaded ? "Yes" : "No"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Classes</div>
            <div className="font-medium">{isLoading ? "—" : classes}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Image Size</div>
            <div className="font-medium">
              {isLoading ? "—" : `${size[0]}×${size[1]}`}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {isLoading ? "" : `Version: ${version}`}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelStatusCard;
