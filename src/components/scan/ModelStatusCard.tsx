"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ModelStatusCard: React.FC = () => {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Model status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Model Loaded</div>
            <div className="font-medium">Yes</div>
          </div>
          <div>
            <div className="text-muted-foreground">Classes</div>
            <div className="font-medium">6</div>
          </div>
          <div>
            <div className="text-muted-foreground">Image Size</div>
            <div className="font-medium">224×224</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" disabled title="UI only">
            Upload &amp; Scan
          </Button>
          <Button size="sm" variant="outline" disabled title="UI only">
            Save to history
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelStatusCard;
