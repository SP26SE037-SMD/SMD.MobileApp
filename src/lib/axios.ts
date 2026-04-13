import { useAuthStore } from "@/src/store/useAuthStore";
import axios from "axios";

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://43.207.156.116/api";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080/api";


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
        console.log("================ Axios Request ================");
        console.log("[Axios] METHOD:", config.method?.toUpperCase());
        console.log("[Axios] URL:", (config.baseURL ?? "") + (config.url ?? ""));
        if (config.params) {
            console.log("[Axios] PARAMS:", JSON.stringify(config.params, null, 2));
        }
        if (config.data) {
            console.log("[Axios] BODY:", JSON.stringify(config.data, null, 2));
        }
        console.log("===============================================");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi chung
apiClient.interceptors.response.use(
    (response) => {
        console.log("================ Axios Success ================");
        console.log("[Axios] URL:", response.config.url);
        console.log("[Axios] STATUS:", response.status);
        console.log("[Axios] DATA:", JSON.stringify(response.data, null, 2));
        console.log("===============================================");
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
