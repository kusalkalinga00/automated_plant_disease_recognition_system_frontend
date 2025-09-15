"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UploadCardProps = {
  hasFile?: boolean;
  fileName?: string;
  fileSizeText?: string;
};

export const UploadCard: React.FC<UploadCardProps> = () => {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="button"
          aria-label="Upload image"
          tabIndex={0}
          className="group grid place-items-center gap-3 rounded-xl border border-dashed p-10 text-center outline-none transition-colors hover:border-primary focus-visible:ring-[3px]"
        >
          <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Upload className="size-6" />
          </div>
          <div className="text-sm">
            <span className="font-medium">Drop an image here</span> or click to
            browse
          </div>
          <p className="text-xs text-muted-foreground">
            JPEG/JPG · Max 4 MB · Good lighting recommended
          </p>
        </div>

        <div className="flex justify-end">
          <Button size="lg" disabled title="UI only">
            Upload &amp; Scan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadCard;
