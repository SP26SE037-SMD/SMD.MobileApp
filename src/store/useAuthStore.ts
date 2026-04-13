import { create } from "zustand";

export interface User {
    id: string;
    email: string;
    fullName: string;
    studentId?: string;
    avatar?: string;
    roleId?: string;
    roleName?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string) => Promise<void>;
    loginWithGoogle: (idToken: string, userInfo: {
        id: string;
        email: string;
        name: string;
        picture?: string;
    }) => Promise<void>;
    register: (fullName: string, email: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email: string) => {
        set({ isLoading: true });

        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockUser: User = {
            id: 'mock-id-123',
            email: email,
            fullName: 'Mock User',
            studentId: '12345678',
        };

        set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    loginWithGoogle: async (idToken, userInfo) => {
        set({ isLoading: true });
        try {
            const { loginWithBackendGoogle } = await import('@/src/services/authService');
            const res = await loginWithBackendGoogle(idToken);

            console.log("================ Backend Response ================");
            console.log(JSON.stringify(res, null, 2));
            console.log("==========================================");

            if (res.status === 1000 && res.data) {
                const { token, account } = res.data;
                const accountId = account.accountId;

                // Cập nhật avatar từ Google lên backend
                if (userInfo?.picture && accountId) {
                    try {
                        const apiClient = (await import('@/src/lib/axios')).default;
                        await apiClient.put(
                            `/account-profiles/${accountId}`,
                            { avatarUrl: userInfo.picture },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        console.log("[Google Auth] Avatar updated successfully");
                    } catch (avatarError) {
                        // Không block đăng nhập nếu update avatar thất bại
                        console.warn("[Google Auth] Failed to update avatar:", avatarError);
                    }
                }

                const user: User = {
                    id: accountId,
                    email: account.email,
                    fullName: account.fullName,
                    avatar: userInfo?.picture,
                    // Backend trả role là string (vd: "STUDENT"), không phải object
                    roleName: typeof account.role === 'string' ? account.role : account.role?.roleName,
                };

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (fullName: string, email: string) => {
        set({ isLoading: true });

        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockUser: User = {
            id: 'mock-id-new-' + Date.now(),
            email: email,
            fullName: fullName,
        };

        set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
        });
    },

    logout: () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },
}));

// Đăng ký Reactotron subscribe sau khi store đã được khởi tạo
if (__DEV__) {
    useAuthStore.subscribe((state) => {
        const Reactotron = require('reactotron-react-native').default;
        Reactotron.display({
            name: 'State [authStore]',
            value: state,
            preview: 'Auth State Updated'
        });
    });
}
