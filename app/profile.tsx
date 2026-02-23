import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettingsStore } from "@/src/store/useSettingsStore";

export default function ProfileScreen() {
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
        inputBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    };

    const [formData, setFormData] = useState({
        name: "Người dùng",
        email: "user@university.edu",
        phone: "0123456789",
        studentId: "12345678",
        major: "Kỹ thuật Máy tính",
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
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
                        {language === 'vi' ? "Thông tin cá nhân" : "Personal Info"}
                    </Text>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "600",
                                color: colors.primary,
                            }}
                        >
                            {language === 'vi' ? "Lưu" : "Save"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Section */}
                    <View style={{ alignItems: "center", marginTop: 20, marginBottom: 30 }}>
                        <View
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                backgroundColor: colors.primaryBg,
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 16,
                                borderWidth: 4,
                                borderColor: colors.card,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: isDark ? 0.3 : 0.1,
                                shadowRadius: 10,
                                elevation: 5,
                            }}
                        >
                            <Ionicons name="person" size={50} color={colors.primary} />
                            <TouchableOpacity
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: colors.primary,
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderWidth: 3,
                                    borderColor: colors.background,
                                }}
                            >
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: "700",
                                color: colors.textPrimary,
                            }}
                        >
                            {formData.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                                marginTop: 4,
                            }}
                        >
                            {language === 'vi' ? `MSSV: ${formData.studentId}` : `Student ID: ${formData.studentId}`}
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <View style={{ paddingHorizontal: 24, gap: 16 }}>
                        {/* Full Name */}
                        <View>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: colors.textSecondary,
                                    marginBottom: 8,
                                    marginLeft: 4,
                                }}
                            >
                                {language === 'vi' ? "Họ và tên" : "Full Name"}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: colors.cardBorder,
                                }}
                            >
                                <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textPrimary,
                                    }}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: colors.textSecondary,
                                    marginBottom: 8,
                                    marginLeft: 4,
                                }}
                            >
                                Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: colors.cardBorder,
                                }}
                            >
                                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textSecondary, // Secondary to indicate it's semi-readonly or tied to auth
                                    }}
                                    value={formData.email}
                                    editable={false}
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: colors.textSecondary,
                                    marginBottom: 8,
                                    marginLeft: 4,
                                }}
                            >
                                {language === 'vi' ? "Số điện thoại" : "Phone Number"}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: colors.cardBorder,
                                }}
                            >
                                <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textPrimary,
                                    }}
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    keyboardType="phone-pad"
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        {/* Major */}
                        <View>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: colors.textSecondary,
                                    marginBottom: 8,
                                    marginLeft: 4,
                                }}
                            >
                                {language === 'vi' ? "Khoa/Ngành" : "Major/Department"}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: colors.cardBorder,
                                }}
                            >
                                <Ionicons name="school-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textSecondary, // Treat as readonly
                                    }}
                                    value={formData.major}
                                    editable={false}
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
