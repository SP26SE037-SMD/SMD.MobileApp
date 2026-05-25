import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { user, token, isAuthenticated } = useAuthStore();
  const { unreadCount, connect, fetchUnreadCount, disconnect } = useNotificationStore();

  useEffect(() => {
     if (isAuthenticated && user?.id && token) {
        connect(user.id, token);
        fetchUnreadCount();
     } else {
        disconnect();
     }
  }, [isAuthenticated, user?.id, token]);

  const colors = {
    tabBarBg: isDark ? "#0F172A" : "#FFFFFF",
    tabBarBorder: isDark ? "#1E293B" : "#F1F5F9",
    active: isDark ? "#10B981" : "#059669",
    inactive: isDark ? "#475569" : "#94A3B8",
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 6,
          height: 88,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

    </Tabs>
  );
}
