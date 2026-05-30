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
  CloAssessmentMapping,
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
 * Lấy danh sách ánh xạ CLO - Session của toàn bộ Syllabus
 * GET /api/clo-session-mappings/syllabus/{syllabusId}
 */
export async function getCloSessionMappingsBySyllabus(
  syllabusId: string,
): Promise<CloSessionMapping[]> {
  const response = await apiClient.get(
    `/clo-session-mappings/syllabus/${syllabusId}`,
  );
  const data: ApiResponse<CloSessionMapping[]> = response.data;
  if ((data.status === 1000 || data.status === 0) && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch CLO-Session mappings");
}

/**
 * Lấy danh sách ánh xạ CLO - Assessment của toàn bộ Syllabus
 * GET /api/clo-assessment-mappings/syllabus/{syllabusId}
 */
export async function getCloAssessmentMappingsBySyllabus(
  syllabusId: string,
): Promise<CloAssessmentMapping[]> {
  const response = await apiClient.get(
    `/clo-assessment-mappings/syllabus/${syllabusId}`,
  );
  const data: ApiResponse<CloAssessmentMapping[]> = response.data;
  if ((data.status === 1000 || data.status === 0) && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch CLO-Assessment mappings");
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

/**
 * Lấy danh sách blocks theo Material (Phân trang)
 * GET /api/blocks/material/{materialId}
 */
export async function getMaterialBlocksByMaterialId(
  materialId: string,
  page: number = 1,
  size: number = 20,
): Promise<PaginatedData<MaterialBlock>> {
  const response = await apiClient.get(`/blocks/material/${materialId}`, {
    params: { page, size },
  });
  
  const responseData = response.data;
  if ((responseData.status === 1000 || responseData.status === 0) && responseData.data) {
    return responseData.data;
  }
  throw new Error(responseData.message || "Failed to fetch material blocks");
}

export interface SyllabusCompareStudentData {
  historyId: string;
  oldSyllabusId: string;
  newSyllabusId: string;
  assessmentDiffJson: string;
  conceptDiffJson: string;
  selectedCompare: boolean;
  createdAt: string;
}

/**
 * Get compare syllabus history for student view
 * GET /api/syllabus/{newSyllabusId}/get-syllabus-compare/student
 */
export async function getSyllabusCompareStudent(
  newSyllabusId: string,
): Promise<SyllabusCompareStudentData> {
  const response = await apiClient.get(
    `/syllabus/${newSyllabusId}/get-syllabus-compare/student`
  );
  const data: ApiResponse<SyllabusCompareStudentData> = response.data;
  // Based on the screenshot, status might be 0 for success
  if ((data.status === 1000 || data.status === 0) && data.data) {
    return data.data;
  }
  throw new Error(data.message || "Failed to fetch syllabus compare data");
}
