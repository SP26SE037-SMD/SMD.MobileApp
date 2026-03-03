import { useAuthStore } from "@/src/store/useAuthStore";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://43.207.156.116/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - Thêm token vào mỗi request
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi chung
apiClient.interceptors.response.use(
    (response) => {
        console.log("[Axios] API Response Success:", response.config.url);
        return response;
    },
    (error) => {
        console.log("================ Axios Error ================");
        console.log("[Axios] URL:", error.config?.url);
        console.log("[Axios] Error Message:", error.message);
        if (error.response) {
            console.log("[Axios] Response DATA:", JSON.stringify(error.response.data, null, 2));
            console.log("[Axios] Response STATUS:", error.response.status);
        }
        console.log("=============================================");

        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
