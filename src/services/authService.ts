import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Ensure browser redirect is handled correctly on web
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Discovery Document
const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";

export interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
}

/**
 * Create a Google auth request hook config.
 * Use this with AuthSession.useAuthRequest() in your component.
 */
export function getGoogleAuthConfig() {
    // Dùng proxy auth.expo.io để qua mặt restriction của Google trong lúc test bằng Expo Go
    const redirectUri = "https://auth.expo.io/@taquyminh2k4/syllabus-management-app";
    return {
        clientId: GOOGLE_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
        responseType: AuthSession.ResponseType.Token,
        usePKCE: false, // Bắt buộc tắt PKCE vì Google không cho phép PKCE ở luồng Implicit
        prompt: AuthSession.Prompt.SelectAccount, // Bắt buộc Google hiện màn hình chọn account
        redirectUri,
        discovery,
    };
}

/**
 * Fetch Google user info using an access token.
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Google user info: ${response.status}`);
    }

    return response.json();
}

// Export the API call for backend login
export async function loginWithBackendGoogle(idToken: string) {
    const apiClient = (await import("@/src/lib/axios")).default;
    const response = await apiClient.post("/auth/login-google", { idToken });
    return response.data;
}

export { AuthSession, discovery };
