import { getMe } from "@/src/services/accountService";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileData {
    fullName: string;
    email: string;
    roleName: string;
    phoneNumber?: string;
    avatarUrl?: string;
}

export default function ProfileScreen() {

    const { user, token } = useAuthStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [isImageVisible, setIsImageVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);

    // Fetch full profile from API
    useEffect(() => {
        if (!token) return;
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const me = await getMe(token);
                setProfileData({
                    fullName: me.fullName,
                    email: me.email,
                    roleName: typeof me.role === 'string' ? me.role : me.role?.roleName || "",
                    phoneNumber: me.phoneNumber,
                    avatarUrl: me.avatarUrl,
                });
            } catch (err) {
                console.warn("[Profile] Failed to fetch profile, using local data:", err);
                // Fallback to local user data
                if (user) {
                    setProfileData({
                        fullName: user.fullName || "",
                        email: user.email || "",
                        roleName: user.roleName || "",
                        avatarUrl: user.avatar,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        primaryBg: isDark ? "rgba(16,185,129,0.12)" : "rgba(5,150,105,0.08)",
        inputBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    };

    // Helper functions
    const getRoleDisplayName = (roleName?: string) => {
        if (!roleName) return "Member";
        if (roleName === "STUDENT") return "Student";
        if (roleName === "LECTURER") return "Lecturer";
        return roleName;
    };

    // Use API data if available, otherwise fallback to store
    const displayName = profileData?.fullName || user?.fullName || "";
    const displayEmail = profileData?.email || user?.email || "";
    const displayRole = profileData?.roleName || user?.roleName || "";
    const displayAvatar = profileData?.avatarUrl || user?.avatar;
    const displayPhone = profileData?.phoneNumber || "";

    const avatarUrl = displayAvatar || "https://ui-avatars.com/api/?name=" + (displayName || "User");
    const images = [{ uri: avatarUrl }];

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.textSecondary, marginTop: 12 }}>Loading profile...</Text>
            </SafeAreaView>
        );
    }

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
                        {"Personal Info"}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Avatar Section */}
                    <View style={{ alignItems: "center", marginTop: 20, marginBottom: 30 }}>
                        <TouchableOpacity
                            onPress={() => setIsImageVisible(true)}
                            activeOpacity={0.8}
                        >
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
                                    overflow: 'hidden'
                                }}
                            >
                                {displayAvatar ? (
                                    <Image
                                        source={{ uri: displayAvatar }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Ionicons name="person" size={50} color={colors.primary} />
                                )}
                            </View>
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: "700",
                                color: colors.textPrimary,
                            }}
                        >
                            {displayName || "Chưa cập nhật"}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.textSecondary,
                                marginTop: 4,
                            }}
                        >
                            {getRoleDisplayName(displayRole)}
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
                                {"Full Name"}
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
                                    value={displayName}
                                    editable={false}
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
                                        color: colors.textSecondary,
                                    }}
                                    value={displayEmail}
                                    editable={false}
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>

                        {/* Phone Number */}
                        {displayPhone ? (
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
                                    {"Phone Number"}
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
                                        value={displayPhone}
                                        editable={false}
                                        placeholderTextColor={colors.textSecondary}
                                    />
                                </View>
                            </View>
                        ) : null}

                        {/* Role / Profession */}
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
                                {"Profession"}
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
                                <Ionicons name="briefcase-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textSecondary,
                                    }}
                                    value={getRoleDisplayName(displayRole)}
                                    editable={false}
                                    placeholderTextColor={colors.textSecondary}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <ImageViewing
                images={images}
                imageIndex={0}
                visible={isImageVisible}
                onRequestClose={() => setIsImageVisible(false)}
            />
        </SafeAreaView>
    );
}
