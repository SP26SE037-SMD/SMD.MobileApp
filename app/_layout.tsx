import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/src/lib/queryClient";
import { useAuthStore } from "@/src/store/useAuthStore";

if (__DEV__) {
  require('@/ReactotronConfig');
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand to rehydrate from AsyncStorage
    const unsubHydrate = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
    setIsHydrated(useAuthStore.persist.hasHydrated());
    return () => unsubHydrate();
  }, []);

  useEffect(() => {
    // Ensure the root layout is fully mounted and Zustand has hydrated
    if (!rootNavigationState?.key || !isHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if user is not authenticated and trying to access protected routes
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 0);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if user is authenticated and trying to access auth screens
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 0);
    }
  }, [isAuthenticated, segments, rootNavigationState?.key, router, isHydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal", headerShown: true }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
