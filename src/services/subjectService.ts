import apiClient from "@/src/lib/axios";
import type {
    ApiResponse,
    Assessment,
    DependentSubject,
    Material,
    PaginatedData,
    PrerequisiteRequirement,
    Session,
    Subject,
    Syllabus,
} from "@/src/types";

/**
 * Tra cứu môn học
 * GET /api/subjects
 */
export async function searchSubjects(params: {
    search?: string;
    searchBy?: "code" | "name";
    status?: string;
    page?: number;
    size?: number;
}): Promise<PaginatedData<Subject>> {
    const response = await apiClient.get("/subjects", {
        params: {
            search: params.search || "",
            searchBy: params.searchBy || "code",
            status: params.status,
            page: params.page ?? 0,
            size: params.size ?? 20,
        },
    });
    const data: ApiResponse<PaginatedData<Subject>> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch subjects");
}

/**
 * Chi tiết Môn học
 * GET /api/subjects/{id}
 */
export async function getSubjectById(id: string): Promise<Subject> {
    const response = await apiClient.get(`/subjects/${id}`);
    const data: ApiResponse<Subject> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch subject detail");
}

/**
 * Lấy danh sách môn tiên quyết
 * GET /api/prerequisites/code/{code}/requirements
 */
export async function getPrerequisites(
    code: string,
): Promise<PrerequisiteRequirement[]> {
    const response = await apiClient.get(
        `/prerequisites/code/${code}/requirements`,
    );
    const data: ApiResponse<PrerequisiteRequirement[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch prerequisites");
}

/**
 * Lấy danh sách môn học sau (dependents)
 * GET /api/prerequisites/dependents/code/{code}/dependents
 */
export async function getDependents(
    code: string,
): Promise<DependentSubject[]> {
    const response = await apiClient.get(
        `/prerequisites/dependents/code/${code}/dependents`,
    );
    const data: ApiResponse<DependentSubject[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch dependents");
}

/**
 * Chi tiết Syllabus
 * GET /api/syllabus/{id}
 */
export async function getSyllabusById(id: string): Promise<Syllabus> {
    const response = await apiClient.get(`/syllabus/${id}`);
    const data: ApiResponse<Syllabus> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch syllabus");
}

/**
 * Danh sách buổi học của Syllabus
 * GET /api/sessions/syllabus/{id}
 */
export async function getSessionsBySyllabus(
    syllabusId: string,
): Promise<Session[]> {
    const response = await apiClient.get(`/sessions/syllabus/${syllabusId}`);
    const data: ApiResponse<Session[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch sessions");
}

/**
 * Danh sách bài đánh giá của Syllabus
 * GET /api/assessments/syllabus/{id}
 */
export async function getAssessmentsBySyllabus(
    syllabusId: string,
): Promise<Assessment[]> {
    const response = await apiClient.get(
        `/assessments/syllabus/${syllabusId}`,
    );
    const data: ApiResponse<Assessment[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch assessments");
}

/**
 * Tài liệu học tập của Syllabus
 * GET /api/materials/syllabus/{id}
 */
export async function getMaterialsBySyllabus(
    syllabusId: string,
): Promise<Material[]> {
    const response = await apiClient.get(
        `/materials/syllabus/${syllabusId}`,
        {
            params: { status: "PUBLISHED" },
        },
    );
    const data: ApiResponse<Material[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch materials");
}
