import { MOCK_CURRICULUMS } from "@/src/constants/mockData";
import { useWishlistStore } from "@/src/store/useWishlistStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "general" | "plos" | "subjects";

export default function CurriculumDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeTab, setActiveTab] = useState<TabKey>("general");

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
    electiveBg: isDark ? "rgba(168, 85, 247, 0.15)" : "rgba(147, 51, 234, 0.08)",
    electiveText: isDark ? "#C084FC" : "#7C3AED",
    electiveBorder: isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.2)",
    tabInactive: isDark ? "#334155" : "#E2E8F0",
  };

  const curriculum = MOCK_CURRICULUMS.find((c) => c.id === id);

  const bookmarkedSubjects = useWishlistStore((state) => state.bookmarkedSubjects);
  const toggleBookmark = useWishlistStore((state) => state.toggleBookmark);

  // Group subjects by semester
  const groupedSubjects = React.useMemo(() => {
    if (!curriculum?.subjects) return {};
    return curriculum.subjects.reduce(
      (acc, subject) => {
        const sem = subject.semester;
        if (!acc[sem]) acc[sem] = [];
        acc[sem].push(subject);
        return acc;
      },
      {} as Record<number, typeof curriculum.subjects>
    );
  }, [curriculum]);

  const tabs = [
    {
      key: "general",
      label: "General",
      icon: "information-circle-outline" as const,
    },
    {
      key: "plos",
      label: "PLOs",
      icon: "list-circle-outline" as const,
    },
    {
      key: "subjects",
      label: "Subjects",
      icon: "book-outline" as const,
    },
  ];

  if (!curriculum) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={64}
          color={colors.textSecondary}
          style={{ marginBottom: 16 }}
        />
        <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "600" }}>
          {"Curriculum not found"}
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
            {"Go Back"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Tab: General Info
  const renderGeneralTab = () => (
    <View>
      {/* Hero Card */}
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
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryBg }]}>
            <MaterialCommunityIcons name="book-education-outline" size={32} color={colors.primary} />
          </View>
          <View style={styles.heroTitleContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{curriculum.name}</Text>
            <Text style={[styles.subtitle, { color: colors.primary }]}>{curriculum.englishName}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoItem, { borderRightWidth: 1, borderRightColor: colors.divider }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {"Code"}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{curriculum.code}</Text>
          </View>
          <View style={[styles.infoItem, { borderRightWidth: 1, borderRightColor: colors.divider }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {"Credits"}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{curriculum.credits}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              {"Decision No"}
            </Text>
            <Text style={[styles.infoValue, { color: colors.textPrimary }]} numberOfLines={1}>
              {curriculum.decisionNo || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      {curriculum.description && (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall },
          ]}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 }}>
            {"Program Description"}
          </Text>
          <Text style={{ color: colors.textPrimary, lineHeight: 22, fontSize: 15 }}>
            {curriculum.description}
          </Text>
        </View>
      )}

      {/* Department Info */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall },
        ]}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 }}>
          {"Additional Information"}
        </Text>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {"Department:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{curriculum.department}</Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {"Total Subjects:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {curriculum.subjects?.length || 0}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {"Semesters:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {Object.keys(groupedSubjects).length}
          </Text>
        </View>
      </View>

      {/* View Map Button */}
      <TouchableOpacity
        style={[styles.mapButton, { backgroundColor: colors.primary, ...styles.shadow }]}
        onPress={() =>
          router.push({
            pathname: "/curriculum/prerequisite-map" as any,
            params: { curriculumId: curriculum.id },
          })
        }
        activeOpacity={0.8}
      >
        <Ionicons name="git-network-outline" size={22} color="white" style={{ marginRight: 10 }} />
        <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
          {"View Curriculum Map"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Tab: PLOs
  const renderPLOsTab = () => (
    <View>
      {curriculum.plos && curriculum.plos.length > 0 ? (
        curriculum.plos.map((plo, idx) => (
          <View
            key={idx}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                ...styles.shadowSmall,
              },
            ]}
          >
            <View style={[styles.ploBadge, { backgroundColor: colors.primaryBg }]}>
              <Text style={{ fontWeight: "700", color: colors.primary, fontSize: 13 }}>{plo.name}</Text>
            </View>
            <Text style={{ color: colors.textPrimary, lineHeight: 22, fontSize: 15 }}>
              {plo.description}
            </Text>
          </View>
        ))
      ) : (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Ionicons name="list-circle-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 12 }} />
          <Text style={{ color: colors.textSecondary, fontStyle: "italic", textAlign: "center" }}>
            {"No PLOs available."}
          </Text>
        </View>
      )}
    </View>
  );

  // Tab: Subjects
  const renderSubjectsTab = () => (
    <View>
      {Object.keys(groupedSubjects).length > 0 ? (
        Object.entries(groupedSubjects)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([semester, subjects]) => (
            <View key={`sem-${semester}`} style={{ marginBottom: 24 }}>
              <View style={[styles.semesterHeader, { backgroundColor: colors.divider }]}>
                <Text style={{ fontWeight: "700", color: colors.textPrimary, fontSize: 15 }}>
                  {Number(semester) === 0
                                                ? "Semester 0 (Prerequisite)"
                                                : `Semester ${semester}`}
                </Text>
              </View>

              {subjects.map((sub, idx) => {
                const isElective = sub.isElective === true;
                const electiveGroup = isElective
                  ? curriculum.electiveGroups?.find((eg) => eg.id === sub.electiveGroupId)
                  : null;

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (isElective && sub.electiveGroupId) {
                        router.push({
                          pathname: "/curriculum/elective/[id]",
                          params: { id: sub.electiveGroupId, curriculumId: curriculum.id },
                        } as any);
                      } else {
                        router.push({ pathname: "/subject/[code]", params: { code: sub.code } } as any);
                      }
                    }}
                    style={[
                      styles.subjectCard,
                      {
                        backgroundColor: isElective ? colors.electiveBg : colors.card,
                        borderColor: isElective ? colors.electiveBorder : colors.cardBorder,
                        ...styles.shadowSmall,
                      },
                    ]}
                  >
                    <View style={styles.subjectHeader}>
                      <View
                        style={[
                          styles.subjectCodeBadge,
                          { backgroundColor: isElective ? colors.electiveBorder : colors.background },
                        ]}
                      >
                        {isElective ? (
                          <MaterialCommunityIcons name="book-multiple-outline" size={16} color={colors.electiveText} />
                        ) : (
                          <Text style={{ fontWeight: "700", color: colors.textPrimary, fontSize: 14 }}>
                            {sub.code}
                          </Text>
                        )}
                      </View>
                      {!isElective && (
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
                            name={bookmarkedSubjects.includes(sub.code) ? "star" : "star-outline"}
                            size={22}
                            color={bookmarkedSubjects.includes(sub.code) ? "#F59E0B" : colors.textSecondary}
                          />
                        </TouchableOpacity>
                      )}
                      {isElective && (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ color: colors.electiveText, fontSize: 12, fontWeight: "600", marginRight: 4 }}>
                            {electiveGroup?.subjects.length || 0} {"subjects"}
                          </Text>
                          <Ionicons name="chevron-forward" size={16} color={colors.electiveText} />
                        </View>
                      )}
                    </View>

                    <Text
                      style={{
                        fontWeight: "600",
                        color: isElective ? colors.electiveText : colors.textPrimary,
                        fontSize: 16,
                        marginBottom: 8,
                        lineHeight: 22,
                      }}
                    >
                      {sub.name}
                    </Text>

                    <View style={styles.subjectFooter}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={isElective ? colors.electiveText : colors.textSecondary}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={{
                            color: isElective ? colors.electiveText : colors.textSecondary,
                            fontSize: 13,
                          }}
                        >
                          {sub.credits} {"credits"}
                        </Text>
                      </View>
                    </View>

                    {!isElective && sub.prerequisite ? (
                      <View style={[styles.prereqContainer, { backgroundColor: colors.alertBg }]}>
                        <Ionicons name="alert-circle-outline" size={16} color={colors.alertText} style={{ marginRight: 6 }} />
                        <Text style={{ color: colors.alertText, fontSize: 13, fontWeight: "500", flex: 1 }}>
                          {"Prerequisite:"} {sub.prerequisite}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
      ) : (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Ionicons name="book-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 12 }} />
          <Text style={{ color: colors.textSecondary, fontStyle: "italic", textAlign: "center" }}>
            {"No subjects available."}
          </Text>
        </View>
      )}

      {/* View Map Button */}
      {Object.keys(groupedSubjects).length > 0 && (
        <TouchableOpacity
          style={[styles.mapButton, { backgroundColor: colors.primary, ...styles.shadow }]}
          onPress={() =>
            router.push({
              pathname: "/curriculum/prerequisite-map" as any,
              params: { curriculumId: curriculum.id },
            })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="git-network-outline" size={22} color="white" style={{ marginRight: 10 }} />
          <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
            {"View Curriculum Map"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralTab();
      case "plos":
        return renderPLOsTab();
      case "subjects":
        return renderSubjectsTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
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
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textPrimary }} numberOfLines={1}>
            {curriculum.code}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary }} numberOfLines={1}>
            {curriculum.englishName}
          </Text>
        </View>
        <View style={{ backgroundColor: colors.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>
            {curriculum.credits} {"Credits"}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as TabKey)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: 3,
                borderBottomColor: activeTab === tab.key ? colors.primary : "transparent",
              }}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={activeTab === tab.key ? colors.primary : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontWeight: activeTab === tab.key ? "700" : "500",
                  color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                  fontSize: 14,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {renderActiveTab()}
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
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  heroTitleContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoGrid: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    paddingVertical: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  gridLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: "500",
  },
  gridValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  ploBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  semesterHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  subjectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectCodeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  prereqContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 16,
    marginBottom: 40,
  },
});
