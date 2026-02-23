import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/src/store/useSettingsStore';

export default function LessonViewerScreen() {
    const { id, url, title, type } = useLocalSearchParams<{ id: string, url: string, title: string, type: string }>();
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#3B82F6" : "#2563EB",
        primaryBg: isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)",
        divider: isDark ? "#334155" : "#E2E8F0",
    };

    const handleOpenExternal = async () => {
        if (url) {
            try {
                const supported = await Linking.canOpenURL(url);
                if (supported) {
                    await Linking.openURL(url);
                }
            } catch (error) {
                console.error("Failed to open URL:", error);
            }
        }
    };

    const getIconForType = () => {
        switch (type) {
            case 'video': return 'play-circle';
            case 'pdf': return 'document-text';
            case 'slide': return 'albums';
            default: return 'document';
        }
    };

    const getFormatName = () => {
        switch (type) {
            case 'video': return language === 'vi' ? 'Video Bài Giảng' : 'Video Lecture';
            case 'pdf': return language === 'vi' ? 'Tài Liệu Đọc (PDF)' : 'Reading Material (PDF)';
            case 'slide': return language === 'vi' ? 'Bài Trình Chiếu' : 'Presentation Slide';
            default: return language === 'vi' ? 'Tài Liệu' : 'Document';
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: colors.card,
                borderBottomWidth: 1,
                borderBottomColor: colors.divider
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 }} numberOfLines={1}>
                    {title || (language === 'vi' ? "Chi Tiết Bài Học" : "Lesson Details")}
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <View style={{
                    width: 100, height: 100, borderRadius: 50,
                    backgroundColor: colors.primaryBg,
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24
                }}>
                    <Ionicons name={getIconForType()} size={48} color={colors.primary} />
                </View>

                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
                    {title}
                </Text>

                <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 32, textAlign: 'center' }}>
                    {getFormatName()}
                </Text>

                <View style={{ backgroundColor: colors.card, padding: 20, borderRadius: 16, width: '100%', borderWidth: 1, borderColor: colors.divider, marginBottom: 24 }}>
                    <Text style={{ color: colors.textPrimary, fontSize: 15, lineHeight: 22, textAlign: 'center' }}>
                        {language === 'vi'
                            ? "Đây là phiên bản xem trước hoặc liên kết ngoài của tài liệu học tập. Bấm vào nút bên dưới để mở tài liệu trong trình duyệt của bạn."
                            : "This is a preview or external link for the learning material. Tap the button below to open it in your browser."}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleOpenExternal}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: colors.primary,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        borderRadius: 14,
                        width: '100%',
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5
                    }}
                >
                    <Ionicons name="open-outline" size={20} color="white" style={{ marginRight: 12 }} />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
                        {language === 'vi' ? "Mở Trình Duyệt" : "Open in Browser"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
