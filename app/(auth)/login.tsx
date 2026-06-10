import { IconSymbol } from "@/components/ui/icon-symbol";
import {
    discovery,
    fetchGoogleUserInfo,
    getGoogleAuthConfig,
} from "@/src/services/authService";
import { useAuthStore } from "@/src/store/useAuthStore";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login, loginWithGoogle } = useAuthStore();

  // Google Auth Request
  const googleConfig = getGoogleAuthConfig();
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    googleConfig,
    discovery,
  );

  // Lắng nghe deep link thủ công nếu dùng proxy bypass (bổ sung cho useAuthRequest)
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      if (event.url) {
        // Xóa tiền tố url để lấy params an toàn hơn
        const urlString = event.url.replace(/#/g, "?");
        const query = urlString.split("?")[1];
        if (!query) return;

        const params = new URLSearchParams(query);
        const accessToken = params.get("access_token");
        const idToken = params.get("id_token") || undefined;

        if (accessToken) {
          // Bypass Implicit Grant (đã nhận token nhưng url dạng #access_token=...)
          // Nếu đăng nhập thành công, ẩn Safari/Chrome
          if (WebBrowser.dismissAuthSession) WebBrowser.dismissAuthSession();
          handleGoogleToken(accessToken, idToken);
        } else if (params.get("error")) {
          setIsGoogleLoading(false);
          if (WebBrowser.dismissAuthSession) WebBrowser.dismissAuthSession();
          Alert.alert("Lỗi", params.get("error") || "Đăng nhập thất bại");
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  // Handle Google Auth response (fallback cho những luồng tiêu chuẩn)
  useEffect(() => {
    console.log("[Google Auth] Response:", JSON.stringify(response, null, 2));

    if (response?.type === "success") {
      const { authentication, params } = response;
      if (authentication) {
        handleGoogleToken(authentication.accessToken);
      } else if (params?.access_token) {
        // Trả về ngầm qua proxy webhook parameter
        handleGoogleToken(params.access_token);
      }
    } else if (response?.type === "error") {
      console.error("[Google Auth] Error response:", response.error);
      setIsGoogleLoading(false);
      Alert.alert("Error", "Google sign-in failed. Please try again.");
    } else if (response?.type === "dismiss") {
      setIsGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleToken = async (accessToken: string, idToken?: string) => {
    try {
      if (!idToken) {
        throw new Error("Không nhận được ID Token từ Google.");
      }

      const userInfo = await fetchGoogleUserInfo(accessToken);
      console.log(
        "[Google Auth] User Info:",
        JSON.stringify(userInfo, null, 2),
      );

      await loginWithGoogle(idToken, {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      });
      // Redirection is handled by the layout guard
    } catch (error: any) {
      const errorStatus = error?.response?.data?.status;
      let errorMessage: string;

      if (errorStatus === 2001) {
        console.warn(
          "[Google Auth] Account not found:",
          error?.response?.data?.message,
        );
        errorMessage =
          "Your account does not have access. Please contact the administrator.";
      } else {
        console.error("[Google Auth] Failed to login:", error);
        errorMessage =
          error?.response?.data?.message || error?.message || "Login failed.";
      }

      Alert.alert("Unable to Sign In", errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) return;
    setIsGoogleLoading(true);
    try {
      // Mẹo dùng Proxy cũ: Mở thông qua /start endpoint
      const authUrl = await request.makeAuthUrlAsync(discovery);

      // ÉP BUỘC Implicit Grant Flow trên Google thay vì Code Flow, và nối thêm nonce (bắt buộc với id_token)
      let forcedImplicitUrl = authUrl
        .replace("response_type=code", "response_type=id_token%20token")
        .replace("response_type=token", "response_type=id_token%20token");
      if (!forcedImplicitUrl.includes("nonce=")) {
        forcedImplicitUrl += `&nonce=${Date.now()}`;
      }

      const returnUrl = Linking.createURL("oauthredirect"); // exp://.../--/oauthredirect

      const proxyUrl =
        "https://auth.expo.io/@taquyminh2k4/syllabus-management-app";
      const startUrl = `${proxyUrl}/start?authUrl=${encodeURIComponent(forcedImplicitUrl)}&returnUrl=${encodeURIComponent(returnUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl);

      if (result.type === "success" && result.url) {
        // Đôi khi response bị kẹp qua URL hash (Implicit Grant)
        const parsedUrl = result.url.replace(/#/g, "?");
        const query = parsedUrl.split("?")[1];
        if (query) {
          const params = new URLSearchParams(query);
          const accessToken = params.get("access_token");
          const idToken = params.get("id_token") || undefined;
          if (accessToken) {
            handleGoogleToken(accessToken, idToken);
          } else {
            setIsGoogleLoading(false);
            Alert.alert(
              "Lỗi",
              "Không nhận được Access Token từ Google. Có thể Google Cloud Console của bạn chưa bật Allow Implicit Flow.",
            );
          }
        }
      } else if (result.type !== "opened") {
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google prompt failed:", error);
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert(
        "Đăng nhập thất bại",
        error.message || "Kiểm tra lại thông tin đăng nhập.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Colors
  const colors = {
    background: isDark ? "#0F172A" : "#F1F5F9",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    textPrimary: isDark ? "#F1F5F9" : "#1E293B",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#10B981" : "#059669",
    googleBg: isDark ? "#1E293B" : "#FFFFFF",
    googleBorder: isDark ? "#334155" : "#E2E8F0",
    googleText: isDark ? "#E2E8F0" : "#374151",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              backgroundColor: isDark ? "#FFFFFF" : "transparent",
              marginBottom: 16,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.2 : 0.15,
              shadowRadius: 16,
              elevation: 10,
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
            }}
          >
            <Image
              source={require("@/assets/images/logo/logo-without-name.png")}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
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
            {"Plan your academic journey smarter"}
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
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.textPrimary,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {"Sign In"}
          </Text>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              style={{
                backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                borderRadius: 12,
                padding: 14,
                color: colors.textPrimary,
                borderWidth: 1,
                borderColor: emailFocused ? colors.primary : colors.cardBorder,
                fontSize: 16,
              }}
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24, position: "relative" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={{
                backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                borderRadius: 12,
                padding: 14,
                paddingRight: 45,
                color: colors.textPrimary,
                borderWidth: 1,
                borderColor: passwordFocused
                  ? colors.primary
                  : colors.cardBorder,
                fontSize: 16,
              }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: 14,
              }}
            >
              <IconSymbol
                name={showPassword ? "eye.slash" : "eye"}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleEmailLogin}
            disabled={isLoading}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 24,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}
              >
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: colors.cardBorder }}
            />
            <View>
              <Text
                style={{
                  width: 50,
                  textAlign: "center",
                  color: colors.textSecondary,
                  fontSize: 14,
                }}
              >
                OR
              </Text>
            </View>
            <View
              style={{ flex: 1, height: 1, backgroundColor: colors.cardBorder }}
            />
          </View>

          {/* Google Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={!request || isGoogleLoading}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.googleBg,
              borderRadius: 12,
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: colors.googleBorder,
              gap: 10,
              opacity: !request ? 0.6 : 1,
            }}
          >
            {isGoogleLoading ? (
              <ActivityIndicator size="small" color={colors.googleText} />
            ) : (
              <>
                <GoogleIcon />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.googleText,
                  }}
                >
                  {"Continue with Google"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Google icon SVG component
function GoogleIcon() {
  return (
    <View style={{ width: 22, height: 22, marginRight: 8 }}>
      <Svg viewBox="0 0 48 48">
        <Path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <Path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <Path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <Path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <Path fill="none" d="M0 0h48v48H0z" />
      </Svg>
    </View>
  );
}
