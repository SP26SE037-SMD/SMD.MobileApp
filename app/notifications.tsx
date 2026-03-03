import React, { useState } from "react";
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

type NotificationType = "change" | "task";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "change",
        title: "Cập nhật Curriculum CNTT",
        message: "Chương trình đào tạo CNTT 2024 đã được cập nhật lịch học mới cho học kỳ 2.",
        time: "5 phút trước",
        read: false,
    },
    {
        id: "2",
        type: "task",
        title: "Đăng ký môn học sắp đến hạn",
        message: "Thời gian đăng ký môn học kỳ 2 sẽ kết thúc vào ngày 28/02.",
        time: "15 phút trước",
        read: false,
    },
    {
        id: "3",
        type: "change",
        title: "Thay đổi lịch thi",
        message: "Lịch thi môn Trí tuệ nhân tạo đã được thay đổi sang ngày 15/03.",
        time: "1 giờ trước",
        read: false,
    },
    {
        id: "4",
        type: "task",
        title: "Nhắc nhở nộp bài tập",
        message: "Bài tập môn Học máy cần được nộp trước ngày 01/03.",
        time: "2 giờ trước",
        read: true,
    },
    {
        id: "5",
        type: "change",
        title: "Phòng học thay đổi",
        message: "Môn Phát triển ứng dụng di động chuyển sang phòng A305.",
        time: "3 giờ trước",
        read: true,
    },
    {
        id: "6",
        type: "task",
        title: "Họp nhóm đồ án",
        message: "Cuộc họp nhóm đồ án lần 2 sẽ diễn ra vào thứ 5 tuần này.",
        time: "5 giờ trước",
        read: true,
    },
    {
        id: "7",
        type: "change",
        title: "Giảng viên thay thế",
        message: "Buổi học An toàn thông tin ngày 25/02 sẽ do ThS. Trần Văn Hùng dạy thay.",
        time: "1 ngày trước",
        read: true,
    },
    {
        id: "8",
        type: "task",
        title: "Khảo sát chất lượng",
        message: "Hãy hoàn thành khảo sát chất lượng giảng dạy trước ngày 05/03.",
        time: "1 ngày trước",
        read: true,
    },
    {
        id: "9",
        type: "change",
        title: "Cập nhật tín chỉ",
        message: "Môn CSDL nâng cao đã được điều chỉnh từ 3 lên 4 tín chỉ.",
        time: "2 ngày trước",
        read: true,
    },
    {
        id: "10",
        type: "task",
        title: "Đánh giá giữa kỳ",
        message: "Lịch đánh giá giữa kỳ các môn đã được công bố.",
        time: "3 ngày trước",
        read: true,
    },
];

export default function NotificationsScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [activeTab, setActiveTab] = useState<"all" | "change" | "task">("all");

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        primaryBg: isDark ? "rgba(16,185,129,0.12)" : "rgba(5,150,105,0.08)",
        changeBg: isDark ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.08)",
        changeColor: isDark ? "#FB923C" : "#EA580C",
        taskBg: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)",
        taskColor: isDark ? "#4ADE80" : "#16A34A",
        unreadBg: isDark ? "rgba(16,185,129,0.06)" : "rgba(5,150,105,0.04)",
        tabInactive: isDark ? "#334155" : "#E2E8F0",
    };

    const filteredNotifications =
        activeTab === "all"
            ? MOCK_NOTIFICATIONS
            : MOCK_NOTIFICATIONS.filter((n) => n.type === activeTab);

    const tabs = [
        { key: "all" as const, label: language === 'vi' ? "Tất cả" : "All" },
        { key: "change" as const, label: language === 'vi' ? "Thay đổi" : "Changes" },
        { key: "task" as const, label: language === 'vi' ? "Công việc" : "Tasks" },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: colors.card,
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: colors.textPrimary,
                        marginLeft: 14,
                        flex: 1,
                        letterSpacing: -0.3,
                    }}
                >
                    {language === 'vi' ? "Thông báo" : "Notifications"}
                </Text>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: "600",
                            color: colors.primary,
                        }}
                    >
                        {language === 'vi' ? "Đánh dấu đã đọc" : "Mark as read"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    marginBottom: 16,
                    gap: 8,
                }}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key)}
                        activeOpacity={0.8}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 10,
                            backgroundColor:
                                activeTab === tab.key ? colors.primary : colors.tabInactive,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color: activeTab === tab.key ? "#FFFFFF" : colors.textSecondary,
                            }}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notification List */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {filteredNotifications.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: "row",
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            backgroundColor: notification.read
                                ? "transparent"
                                : colors.unreadBg,
                        }}
                    >
                        {/* Icon */}
                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                backgroundColor:
                                    notification.type === "change"
                                        ? colors.changeBg
                                        : colors.taskBg,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 14,
                                marginTop: 2,
                            }}
                        >
                            <MaterialIcons
                                name={
                                    notification.type === "change"
                                        ? "swap-horiz"
                                        : "task-alt"
                                }
                                size={20}
                                color={
                                    notification.type === "change"
                                        ? colors.changeColor
                                        : colors.taskColor
                                }
                            />
                        </View>

                        {/* Content */}
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 4,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: notification.read ? "500" : "600",
                                        color: colors.textPrimary,
                                        flex: 1,
                                    }}
                                >
                                    {notification.title}
                                </Text>
                                {!notification.read && (
                                    <View
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: colors.primary,
                                            marginLeft: 8,
                                        }}
                                    />
                                )}
                            </View>
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontSize: 13,
                                    color: colors.textSecondary,
                                    lineHeight: 19,
                                    marginBottom: 4,
                                }}
                            >
                                {notification.message}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 11,
                                    color: colors.textSecondary,
                                }}
                            >
                                {notification.time}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
