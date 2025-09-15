"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useScanStore from "@/store/scan.store";

export const DetailsPanel: React.FC = () => {
  const scanData = useScanStore((state) => state.scanData);

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Details</CardTitle>
        {/* Locale selector (visual only) */}
        <select
          aria-label="Locale"
          className="rounded-md border bg-background px-2 py-1 text-sm shadow-sm"
          defaultValue="en"
        >
          <option value="en">en</option>
          <option value="si">si</option>
          <option value="ta">ta</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Disease info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {scanData?.disease.display_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {scanData?.disease.description}
            </p>
          </div>

          {/* Treatments */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Treatments</h4>
            <div className="space-y-3">
              {scanData?.treatments.map((t) => (
                <div key={t.title} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        t.type === "chemical"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {t.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.dosage}
                    </span>
                  </div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.instructions}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsPanel;
