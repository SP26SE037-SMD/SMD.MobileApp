import apiClient from "@/src/lib/axios";
import type {
    ApiResponse,
    Curriculum,
    PaginatedData,
    PLO,
    SemesterMappingsResponse,
} from "@/src/types";

/**
 * Tìm kiếm danh sách Curriculum
 * GET /api/curriculums
 */
export async function searchCurriculums(params: {
  search?: string;
  searchBy?: "code" | "name" | "all";
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}): Promise<PaginatedData<Curriculum>> {
  const response = await apiClient.get("/curriculums", {
    params: {
      search: params.search || "",
      searchBy: params.searchBy || "all",
      status: params.status,
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: params.sort,
    },
  });
  const data: ApiResponse<PaginatedData<Curriculum>> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch curriculums");
}

/**
 * Lấy chi tiết một Curriculum
 * GET /api/curriculums/{id}
 */
export async function getCurriculumById(id: string): Promise<Curriculum> {
  const response = await apiClient.get(`/curriculums/${id}`);
  const data: ApiResponse<Curriculum> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch curriculum detail");
}

/**
 * Lấy danh sách PLO của curriculum
 * GET /api/plos/curriculum/{id}
 */
export async function getPLOsByCurriculum(
  curriculumId: string,
  page: number = 0,
  size: number = 100,
): Promise<PaginatedData<PLO>> {
  const response = await apiClient.get(`/plos/curriculum/${curriculumId}`, {
    params: { page, size },
  });
  const data: ApiResponse<PaginatedData<PLO>> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch PLOs");
}

/**
 * Lấy phân bổ môn học theo học kỳ
 * GET /api/curriculum-group-subjects/semester-mappings
 */
export async function getSemesterMappings(
  curriculumId: string,
): Promise<SemesterMappingsResponse> {
  const response = await apiClient.get(
    "/curriculum-group-subjects/semester-mappings",
    {
      params: { curriculumId },
    },
  );
  const data: ApiResponse<SemesterMappingsResponse> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch semester mappings");
}

/**
 * Lấy chi tiết group
 * GET /api/group/{id}
 */
export async function getGroupById(id: string): Promise<import("@/src/types").Group> {
  const response = await apiClient.get(`/group/${id}`);
  const data: ApiResponse<import("@/src/types").Group> = response.data;
  if (data.status === 0 || data.status === 1000) {
    // Handling status 0 as seen in the API response screenshot
    if (data.data) {
        return data.data;
    }
  }
  throw new Error(data.message || "Failed to fetch group detail");
}
