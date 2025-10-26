"use client";
import React from "react";
import { UploadCard } from "@/components/scan/UploadCard";
import { PreviewCard } from "@/components/scan/PreviewCard";
import { ResultTabs } from "@/components/scan/ResultTabs";
import { ModelStatusCard } from "@/components/scan/ModelStatusCard";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import useScanStore from "@/store/scan.store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const ScanView = () => {
  const scanData = useScanStore((state) => state.scanData);
  const isScanDataLoading = useScanStore((state) => state.isScanDataLoading);
  const router = useRouter();
  const t = useTranslations("scan");

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
      {/* Header strip */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          title={t("ui_only")}
          aria-label={t("history")}
          onClick={() => router.push("/scan-history")}
        >
          <History className="size-4" /> {t("history")}
        </Button>
      </div>

      {/* Layout grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column (upload + preview) */}
        <div className="lg:col-span-5 space-y-6">
          <UploadCard />
          <PreviewCard
            hasFile={scanData?.scan.image_url ? true : false}
            imageUrl={scanData?.scan.image_url || ""}
          />
        </div>

        {/* Right column (results) */}
        <div className="lg:col-span-7 space-y-6">
          <ResultTabs loading={isScanDataLoading} />
          <ModelStatusCard />
        </div>
      </div>
    </main>
  );
};

export default ScanView;
