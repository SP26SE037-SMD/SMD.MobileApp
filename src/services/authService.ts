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
  const redirectUri =
    "https://auth.expo.io/@taquyminh2k4/syllabus-management-app";
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
export async function fetchGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfo> {
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
  const BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.syllabus.io.vn/api";
  const url = `${BASE_URL}/auth/login-google`;

  console.log("[Auth] Calling login-google...");
  console.log("[Auth] URL:", url);
  console.log("[Auth] Token preview:", idToken?.substring(0, 30) + "...");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const responseText = await response.text();
    console.log("[Auth] Response status:", response.status);
    // console.log("[Auth] Raw response:", responseText); // optional logging

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: `Non-JSON response (Status ${response.status})` };
      console.error(
        "[Auth] Non-JSON response:",
        responseText.substring(0, 200),
      );
    }

    console.log("[Auth] Response data parsed:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      const error: any = new Error(data?.message || `HTTP ${response.status}`);
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("[Auth] loginWithBackendGoogle FAILED:");
    console.error("[Auth] Error:", error?.message);
    throw error;
  }
}

export { AuthSession, discovery };
