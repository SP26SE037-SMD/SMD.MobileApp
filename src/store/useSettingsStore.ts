import { Appearance } from "react-native";
import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";
type Language = "vi" | "en";

interface SettingsState {
  theme: ThemeMode;
  language: Language;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: "system",
  language: "en",
  setTheme: (theme: ThemeMode) => {
    set({ theme });
    // Apply theme immediately using React Native Appearance
    if (theme === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(theme);
    }
  },
  setLanguage: (language: Language) => set({ language }),
}));
