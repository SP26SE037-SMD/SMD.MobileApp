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
import { useSettingsStore } from "@/src/store/useSettingsStore";

export default function WishlistScreen() {
    const { language } = useSettingsStore();
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
                        Wishlist
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            color: colors.textSecondary,
                            marginTop: 4,
                        }}
                    >
                        {language === 'vi' ? "Các môn học và curriculum yêu thích" : "Your favorite subjects and curriculum"}
                    </Text>
                </View>

                {/* Empty State */}
                <View
                    style={{
                        paddingHorizontal: 24,
                        paddingTop: 40,
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 20,
                            padding: 32,
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                            alignItems: "center",
                            width: "100%",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0 : 0.05,
                            shadowRadius: 12,
                            elevation: isDark ? 0 : 3,
                        }}
                    >
                        <View
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 20,
                                backgroundColor: colors.primaryBg,
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 20,
                            }}
                        >
                            <Ionicons name="heart-outline" size={36} color={colors.primary} />
                        </View>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: "600",
                                color: colors.textPrimary,
                                marginBottom: 8,
                            }}
                        >
                            {language === 'vi' ? "Chưa có mục yêu thích" : "No favorites yet"}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                                textAlign: "center",
                                lineHeight: 22,
                            }}
                        >
                            {language === 'vi' ? "Hãy thêm curriculum hoặc môn học\nvào wishlist để theo dõi dễ dàng hơn!" : "Add curriculum or subjects\nto your wishlist to track them easily!"}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            style={{
                                marginTop: 24,
                                backgroundColor: colors.primary,
                                borderRadius: 12,
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                shadowColor: colors.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}
                            >
                                {language === 'vi' ? "Khám phá ngay" : "Explore now"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
