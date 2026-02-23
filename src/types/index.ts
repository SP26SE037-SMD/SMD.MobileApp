// Types cho ứng dụng Syllabus Management

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: "student" | "teacher" | "admin";
}

export interface Syllabus {
    id: string;
    title: string;
    description: string;
    subject: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
