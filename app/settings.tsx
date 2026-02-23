import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    useColorScheme,
    TouchableOpacity,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettingsStore } from "../src/store/useSettingsStore";

export default function SettingsScreen() {
    const { theme, language, setTheme, setLanguage } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [langModalVisible, setLangModalVisible] = useState(false);
    const [themeModalVisible, setThemeModalVisible] = useState(false);

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#3B82F6" : "#2563EB",
        divider: isDark ? "#334155" : "#E2E8F0",
    };

    type SettingItem = {
        icon: any;
        label: string;
        value?: string;
        onPress?: () => void;
    };

    const getThemeLabel = () => {
        if (theme === 'light') return language === 'vi' ? 'Sáng' : 'Light';
        if (theme === 'dark') return language === 'vi' ? 'Tối' : 'Dark';
        return language === 'vi' ? 'Tự động (Sáng/Tối)' : 'System (Light/Dark)';
    };

    const getLangLabel = () => {
        return language === 'vi' ? 'Tiếng Việt' : 'English';
    };

    const settingSections: { title: string; items: SettingItem[] }[] = [
        {
            title: language === 'vi' ? "Chung" : "General",
            items: [
                {
                    icon: "language-outline" as const,
                    label: language === 'vi' ? "Ngôn ngữ" : "Language",
                    value: getLangLabel(),
                    onPress: () => setLangModalVisible(true)
                },
                {
                    icon: "color-palette-outline" as const,
                    label: language === 'vi' ? "Giao diện" : "Theme",
                    value: getThemeLabel(),
                    onPress: () => setThemeModalVisible(true)
                },
            ],
        },
    ];

    return (
        <>
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
                            letterSpacing: -0.3,
                        }}
                    >
                        {language === 'vi' ? "Cài đặt" : "Settings"}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {settingSections.map((section, sIdx) => (
                        <View key={sIdx} style={{ marginBottom: 24 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: colors.textSecondary,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                    paddingHorizontal: 24,
                                    marginBottom: 10,
                                }}
                            >
                                {section.title}
                            </Text>
                            <View
                                style={{
                                    marginHorizontal: 20,
                                    backgroundColor: colors.card,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: colors.cardBorder,
                                    overflow: "hidden",
                                }}
                            >
                                {section.items.map((item, iIdx) => (
                                    <TouchableOpacity
                                        key={iIdx}
                                        activeOpacity={0.7}
                                        onPress={item.onPress}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 14,
                                            paddingHorizontal: 16,
                                            borderBottomWidth: iIdx < section.items.length - 1 ? 1 : 0,
                                            borderBottomColor: colors.cardBorder,
                                        }}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={20}
                                            color={colors.primary}
                                            style={{ marginRight: 12 }}
                                        />
                                        <Text
                                            style={{
                                                flex: 1,
                                                fontSize: 15,
                                                color: colors.textPrimary,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        {item.value ? (
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        color: colors.textSecondary,
                                                        marginRight: 6,
                                                    }}
                                                >
                                                    {item.value}
                                                </Text>
                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={16}
                                                    color={colors.textSecondary}
                                                />
                                            </View>
                                        ) : (
                                            <Ionicons
                                                name="chevron-forward"
                                                size={16}
                                                color={colors.textSecondary}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>

            {/* Language Modal */}
            <Modal
                visible={langModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLangModalVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'flex-end' }}
                    activeOpacity={1}
                    onPress={() => setLangModalVisible(false)}
                >
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 24,
                            paddingBottom: 40,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 }}>
                            {language === 'vi' ? 'Chọn Ngôn ngữ' : 'Select Language'}
                        </Text>

                        {(['vi', 'en'] as const).map((lang) => (
                            <TouchableOpacity
                                key={lang}
                                onPress={() => {
                                    setLanguage(lang);
                                    setLangModalVisible(false);
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 16,
                                    borderBottomWidth: lang === 'vi' ? 1 : 0,
                                    borderBottomColor: colors.cardBorder,
                                }}
                            >
                                <Text style={{ flex: 1, fontSize: 16, color: colors.textPrimary, fontWeight: language === lang ? '600' : '400' }}>
                                    {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                                </Text>
                                {language === lang && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Theme Modal */}
            <Modal
                visible={themeModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setThemeModalVisible(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'flex-end' }}
                    activeOpacity={1}
                    onPress={() => setThemeModalVisible(false)}
                >
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 24,
                            paddingBottom: 40,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 }}>
                            {language === 'vi' ? 'Chọn Giao diện' : 'Select Theme'}
                        </Text>

                        {(['light', 'dark', 'system'] as const).map((t, idx) => (
                            <TouchableOpacity
                                key={t}
                                onPress={() => {
                                    setTheme(t);
                                    setThemeModalVisible(false);
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 16,
                                    borderBottomWidth: idx < 2 ? 1 : 0,
                                    borderBottomColor: colors.cardBorder,
                                }}
                            >
                                <Text style={{ flex: 1, fontSize: 16, color: colors.textPrimary, fontWeight: theme === t ? '600' : '400' }}>
                                    {t === 'light'
                                        ? (language === 'vi' ? '☀️ Sáng' : '☀️ Light')
                                        : t === 'dark'
                                            ? (language === 'vi' ? '🌙 Tối' : '🌙 Dark')
                                            : (language === 'vi' ? '⚙️ Tự động (Hệ thống)' : '⚙️ System Auto')}
                                </Text>
                                {theme === t && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}
