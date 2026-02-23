import axios from "axios";

const API_BASE_URL = "https://api.example.com"; // TODO: Thay bằng URL API thực tế

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
        // TODO: Lấy token từ store
        // const token = useAuthStore.getState().token;
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi chung
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // TODO: Xử lý logout khi token hết hạn
            // useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
