import apiClient from "@/src/lib/axios";

export interface RealtimePayload {
  code: string;
  message: string;
  timestamp: string;
  data: any;
  meta?: any;
}

export interface AppNotification {
  notificationId: string;
  code?: string;
  title?: string;
  message?: string;
  isRead: boolean;
  createdAt?: string;
}

export const notificationService = {
  // Lấy danh sách thông báo
  getMyNotifications: async (page = 0, size = 20) => {
    const response = await apiClient.get("/notifications/my-notifications", {
      params: { page, size }
    });
    return response.data;
  },

  // Đếm số lượng chưa đọc
  getUnreadCount: async () => {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  },

  // Đánh dấu 1 thông báo là đã đọc
  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/mark-as-read`);
    return response.data;
  },

  // Đánh dấu tất cả là đã đọc
  markAllAsRead: async () => {
    const response = await apiClient.post("/notifications/mark-all-as-read");
    return response.data;
  }
};
