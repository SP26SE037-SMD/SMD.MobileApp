import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    useColorScheme,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function SignUpScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const { register } = useAuthStore();

    const handleSignUp = async () => {
        if (!fullName || !email || !password || password !== confirmPassword) return; // Simple validation
        setIsLoading(true);
        try {
            await register(fullName, email);
            // Redirection is handled by the layout guard
        } catch (error) {
            console.error("Signup failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // TODO: Implement Google sign up
    };

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        inputBg: isDark ? "#0F172A" : "#F8FAFC",
        inputBorder: isDark ? "#334155" : "#E2E8F0",
        inputBorderFocused: isDark ? "#10B981" : "#059669",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        textMuted: isDark ? "#64748B" : "#94A3B8",
        primary: isDark ? "#10B981" : "#059669",
        iconColor: isDark ? "#64748B" : "#94A3B8",
        divider: isDark ? "#334155" : "#E2E8F0",
        googleBg: isDark ? "#1E293B" : "#FFFFFF",
        googleBorder: isDark ? "#334155" : "#E2E8F0",
        googleText: isDark ? "#E2E8F0" : "#374151",
        labelColor: isDark ? "#CBD5E1" : "#1E293B",
    };

    const renderInput = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        placeholder: string,
        iconName: keyof typeof MaterialIcons.glyphMap,
        fieldKey: string,
        options?: {
            isPassword?: boolean;
            showPassword?: boolean;
            togglePassword?: () => void;
            keyboardType?: "email-address" | "default";
        }
    ) => (
        <View style={{ marginBottom: 16 }}>
            <Text
                style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: colors.labelColor,
                    marginBottom: 8,
                    marginLeft: 2,
                }}
            >
                {label}
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.inputBg,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor:
                        focusedField === fieldKey
                            ? colors.inputBorderFocused
                            : colors.inputBorder,
                    paddingHorizontal: 14,
                }}
            >
                <MaterialIcons
                    name={iconName}
                    size={20}
                    color={focusedField === fieldKey ? colors.primary : colors.iconColor}
                />
                <TextInput
                    style={{
                        flex: 1,
                        paddingVertical: 14,
                        paddingHorizontal: 10,
                        fontSize: 15,
                        color: colors.textPrimary,
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={options?.isPassword && !options?.showPassword}
                    keyboardType={options?.keyboardType || "default"}
                    autoCapitalize={
                        options?.keyboardType === "email-address" || options?.isPassword
                            ? "none"
                            : "words"
                    }
                    autoCorrect={false}
                    onFocus={() => setFocusedField(fieldKey)}
                    onBlur={() => setFocusedField(null)}
                />
                {options?.isPassword && options?.togglePassword && (
                    <TouchableOpacity
                        onPress={options.togglePassword}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={options.showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={colors.iconColor}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        paddingHorizontal: 24,
                        paddingBottom: 24,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={{ alignItems: "center", marginBottom: 28 }}>
                        <View
                            style={{
                                backgroundColor: isDark
                                    ? "rgba(16,185,129,0.15)"
                                    : "rgba(5,150,105,0.1)",
                                padding: 14,
                                borderRadius: 16,
                                marginBottom: 16,
                            }}
                        >
                            <MaterialIcons name="school" size={36} color={colors.primary} />
                        </View>
                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: "700",
                                color: colors.textPrimary,
                                letterSpacing: -0.5,
                                marginBottom: 6,
                            }}
                        >
                            Syllabus Planner
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                color: colors.textSecondary,
                                fontWeight: "400",
                            }}
                        >
                            {language === 'vi' ? 'Tạo tài khoản học tập của bạn' : 'Create your academic account'}
                        </Text>
                    </View>

                    {/* Card */}
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 20,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: isDark ? 0 : 0.06,
                            shadowRadius: 24,
                            elevation: isDark ? 0 : 8,
                        }}
                    >
                        {renderInput(
                            language === 'vi' ? "Họ và tên" : "Full Name",
                            fullName,
                            setFullName,
                            language === 'vi' ? "Nhập họ và tên" : "Enter your full name",
                            "person-outline",
                            "fullName"
                        )}

                        {renderInput(
                            "Email",
                            email,
                            setEmail,
                            "name@university.edu",
                            "mail-outline",
                            "email",
                            { keyboardType: "email-address" }
                        )}

                        {renderInput(
                            language === 'vi' ? "Mật khẩu" : "Password",
                            password,
                            setPassword,
                            language === 'vi' ? "Tạo mật khẩu" : "Create a password",
                            "lock-outline",
                            "password",
                            {
                                isPassword: true,
                                showPassword,
                                togglePassword: () => setShowPassword(!showPassword),
                            }
                        )}

                        {renderInput(
                            language === 'vi' ? "Xác nhận mật khẩu" : "Confirm Password",
                            confirmPassword,
                            setConfirmPassword,
                            language === 'vi' ? "Xác nhận lại mật khẩu" : "Confirm your password",
                            "lock-outline",
                            "confirmPassword",
                            {
                                isPassword: true,
                                showPassword: showConfirmPassword,
                                togglePassword: () =>
                                    setShowConfirmPassword(!showConfirmPassword),
                            }
                        )}

                        {/* Create Account Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={isLoading}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: colors.primary,
                                borderRadius: 14,
                                paddingVertical: 15,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 8,
                                shadowColor: colors.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.25,
                                shadowRadius: 12,
                                elevation: 6,
                            }}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: 16,
                                        fontWeight: "600",
                                    }}
                                >
                                    {language === 'vi' ? 'Tạo tài khoản' : 'Create Account'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 24,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: colors.divider,
                                }}
                            />
                            <Text
                                style={{
                                    paddingHorizontal: 12,
                                    fontSize: 12,
                                    fontWeight: "500",
                                    color: colors.textMuted,
                                    textTransform: "uppercase",
                                }}
                            >
                                {language === 'vi' ? 'Hoặc tiếp tục với' : 'Or continue with'}
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: colors.divider,
                                }}
                            />
                        </View>

                        {/* Google Button */}
                        <TouchableOpacity
                            onPress={handleGoogleSignUp}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: colors.googleBg,
                                borderRadius: 12,
                                paddingVertical: 13,
                                borderWidth: 1,
                                borderColor: colors.googleBorder,
                                gap: 10,
                            }}
                        >
                            <Ionicons name="logo-google" size={20} color="#4285F4" />
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "500",
                                    color: colors.googleText,
                                }}
                            >
                                {language === 'vi' ? 'Tiếp tục với Google' : 'Continue with Google'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Text */}
                    <View
                        style={{
                            marginTop: 28,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                            {language === 'vi' ? 'Đã có tài khoản? ' : 'Already have an account? '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: colors.primary,
                                }}
                            >
                                {language === 'vi' ? 'Đăng nhập' : 'Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
