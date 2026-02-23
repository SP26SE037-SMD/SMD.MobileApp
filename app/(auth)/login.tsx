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
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { useAuthStore } from "@/src/store/useAuthStore";

export default function LoginScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const { login } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) return; // Simple validation
        setIsLoading(true);
        try {
            await login(email);
            // Redirection is handled by the layout guard
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Implement Google login
    };

    // Colors
    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        cardShadow: isDark ? "transparent" : "rgba(148,163,184,0.15)",
        inputBg: isDark ? "#0F172A" : "#F8FAFC",
        inputBorder: isDark ? "#334155" : "#E2E8F0",
        inputBorderFocused: isDark ? "#3B82F6" : "#2563EB",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        textMuted: isDark ? "#64748B" : "#94A3B8",
        primary: isDark ? "#3B82F6" : "#2563EB",
        iconColor: isDark ? "#64748B" : "#94A3B8",
        divider: isDark ? "#334155" : "#E2E8F0",
        googleBg: isDark ? "#1E293B" : "#FFFFFF",
        googleBorder: isDark ? "#334155" : "#E2E8F0",
        googleText: isDark ? "#E2E8F0" : "#374151",
    };

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
                    <View style={{ alignItems: "center", marginBottom: 32 }}>
                        <View
                            style={{
                                backgroundColor: isDark
                                    ? "rgba(59,130,246,0.15)"
                                    : "rgba(37,99,235,0.1)",
                                padding: 14,
                                borderRadius: 16,
                                marginBottom: 16,
                            }}
                        >
                            <MaterialIcons
                                name="school"
                                size={36}
                                color={colors.primary}
                            />
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
                            {language === 'vi' ? 'Lên kế hoạch học tập thông minh hơn' : 'Plan your academic journey smarter'}
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
                        {/* Email Input */}
                        <View style={{ marginBottom: 18 }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: isDark ? "#CBD5E1" : colors.textPrimary,
                                    marginBottom: 8,
                                    marginLeft: 2,
                                }}
                            >
                                Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 12,
                                    borderWidth: 1.5,
                                    borderColor: emailFocused
                                        ? colors.inputBorderFocused
                                        : colors.inputBorder,
                                    paddingHorizontal: 14,
                                }}
                            >
                                <MaterialIcons
                                    name="mail-outline"
                                    size={20}
                                    color={emailFocused ? colors.primary : colors.iconColor}
                                />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        paddingVertical: 14,
                                        paddingHorizontal: 10,
                                        fontSize: 15,
                                        color: colors.textPrimary,
                                    }}
                                    placeholder="name@university.edu"
                                    placeholderTextColor={colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={{ marginBottom: 8 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 8,
                                    marginLeft: 2,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "600",
                                        color: isDark ? "#CBD5E1" : colors.textPrimary,
                                    }}
                                >
                                    {language === 'vi' ? 'Mật khẩu' : 'Password'}
                                </Text>
                                <TouchableOpacity activeOpacity={0.7}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: "600",
                                            color: colors.primary,
                                        }}
                                    >
                                        {language === 'vi' ? 'Quên?' : 'Forgot?'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 12,
                                    borderWidth: 1.5,
                                    borderColor: passwordFocused
                                        ? colors.inputBorderFocused
                                        : colors.inputBorder,
                                    paddingHorizontal: 14,
                                }}
                            >
                                <MaterialIcons
                                    name="lock-outline"
                                    size={20}
                                    color={passwordFocused ? colors.primary : colors.iconColor}
                                />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        paddingVertical: 14,
                                        paddingHorizontal: 10,
                                        fontSize: 15,
                                        color: colors.textPrimary,
                                    }}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={colors.iconColor}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: colors.primary,
                                borderRadius: 14,
                                paddingVertical: 15,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 16,
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
                                    {language === 'vi' ? 'Đăng nhập' : 'Login'}
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
                            onPress={handleGoogleLogin}
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
                            <GoogleIcon />
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
                            marginTop: 32,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                            }}
                        >
                            {language === 'vi' ? 'Chưa có tài khoản? ' : "Don't have an account? "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/signup")}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: colors.primary,
                                }}
                            >
                                {language === 'vi' ? 'Đăng ký' : 'Sign up'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Google icon SVG component
function GoogleIcon() {
    return (
        <View style={{ width: 20, height: 20 }}>
            <Ionicons name="logo-google" size={20} color="#4285F4" />
        </View>
    );
}
