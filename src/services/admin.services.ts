import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/common.types";
import { IDiseaseInfo } from "@/types/admin.types";

export async function getDiseases(
  accessToken: string,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<IDiseaseInfo[] | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/diseases`;
    const response = await axios.get(endpoint, {
      params: { page, page_size: pageSize },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<IDiseaseInfo[]>;
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

export async function deleteDisease(
  accessToken: string,
  diseaseId: number
): Promise<ApiResponse<null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/diseases/${diseaseId}`;
    const response = await axios.delete(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<null>;
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
