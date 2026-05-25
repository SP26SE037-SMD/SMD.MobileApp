import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { theme, setTheme } = useSettingsStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const colors = {
    background: isDark ? "#0F172A" : "#F1F5F9",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    textPrimary: isDark ? "#F1F5F9" : "#1E293B",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#10B981" : "#059669",
    divider: isDark ? "#334155" : "#E2E8F0",
  };

  type SettingItem = {
    icon: any;
    label: string;
    value?: string;
    onPress?: () => void;
  };

  const getThemeLabel = () => {
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "System (Light/Dark)";
  };

  const settingSections: { title: string; items: SettingItem[] }[] = [
    {
      title: "General",
      items: [
        {
          icon: "color-palette-outline" as const,
          label: "Theme",
          value: getThemeLabel(),
          onPress: () => setThemeModalVisible(true),
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
            {"Settings"}
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
                      borderBottomWidth:
                        iIdx < section.items.length - 1 ? 1 : 0,
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
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

      {/* Theme Modal */}
      <Modal
        visible={themeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: 16,
              }}
            >
              {"Select Theme"}
            </Text>

            {(["light", "dark", "system"] as const).map((t, idx) => (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setTheme(t);
                  setThemeModalVisible(false);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 16,
                  borderBottomWidth: idx < 2 ? 1 : 0,
                  borderBottomColor: colors.cardBorder,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: colors.textPrimary,
                    fontWeight: theme === t ? "600" : "400",
                  }}
                >
                  {t === "light"
                    ? "☀️ Light"
                    : t === "dark"
                      ? "🌙 Dark"
                      : "⚙️ System Auto"}
                </Text>
                {theme === t && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
