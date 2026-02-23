import React from "react";
import {
    View,
    Text,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function AccountScreen() {
    const { language } = useSettingsStore();
    const { user, logout } = useAuthStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#3B82F6" : "#2563EB",
        primaryBg: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.08)",
        danger: "#EF4444",
        dangerBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.06)",
    };

    const menuItems = [
        {
            icon: "person-outline" as const,
            label: language === 'vi' ? "Thông tin cá nhân" : "Personal Info",
            subtitle: language === 'vi' ? "Chỉnh sửa hồ sơ" : "Edit profile",
            color: colors.primary,
            bg: colors.primaryBg,
            route: "/profile",
        },
        {
            icon: "notifications-outline" as const,
            label: language === 'vi' ? "Thông báo" : "Notifications",
            subtitle: language === 'vi' ? "Quản lý thông báo" : "Manage notifications",
            color: "#F59E0B",
            bg: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
            route: "/notifications",
        },
        {
            icon: "color-palette-outline" as const,
            label: language === 'vi' ? "Giao diện" : "Theme",
            subtitle: language === 'vi' ? "Chế độ sáng / tối" : "Light / dark mode",
            color: "#A855F7",
            bg: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.08)",
            route: "/settings",
        },
    ];

    const handleLogout = () => {
        logout();
        // Redirection handled by _layout.tsx
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View
                    style={{
                        paddingHorizontal: 24,
                        paddingTop: 8,
                        paddingBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: "700",
                            color: colors.textPrimary,
                            letterSpacing: -0.5,
                        }}
                    >
                        {language === 'vi' ? "Tài khoản" : "Account"}
                    </Text>
                </View>

                {/* Profile Card */}
                <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 18,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                            flexDirection: "row",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0 : 0.05,
                            shadowRadius: 12,
                            elevation: isDark ? 0 : 3,
                        }}
                    >
                        <View
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                backgroundColor: colors.primaryBg,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name="person" size={28} color={colors.primary} />
                        </View>
                        <View style={{ marginLeft: 16, flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: "600",
                                    color: colors.textPrimary,
                                }}
                            >
                                {user?.fullName || (language === 'vi' ? "Người dùng" : "User")}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: colors.textSecondary,
                                    marginTop: 2,
                                }}
                            >
                                {user?.email || "user@university.edu"}
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={colors.textSecondary}
                        />
                    </View>
                </View>

                {/* Menu Items */}
                <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 18,
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                            overflow: "hidden",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0 : 0.05,
                            shadowRadius: 12,
                            elevation: isDark ? 0 : 3,
                        }}
                    >
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    if (item.route) {
                                        router.push(item.route as any);
                                    }
                                }}
                                activeOpacity={0.7}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 16,
                                    paddingHorizontal: 18,
                                    borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                                    borderBottomColor: colors.cardBorder,
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        backgroundColor: item.bg,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons name={item.icon} size={20} color={item.color} />
                                </View>
                                <View style={{ marginLeft: 14, flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: "500",
                                            color: colors.textPrimary,
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: colors.textSecondary,
                                            marginTop: 1,
                                        }}
                                    >
                                        {item.subtitle}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <View style={{ paddingHorizontal: 24 }}>
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: colors.dangerBg,
                            borderRadius: 14,
                            paddingVertical: 15,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                        }}
                    >
                        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                        <Text
                            style={{
                                color: colors.danger,
                                fontSize: 15,
                                fontWeight: "600",
                            }}
                        >
                            Đăng xuất
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
