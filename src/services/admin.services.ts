import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/common.types";
import { IDiseaseInfo, ITreatmentInfo } from "@/types/admin.types";

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
  diseaseId: string
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

export async function getDiseaseById(
  accessToken: string,
  diseaseId: string
): Promise<ApiResponse<IDiseaseInfo | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/diseases/${diseaseId}`;
    const response = await axios.get(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<IDiseaseInfo>;
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

export async function updateDisease(
  accessToken: string,
  diseaseId: string,
  data: {
    display_name: string;
    description: string;
  }
): Promise<ApiResponse<IDiseaseInfo | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/diseases/${diseaseId}`;
    const response = await axios.put(endpoint, data, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<IDiseaseInfo>;
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

export async function createDisease(
  accessToken: string,
  data: {
    label: string;
    display_name: string;
    description: string;
  }
): Promise<ApiResponse<IDiseaseInfo | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/diseases`;
    const response = await axios.post(endpoint, data, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as ApiResponse<IDiseaseInfo>;
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

export async function getTreatments(
  accessToken: string,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<ITreatmentInfo[] | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/treatments`;
    const response = await axios.get(endpoint, {
      params: { page, page_size: pageSize },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<ITreatmentInfo[]>;
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

export async function deleteTreatment(
  accessToken: string,
  treatmentId: string
): Promise<ApiResponse<null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/treatments/${treatmentId}`;
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

export async function getTreatmentById(
  accessToken: string,
  treatmentId: string
): Promise<ApiResponse<ITreatmentInfo | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/treatments/${treatmentId}`;
    const response = await axios.get(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<ITreatmentInfo>;
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

export async function updateTreatment(
  accessToken: string,
  treatmentId: string,
  data: {
    title: string;
    type: string;
    dosage: string;
    locale: string;
    instructions: string;
  }
): Promise<ApiResponse<ITreatmentInfo | null>> {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/admin/treatments/${treatmentId}`;
    const response = await axios.put(endpoint, data, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as ApiResponse<ITreatmentInfo>;
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
