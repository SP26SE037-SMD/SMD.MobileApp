import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 phút
            gcTime: 1000 * 60 * 10, // 10 phút (garbage collection)
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});
