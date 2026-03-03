import { MOCK_CURRICULUMS } from "@/src/constants/mockData";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { useWishlistStore } from "@/src/store/useWishlistStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ElectiveGroupScreen() {
  const { id, curriculumId } = useLocalSearchParams<{
    id: string;
    curriculumId: string;
  }>();
  const { language } = useSettingsStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    textPrimary: isDark ? "#F1F5F9" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#10B981" : "#059669",
    primaryBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.08)",
    divider: isDark ? "#334155" : "#E2E8F0",
    alertText: isDark ? "#FCA5A5" : "#EF4444",
    alertBg: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
    successText: isDark ? "#86EFAC" : "#16A34A",
    successBg: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.05)",
    electiveBg: isDark
      ? "rgba(168, 85, 247, 0.15)"
      : "rgba(147, 51, 234, 0.08)",
    electiveText: isDark ? "#C084FC" : "#7C3AED",
  };

  // Tìm curriculum và elective group
  const curriculum = MOCK_CURRICULUMS.find((c) => c.id === curriculumId);
  const electiveGroup = curriculum?.electiveGroups?.find((eg) => eg.id === id);

  const bookmarkedSubjects = useWishlistStore(
    (state) => state.bookmarkedSubjects,
  );
  const toggleBookmark = useWishlistStore((state) => state.toggleBookmark);

  if (!electiveGroup) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="book-multiple-outline"
          size={64}
          color={colors.textSecondary}
          style={{ marginBottom: 16 }}
        />
        <Text
          style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "600" }}
        >
          {language === "vi"
            ? "Không tìm thấy nhóm môn tự chọn"
            : "Elective group not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 24,
            paddingVertical: 12,
            paddingHorizontal: 24,
            backgroundColor: colors.primary,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            {language === "vi" ? "Quay lại" : "Go Back"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
            marginRight: 12,
            marginLeft: -8,
            borderRadius: 20,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: colors.textPrimary,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {language === "vi"
            ? electiveGroup.name
            : electiveGroup.englishName || electiveGroup.name}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              ...styles.shadow,
            },
          ]}
        >
          <View style={styles.heroHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.electiveBg },
              ]}
            >
              <MaterialCommunityIcons
                name="book-multiple-outline"
                size={32}
                color={colors.electiveText}
              />
            </View>
            <View style={styles.heroTitleContainer}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {language === "vi"
                  ? electiveGroup.name
                  : electiveGroup.englishName || electiveGroup.name}
              </Text>
              <Text style={[styles.subtitle, { color: colors.electiveText }]}>
                {curriculum?.name || ""}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View
              style={[
                styles.infoItem,
                { borderRightWidth: 1, borderRightColor: colors.divider },
              ]}
            >
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Học kỳ" : "Semester"}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {electiveGroup.semester}
              </Text>
            </View>
            <View
              style={[
                styles.infoItem,
                { borderRightWidth: 1, borderRightColor: colors.divider },
              ]}
            >
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Tín chỉ" : "Credits"}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {electiveGroup.credits}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Số môn" : "Subjects"}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {electiveGroup.subjects.length}
              </Text>
            </View>
          </View>

          {electiveGroup.minSubjects && (
            <View
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: colors.divider,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.textSecondary}
                />{" "}
                {language === "vi"
                  ? `Chọn ${electiveGroup.minSubjects} trong ${electiveGroup.subjects.length} môn học sau:`
                  : `Choose ${electiveGroup.minSubjects} from ${electiveGroup.subjects.length} subjects below:`}
              </Text>
            </View>
          )}
        </View>

        {/* Subject List */}
        <View style={styles.sectionHeader}>
          <Ionicons
            name="list-circle"
            size={24}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {language === "vi" ? "Danh sách môn học" : "Available Subjects"}
          </Text>
        </View>

        <View style={styles.subjectList}>
          {electiveGroup.subjects.map((sub, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/subject/[code]",
                  params: { code: sub.code },
                } as any)
              }
              style={[
                styles.subjectCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  ...styles.shadowSmall,
                },
              ]}
            >
              <View style={styles.subjectHeader}>
                <View
                  style={[
                    styles.subjectCodeBadge,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      color: colors.textPrimary,
                      fontSize: 14,
                    }}
                  >
                    {sub.code}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleBookmark(sub.code);
                  }}
                  style={{
                    padding: 6,
                    borderRadius: 10,
                    backgroundColor: bookmarkedSubjects.includes(sub.code)
                      ? "rgba(245,158,11,0.15)"
                      : "transparent",
                  }}
                >
                  <Ionicons
                    name={
                      bookmarkedSubjects.includes(sub.code)
                        ? "star"
                        : "star-outline"
                    }
                    size={22}
                    color={
                      bookmarkedSubjects.includes(sub.code)
                        ? "#F59E0B"
                        : colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontWeight: "600",
                  color: colors.textPrimary,
                  fontSize: 16,
                  marginBottom: 4,
                  lineHeight: 22,
                }}
              >
                {sub.name}
              </Text>
              {sub.englishName && (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  {sub.englishName}
                </Text>
              )}

              <View style={styles.subjectFooter}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.textSecondary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {sub.credits} {language === "vi" ? "tín chỉ" : "credits"}
                  </Text>
                </View>
              </View>

              {sub.prerequisite ? (
                <View
                  style={[
                    styles.prereqContainer,
                    { backgroundColor: colors.alertBg },
                  ]}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color={colors.alertText}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color: colors.alertText,
                      fontSize: 13,
                      fontWeight: "500",
                      flex: 1,
                    }}
                  >
                    {language === "vi" ? "Tiên quyết:" : "Prerequisite:"}{" "}
                    {sub.prerequisite}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  shadowSmall: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  heroTitleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  infoGrid: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  subjectList: {
    gap: 12,
  },
  subjectCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectCodeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prereqContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
