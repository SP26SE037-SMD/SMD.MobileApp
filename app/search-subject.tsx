import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettingsStore } from "@/src/store/useSettingsStore";

export default function SearchSubjectScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [searchQuery, setSearchQuery] = useState("");

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        teal: isDark ? "#2DD4BF" : "#0D9488",
        divider: isDark ? "#334155" : "#E2E8F0",
        searchBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    };

    const RECENT_SEARCHES = [
        "SE201",
        "Trí tuệ nhân tạo",
        "Hệ điều hành",
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header with Search Input */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    gap: 12,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    style={{ padding: 4 }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.searchBg,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 44,
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                    }}
                >
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            fontSize: 15,
                            color: colors.textPrimary,
                            height: "100%",
                        }}
                        placeholder={language === 'vi' ? "Tìm kiếm môn học (Mã, Tên)..." : "Search subjects (Code, Name)..."}
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")} style={{ padding: 4 }}>
                            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Recent Searches (Only show if query is empty) */}
                {searchQuery.length === 0 ? (
                    <View style={{ padding: 20 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: colors.textPrimary,
                                }}
                            >
                                {language === 'vi' ? "Tìm kiếm gần đây" : "Recent searches"}
                            </Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "600",
                                        color: colors.textSecondary,
                                    }}
                                >
                                    {language === 'vi' ? "Xóa tất cả" : "Clear all"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {RECENT_SEARCHES.map((search, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={() => setSearchQuery(search)}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 14,
                                    borderBottomWidth: index === RECENT_SEARCHES.length - 1 ? 0 : 1,
                                    borderBottomColor: colors.cardBorder,
                                }}
                            >
                                <MaterialIcons name="history" size={20} color={colors.textSecondary} />
                                <Text
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textPrimary,
                                    }}
                                >
                                    {search}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    /* Search Results Placeholder */
                    <View style={{ padding: 40, alignItems: "center" }}>
                        <MaterialIcons name="science" size={48} color={colors.cardBorder} />
                        <Text
                            style={{
                                marginTop: 16,
                                fontSize: 15,
                                color: colors.textSecondary,
                                textAlign: "center",
                            }}
                        >
                            {language === 'vi' ? `Tìm '${searchQuery}' trong Môn Học...` : `Search '${searchQuery}' in Subjects...`}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
