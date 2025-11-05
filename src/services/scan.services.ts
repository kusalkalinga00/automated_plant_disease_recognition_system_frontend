import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/common.types";
import {
  CreateScanResponsePayload,
  ModelHealthPayload,
  ScanRecord,
} from "@/types/scan.types";

export async function createScan(
  file: File,
  accessToken: string
): Promise<ApiResponse<CreateScanResponsePayload | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/scans`;
    const form = new FormData();
    form.append("file", file);

    const response = await axios.post(endpoint, form, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "multipart/form-data",
      },
    });

    return response.data as ApiResponse<CreateScanResponsePayload>;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || {
      message: "Something went wrong",
      success: false,
      payload: null,
    };
    return errorPayload as ApiResponse<null>;
  }
}

export async function getModelHealth(): Promise<
  ApiResponse<ModelHealthPayload | null>
> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/health`;
    const response = await axios.get(endpoint, {
      headers: { Accept: "application/json" },
    });
    return response.data as ApiResponse<ModelHealthPayload>;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || {
      message: "Something went wrong",
      success: false,
      payload: null,
    };
    return errorPayload as ApiResponse<null>;
  }
}

export async function getScans(
  accessToken: string,
  page: number = 1,
  pageSize: number = 5
): Promise<ApiResponse<ScanRecord[] | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/scans`;
    const response = await axios.get(endpoint, {
      params: { page, page_size: pageSize },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as ApiResponse<ScanRecord[]>;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || {
      message: "Something went wrong",
      success: false,
      payload: null,
    };
    return errorPayload as ApiResponse<null>;
  }
}

export async function getScanById(
  accessToken: string,
  scanId: string
): Promise<
  ApiResponse<{
    scan: ScanRecord;
    disease: import("@/types/scan.types").DiseaseInfo;
    treatments: import("@/types/scan.types").TreatmentItem[];
  } | null>
> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/scans/${scanId}`;
    const response = await axios.get(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as ApiResponse<{
      scan: ScanRecord;
      disease: import("@/types/scan.types").DiseaseInfo;
      treatments: import("@/types/scan.types").TreatmentItem[];
    }>;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || {
      message: "Something went wrong",
      success: false,
      payload: null,
    };
    return errorPayload as ApiResponse<null>;
  }
}


