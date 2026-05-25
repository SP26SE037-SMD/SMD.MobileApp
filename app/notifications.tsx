import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    useColorScheme,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { AppNotification } from "@/src/services/notificationService";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function NotificationsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    
    // Auth info to keep connection context
    const { user, token, isAuthenticated } = useAuthStore();
    
    const {
       notifications,
       unreadCount,
       isLoading,
       page,
       totalPages,
       isConnected,
       fetchNotifications,
       markAsRead,
       markAllAsRead,
       connect,
       fetchUnreadCount
    } = useNotificationStore();

    useEffect(() => {
        // Init fetch
        if (isAuthenticated && user?.id && token) {
            connect(user.id, token);
            fetchNotifications(0);
            fetchUnreadCount();
        }
    }, [isAuthenticated, user]);

    const handleLoadMore = () => {
        if (!isLoading && page < totalPages - 1) {
            fetchNotifications(page + 1, true);
        }
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    const handlePressNotification = (item: AppNotification) => {
        if (!item.isRead) {
            markAsRead(item.notificationId);
        }
        // Có thể bổ sung router push tuỳ theo type (code) của notification.
    };

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        divider: isDark ? "#334155" : "#E2E8F0",
        unreadBg: isDark ? "rgba(16,185,129,0.05)" : "rgba(5,150,105,0.03)",
        iconBg: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
    };

    const getIconInfo = (code: string) => {
        switch (code) {
            case "BROADCAST_SYSTEM":
            case "BROADCAST_DEPARTMENT":
                return { name: "notifications", color: "#F59E0B", Icon: Ionicons };
            case "EVENT_TASK":
                return { name: "assignment", color: colors.primary, Icon: MaterialIcons };
            default:
                return { name: "information-circle", color: "#3B82F6", Icon: Ionicons };
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Vừa xong";
        try {
            const date = new Date(dateString);
            return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    const renderItem = ({ item }: { item: AppNotification }) => {
        const { name, color, Icon } = getIconInfo(item.code || "");
        
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handlePressNotification(item)}
                style={{
                    flexDirection: "row",
                    padding: 16,
                    backgroundColor: item.isRead ? colors.card : colors.unreadBg,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                }}
            >
                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: colors.iconBg,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 16,
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                    }}
                >
                    <Icon name={name as any} size={24} color={color} />
                    {!item.isRead && (
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: colors.primary,
                                borderWidth: 2,
                                borderColor: item.isRead ? colors.card : colors.unreadBg,
                            }}
                        />
                    )}
                </View>

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: item.isRead ? "500" : "700",
                            color: colors.textPrimary,
                            marginBottom: 4,
                        }}
                    >
                        {item.title || "Thông báo hệ thống"}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.textSecondary,
                            lineHeight: 20,
                            marginBottom: 8,
                        }}
                    >
                        {item.message}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                        <Text
                            style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                                marginLeft: 4,
                            }}
                        >
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    backgroundColor: colors.card,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 8 }}>
                        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: colors.textPrimary }}>
                        {"Notifications"}
                    </Text>
                    {unreadCount > 0 && (
                        <View
                            style={{
                                backgroundColor: colors.primary,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 12,
                                marginLeft: 8,
                            }}
                        >
                            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllAsRead} style={{ padding: 4 }}>
                        <Ionicons name="checkmark-done" size={24} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={{ flex: 1 }}>
                {isLoading && page === 0 ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={{ marginTop: 12, color: colors.textSecondary }}>Hệ thống đang tải...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.notificationId}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={() => (
                            <View style={{ paddingTop: 100, alignItems: "center", paddingHorizontal: 40 }}>
                                <View
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        backgroundColor: colors.iconBg,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 16,
                                        borderWidth: 1,
                                        borderColor: colors.cardBorder,
                                    }}
                                >
                                    <Ionicons name="notifications-off-outline" size={32} color={colors.textSecondary} />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary, marginBottom: 8 }}>
                                    {"No notifications yet"}
                                </Text>
                                <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", lineHeight: 20 }}>
                                    {"We'll notify you when there's something new."}
                                    {isConnected ? "" : "\nĐang mất kết nối Websocket."}
                                </Text>
                            </View>
                        )}
                        ListFooterComponent={
                            isLoading && page > 0 ? (
                                <View style={{ paddingVertical: 20, alignItems: "center" }}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            ) : <View style={{ height: 40 }} />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
