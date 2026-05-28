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
    Clo,
    SubjectSource,
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
 * Lấy danh sách Chuẩn đầu ra môn học (CLOs)
 * GET /api/clos/subject/{subjectId}
 */
export async function getClosBySubject(subjectId: string): Promise<Clo[]> {
    const response = await apiClient.get(`/clos/subject/${subjectId}?page=0&size=30`);
    const data: ApiResponse<PaginatedData<Clo>> = response.data;
    if (data.status === 1000 && data.data && data.data.content) {
        return data.data.content;
    }
    throw new Error(data.message || "Failed to fetch CLOs");
}

/**
 * Lấy danh sách tài liệu tham khảo môn học (Sources)
 * GET /api/sources/subject/{subjectId}
 */
export async function getSourcesBySubjectId(subjectId: string): Promise<SubjectSource[]> {
    const response = await apiClient.get(`/sources/subject/${subjectId}`);
    const data: ApiResponse<SubjectSource[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch sources");
}

/**
 * Lấy danh sách ánh xạ CLO - PLO
 * GET /api/subjects/{subjectId}/clo-plo-mappings
 */
export async function getCloPloMappings(subjectId: string): Promise<any[]> {
    const response = await apiClient.get(
        `/subjects/${subjectId}/clo-plo-mappings`,
    );
    const data: ApiResponse<any[]> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch CLO-PLO mappings");
}
