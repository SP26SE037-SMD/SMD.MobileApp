import apiClient from "@/src/lib/axios";
import type {
  ApiResponse,
  Syllabus,
  Session,
  Assessment,
  Material,
  PaginatedData,
  SyllabusCompareData,
  MaterialBlock,
  CloSessionMapping,
  SessionMaterialBlockDetail,
} from "@/src/types";

/**
 * Lấy chi tiết Syllabus
 * GET /api/syllabuses/{id}
 */
export async function getSyllabusById(id: string): Promise<Syllabus> {
  const response = await apiClient.get(`/syllabuses/${id}`);
  const data: ApiResponse<Syllabus> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch syllabus");
}

/**
 * Danh sách buổi học của Syllabus
 * GET /api/sessions/syllabus/{syllabusId}
 */
export async function getSessionsBySyllabus(
  syllabusId: string,
): Promise<Session[]> {
  const response = await apiClient.get(`/sessions/syllabus/${syllabusId}`);
  const data: ApiResponse<Session[]> = response.data;
  if ((data.status === 1000 || data.status === 0) && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch sessions");
}

/**
 * Danh sách bài đánh giá của Syllabus
 * GET /api/assessments/syllabus/{syllabusId}
 */
export async function getAssessmentsBySyllabus(
  syllabusId: string,
): Promise<Assessment[]> {
  const response = await apiClient.get(`/assessments/syllabus/${syllabusId}`);
  const data: ApiResponse<Assessment[]> = response.data;
  if ((data.status === 1000 || data.status === 0) && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch assessments");
}

/**
 * Tài liệu học tập của Syllabus
 * GET /api/materials/syllabus/{syllabusId}
 */
export async function getMaterialsBySyllabus(
  syllabusId: string,
): Promise<Material[]> {
  const response = await apiClient.get(`/materials/syllabus/${syllabusId}`, {
    params: { status: "PUBLISHED" },
  });
  const data: ApiResponse<Material[]> = response.data;
  if ((data.status === 1000 || data.status === 0) && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch materials");
}

/**
 * Lấy danh sách Syllabus bản cũ của 1 môn học để so sánh
 * GET /api/syllabuses/subject/{subjectId}
 */
export async function getSyllabusesBySubject(
  subjectId: string,
): Promise<Syllabus[]> {
  const response = await apiClient.get(`/syllabuses/subject/${subjectId}`);
  const data: ApiResponse<Syllabus[]> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch syllabuses by subject");
}

/**
 * So sánh 2 đề cương
 * POST /api/syllabuses/compare
 */
export async function compareSyllabuses(
  sourceSyllabusId: string,
  targetSyllabusId: string,
): Promise<SyllabusCompareData> {
  const response = await apiClient.post("/syllabuses/compare", {
    sourceSyllabusId,
    targetSyllabusId,
  });
  const data: ApiResponse<SyllabusCompareData> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to compare syllabuses");
}

/**
 * Đọc nội dung blocks của 1 material
 * GET /api/materials/{materialId}/blocks
 */
export async function getMaterialBlocks(
  materialId: string,
  page: number = 1,
  size: number = 50,
): Promise<PaginatedData<MaterialBlock>> {
  const response = await apiClient.get(`/materials/${materialId}/blocks`, {
    params: { page, size },
  });
  const data: ApiResponse<PaginatedData<MaterialBlock>> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch material blocks");
}

/**
 * Lấy danh sách ánh xạ CLO - Session của 1 buổi học
 * GET /api/syllabuses/sessions/{sessionId}/clo-session-mappings
 */
export async function getCloSessionMappings(
  sessionId: string,
): Promise<CloSessionMapping[]> {
  const response = await apiClient.get(
    `/syllabuses/sessions/${sessionId}/clo-session-mappings`,
  );
  const data: ApiResponse<CloSessionMapping[]> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch CLO-Session mappings");
}

/**
 * Lấy chi tiết Material Blocks của 1 buổi học
 * GET /api/syllabuses/sessions/{sessionId}/material-block-details
 */
export async function getSessionMaterialBlockDetails(
  sessionId: string,
): Promise<SessionMaterialBlockDetail> {
  const response = await apiClient.get(
    `/syllabuses/sessions/${sessionId}/material-block-details`,
  );
  const data: ApiResponse<SessionMaterialBlockDetail> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(
    data.message || "Failed to fetch Session Material Block Detail",
  );
}

/**
 * Đề cương đã xuất bản của một môn học (Published Syllabus by Subject)
 * GET /api/syllabus/subject/{subjectId}?status=PUBLISHED
 */
export async function getPublishedSyllabusBySubject(
  subjectId: string,
): Promise<Syllabus[]> {
  const response = await apiClient.get(
    `/syllabus/subject/${subjectId}?status=PUBLISHED`,
  );
  const data: ApiResponse<Syllabus[]> = response.data;
  if (data.status === 1000 && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch published syllabus");
}
