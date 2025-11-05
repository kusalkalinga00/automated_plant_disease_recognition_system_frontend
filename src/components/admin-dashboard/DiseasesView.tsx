"use client";
import { getDiseases } from "@/services/admin.services";
import { IDiseaseInfo } from "@/types/admin.types";
import { ApiResponse } from "@/types/common.types";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";

const DiseasesView = () => {
  const { data: session } = useSession();

  const { data } = useQuery<ApiResponse<IDiseaseInfo[] | null>>({
    queryKey: ["diseases"],
    queryFn: () => getDiseases(session?.accessToken!, 1, 50),
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: false,
    gcTime: 30 * 60 * 1000, // 10 minutes
  });

  console.log("Diseases data:", data);

  return <div className="">DiseasesView</div>;
};

export default DiseasesView;
