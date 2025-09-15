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

export const UploadCard: React.FC = () => {
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
        toast.success("Uploaded successfully");
        // Invalidate any future queries for scans/history (if added later)
        queryClient.invalidateQueries({ queryKey: ["scans"] });
      } else {
        toast.error(data.message ?? "Upload failed");
      }
    },
    onError: (err) => {
      setIsScanDataLoading(false);
      toast.error("Upload failed", {
        description: err?.message ?? "Please try again",
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
        <CardTitle className="text-base">Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="button"
          aria-label="Upload image"
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
          <div className="text-sm">
            <span className="font-medium">Drop an image here</span> or click to
            browse
          </div>
          <p className="text-xs text-muted-foreground">
            JPEG/PNG/WebP · Max 8 MB · Good lighting recommended
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            title="Upload selected image"
            disabled={
              !selectedFile || !isAuthed || uploadImageMutation.isPending
            }
            onClick={() => uploadImageMutation.mutate()}
          >
            {uploadImageMutation.isPending ? "Uploading..." : "Upload & Scan"}
          </Button>
        </div>
        {!isAuthed && (
          <p className="text-right text-xs text-muted-foreground">
            Sign in to enable uploading
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadCard;
