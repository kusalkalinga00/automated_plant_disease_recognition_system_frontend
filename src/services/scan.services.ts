import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/common.types";
import { CreateScanResponsePayload } from "@/types/scan.types";

export async function createScan(
  file: File,
  accessToken: string
): Promise<ApiResponse<CreateScanResponsePayload | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/scans`;
    const form = new FormData();
    form.append("image", file);

    const response = await axios.post(endpoint, form, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Do NOT set Content-Type manually for FormData in browsers
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
