"use client";
import React from "react";
import { UploadCard } from "@/components/scan/UploadCard";
import { PreviewCard } from "@/components/scan/PreviewCard";
import { ResultTabs } from "@/components/scan/ResultTabs";
import { ModelStatusCard } from "@/components/scan/ModelStatusCard";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

const ScanView = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
      {/* Header strip */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scan a leaf</h1>
          <p className="text-sm text-muted-foreground">
            Upload a photo to analyze for plant diseases
          </p>
        </div>
        <Button
          variant="ghost"
          className="gap-2"
          title="UI only"
          disabled
          aria-label="History"
        >
          <History className="size-4" /> History
        </Button>
      </div>

      {/* Layout grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column (upload + preview) */}
        <div className="lg:col-span-5 space-y-6">
          <UploadCard hasFile={false} />
          <PreviewCard
            hasFile
            imageUrl=""
            fileName="leaf.jpg"
            fileSizeText="1.2 MB"
          />
        </div>

        {/* Right column (results) */}
        <div className="lg:col-span-7 space-y-6">
          <ResultTabs loading={false} />
          <ModelStatusCard />
        </div>
      </div>
    </main>
  );
};

export default ScanView;
