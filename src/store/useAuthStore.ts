import { create } from "zustand";

export interface User {
    id: string;
    email: string;
    fullName: string;
    studentId?: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (email: string) => Promise<void>;
    loginWithGoogle: (googleUser: {
        id: string;
        email: string;
        name: string;
        picture?: string;
    }) => void;
    register: (fullName: string, email: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
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

    loginWithGoogle: (googleUser) => {
        const user: User = {
            id: googleUser.id,
            email: googleUser.email,
            fullName: googleUser.name,
            avatar: googleUser.picture,
        };

        set({
            user,
            isAuthenticated: true,
            isLoading: false,
        });
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
            isAuthenticated: false,
        });
    },
}));
