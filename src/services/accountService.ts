import apiClient from "@/src/lib/axios";
import type { ApiResponse, MeResponse } from "@/src/types";

/**
 * Lấy thông tin cá nhân
 * GET /api/auth/me?jwt=<token>
 */
export async function getMe(token: string): Promise<MeResponse> {
    const response = await apiClient.get("/auth/me", {
        params: { jwt: token },
    });
    const data: ApiResponse<MeResponse> = response.data;
    if (data.status === 1000 && data.data) {
        return data.data;
    }
    throw new Error(data.message || "Failed to fetch user info");
}

/**
 * Cập nhật thông tin Profile
 * PUT /api/accounts
 */
export async function updateProfile(payload: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
}): Promise<void> {
    const response = await apiClient.put("/accounts", payload);
    const data: ApiResponse<any> = response.data;
    if (data.status !== 1000) {
        throw new Error(data.message || "Failed to update profile");
    }
}
