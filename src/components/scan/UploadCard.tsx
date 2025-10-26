"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { createScan } from "@/services/scan.services";
import { toast } from "sonner";
import useScanStore, { ScanData } from "@/store/scan.store";
import { useTranslations } from "next-intl";

export const UploadCard: React.FC = () => {
  const t = useTranslations("scan");
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const isAuthed = Boolean(session?.accessToken);
  const setScanData = useScanStore((state) => state.setScanData);
  const setIsScanDataLoading = useScanStore(
    (state) => state.setIsScanDataLoading
  );

  const uploadImageMutation = useMutation({
    mutationFn: async () => {
      setIsScanDataLoading(true);
      if (!selectedFile) throw new Error("No file selected");
      if (!session?.accessToken) throw new Error("Not authenticated");
      return await createScan(selectedFile, session.accessToken);
    },
    onSuccess: (data) => {
      setIsScanDataLoading(false);
      if (data.success) {
        setScanData(data.payload as ScanData);
        toast.success(t("upload_card.toast_success"));
        // Invalidate any future queries for scans/history (if added later)
        queryClient.invalidateQueries({ queryKey: ["scans"] });
      } else {
        toast.error(data.message ?? t("upload_card.toast_failed"));
      }
    },
    onError: (err) => {
      setIsScanDataLoading(false);
      toast.error(t("upload_card.toast_failed"), {
        description: err?.message ?? t("upload_card.retry"),
      });
    },
  });

  const onBrowse = () => inputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setSelectedFile(f);
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{t("upload_card.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="button"
          aria-label={t("upload_card.aria_label")}
          tabIndex={0}
          className="group grid place-items-center gap-3 rounded-xl border border-dashed p-10 text-center outline-none transition-colors hover:border-primary focus-visible:ring-[3px]"
          onClick={onBrowse}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Upload className="size-6" />
          </div>
          {selectedFile ? (
            <div className="text-sm">
              <span className="font-medium">
                {t("upload_card.selected_prefix")}
              </span>{" "}
              <span
                className="truncate inline-block max-w-full align-bottom"
                title={selectedFile.name}
              >
                {selectedFile.name}
              </span>
              <span className="sr-only" aria-live="polite">
                {selectedFile.name}
              </span>
            </div>
          ) : (
            <div className="text-sm">
              <span className="font-medium">
                {t("upload_card.drop_prefix")}
              </span>{" "}
              {t("upload_card.drop_suffix")}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {t("upload_card.hint")}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            title={t("upload_card.button_title")}
            disabled={
              !selectedFile || !isAuthed || uploadImageMutation.isPending
            }
            onClick={() => uploadImageMutation.mutate()}
          >
            {uploadImageMutation.isPending
              ? t("upload_card.button_uploading")
              : t("upload_card.button_label")}
          </Button>
        </div>
        {!isAuthed && (
          <p className="text-right text-xs text-muted-foreground">
            {t("upload_card.sign_in_hint")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadCard;
