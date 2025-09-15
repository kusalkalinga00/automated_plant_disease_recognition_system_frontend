"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type PreviewCardProps = {
  hasFile?: boolean;
  imageUrl?: string;
};

export const PreviewCard: React.FC<PreviewCardProps> = ({
  hasFile,
  imageUrl,
}) => {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasFile ? (
          <div className="grid place-items-center gap-3 rounded-xl border p-10 text-center text-muted-foreground">
            <ImageIcon className="size-8" />
            <p>No image selected</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src={imageUrl!}
                alt="Leaf preview"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            {/* <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled title="UI only">
                Replace
              </Button>
              <Button variant="destructive" size="sm" disabled title="UI only">
                Clear
              </Button>
            </div> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
