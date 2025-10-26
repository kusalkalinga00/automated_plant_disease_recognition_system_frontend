"use client";

import React from "react";
import PredictionPanel from "./PredictionPanel";
import DetailsPanel from "./DetailsPanel";
import { useTranslations } from "next-intl";

type ResultTabsProps = {
  loading?: boolean;
};

export const ResultTabs: React.FC<ResultTabsProps> = ({ loading }) => {
  const t = useTranslations("scan");
  const [tab, setTab] = React.useState<"prediction" | "details">("prediction");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border p-1">
        <button
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] ${
            tab === "prediction"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
          onClick={() => setTab("prediction")}
          aria-pressed={tab === "prediction"}
          aria-label={t("result_tabs.prediction")}
        >
          {t("result_tabs.prediction")}
        </button>
        <button
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] ${
            tab === "details"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
          onClick={() => setTab("details")}
          aria-pressed={tab === "details"}
          aria-label={t("result_tabs.details")}
        >
          {t("result_tabs.details")}
        </button>
      </div>

      {tab === "prediction" ? (
        <PredictionPanel loading={loading} />
      ) : (
        <DetailsPanel />
      )}
    </div>
  );
};

export default ResultTabs;
