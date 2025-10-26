"use client";
import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useScanDetails } from "@/hooks/use-scan-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// Lightweight badge & progress components (could be replaced with existing design system components if present)
const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "muted";
}) => {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
  const styles: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border text-foreground",
    muted: "bg-muted text-muted-foreground",
  };
  return <span className={`${base} ${styles[variant]}`}>{children}</span>;
};

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
    <div
      className="h-full bg-primary transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

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
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDescription = useMemo(() => {
    if (!disease?.description) return "";
    if (showFullDescription) return disease.description;
    const maxChars = 320;
    return disease.description.length > maxChars
      ? disease.description.slice(0, maxChars) + "…"
      : disease.description;
  }, [disease?.description, showFullDescription]);

  return (
    <div className="space-y-6 mx-auto max-w-5xl px-4 py-6 lg:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Scan Details</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/scan-history">Back to history</Link>
        </Button>
      </div>

      {query.isLoading && (
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Skeleton className="w-full aspect-square" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="md:col-span-7 space-y-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      )}
      {query.isError && !query.isLoading && (
        <div className="text-sm text-destructive flex items-center gap-2">
          <span>Error loading scan details.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            Retry
          </Button>
        </div>
      )}
      {!query.isLoading && !query.isError && !scan && (
        <p className="text-sm text-muted-foreground">Scan not found.</p>
      )}

      {scan && (
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="relative group rounded-xl border overflow-hidden bg-background">
              <Image
                src={scan.image_url}
                alt={scan.predicted_label}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                width={600}
                height={600}
              />
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                <Badge>{scan.predicted_label}</Badge>
                <Badge variant="muted">
                  {(scan.confidence * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="space-y-1 p-3 rounded-lg border bg-muted/30">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Model
                </p>
                <p className="font-medium truncate" title={scan.model_version}>
                  {scan.model_version}
                </p>
              </div>
              <div className="space-y-1 p-3 rounded-lg border bg-muted/30">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Created
                </p>
                <p className="font-medium">
                  {new Date(scan.created_at).toLocaleDateString()}
                  <br />
                  <span className="text-[10px] font-normal text-muted-foreground">
                    {new Date(scan.created_at).toLocaleTimeString()}
                  </span>
                </p>
              </div>
              {scan.top_k && scan.top_k.length > 0 && (
                <div className="col-span-2 space-y-2 p-3 rounded-lg border bg-muted/30">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Top Predictions
                  </p>
                  <div className="space-y-2">
                    {scan.top_k.slice(0, 5).map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{item.label}</span>
                          <span className="tabular-nums">
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <ProgressBar value={item.confidence * 100} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            {disease && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-semibold leading-tight">
                      {disease.display_name}
                    </CardTitle>
                    <Badge variant="outline">Disease</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {truncatedDescription}
                  </p>
                  {disease.description && disease.description.length > 320 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 mt-1"
                      onClick={() => setShowFullDescription((s) => !s)}
                    >
                      {showFullDescription ? "Show less" : "Show more"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {treatments.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold leading-tight">
                    Recommended Treatments
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  {treatments.map((t) => (
                    <div
                      key={t.id}
                      className="group relative rounded-lg border p-3 bg-background hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm leading-snug flex-1">
                          {t.title}
                        </p>
                        <Badge variant="muted">{t.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2 line-clamp-4 group-hover:line-clamp-none transition-all">
                        {t.instructions}
                      </p>
                      <p className="text-[11px] font-medium text-primary/80">
                        Dosage: {t.dosage}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanHistoryInnerPage;
