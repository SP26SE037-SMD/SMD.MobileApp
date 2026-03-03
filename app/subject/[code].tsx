import { MOCK_SYLLABUSES } from "@/src/constants/mockData";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { useWishlistStore } from "@/src/store/useWishlistStore";
import {
    Ionicons
} from "@expo/vector-icons";
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

type TabKey =
  | "general"
  | "lessons"
  | "materials"
  | "clos"
  | "sessions"
  | "questions"
  | "assessments";

export default function SubjectDetailsScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { language } = useSettingsStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Find the syllabus by subjectCode
  // In a real app, you might have an API like getSyllabusBySubjectCode(code)
  const syllabus = MOCK_SYLLABUSES.find(
    (s) => s.subjectCode.toLowerCase() === code?.toLowerCase(),
  );

  const isBookmarked = useWishlistStore((state) =>
    syllabus ? state.isBookmarked(syllabus.subjectCode) : false,
  );
  const toggleBookmark = useWishlistStore((state) => state.toggleBookmark);

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
    tabInactive: isDark ? "#334155" : "#E2E8F0",
  };

  if (!syllabus) {
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
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: "600",
            paddingHorizontal: 20,
            textAlign: "center",
          }}
        >
          {language === "vi"
            ? `Không tìm thấy thông tin chi tiết (Syllabus) cho môn học ${code?.toUpperCase()}.`
            : `Syllabus not found for subject ${code?.toUpperCase()}.`}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 12,
            paddingHorizontal: 30,
            textAlign: "center",
          }}
        >
          *Note: Currently only PRF192, PRO192, and CSD201 are mocked with full
          syllabus details.
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

  const tabs = [
    {
      key: "general",
      label: language === "vi" ? "Chung" : "General",
      icon: "information-circle-outline" as const,
    },
    {
      key: "lessons",
      label: language === "vi" ? "Bài học" : "Lessons",
      icon: "book-outline" as const,
    },
    {
      key: "materials",
      label: language === "vi" ? "Tài liệu" : "Materials",
      icon: "library-outline" as const,
    },
    { key: "clos", label: "CLOs", icon: "list-circle-outline" as const },
    {
      key: "sessions",
      label: language === "vi" ? "Lịch trình" : "Sessions",
      icon: "calendar-outline" as const,
    },
    { key: "questions", label: "CQ", icon: "help-circle-outline" as const },
    {
      key: "assessments",
      label: language === "vi" ? "Đánh giá" : "Assessment",
      icon: "pie-chart-outline" as const,
    },
  ];

  const renderGeneralTab = () => (
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
      <View
        style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          {language === "vi" ? "Thông tin cơ bản" : "Basic Information"}
        </Text>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {language === "vi" ? "Mã Syllabus:" : "Syllabus ID:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {syllabus.id}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {language === "vi" ? "Bậc đào tạo:" : "Degree Level:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {syllabus.degreeLevel}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {language === "vi" ? "Phân bổ thời gian:" : "Time Allocation:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {syllabus.timeAllocation}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {language === "vi" ? "Điều kiện tiên quyết:" : "Pre-Requisite:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {syllabus.prerequisite}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {language === "vi" ? "Thang điểm:" : "Scoring Scale:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {syllabus.scoringScale}
          </Text>
        </View>
        <View style={styles.gridRow}>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
            {language === "vi" ? "Điểm tối thiểu:" : "Min. Mark to Pass:"}
          </Text>
          <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
            {syllabus.minAvgMarkToPass}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          {language === "vi" ? "Mô tả" : "Description"}
        </Text>
        <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
          {syllabus.description}
        </Text>
      </View>

      <View
        style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          {language === "vi" ? "Nhiệm vụ sinh viên" : "Student Tasks"}
        </Text>
        <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
          {syllabus.studentTasks}
        </Text>
      </View>

      <View
        style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          {language === "vi" ? "Công cụ" : "Tools"}
        </Text>
        <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
          {syllabus.tools}
        </Text>
      </View>

      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          {language === "vi" ? "Thông tin duyệt" : "Approval Details"}
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
          {language === "vi" ? "Số quyết định: " : "Decision No: "}
          <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
            {syllabus.decisionNo}
          </Text>
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
          {language === "vi" ? "Ngày phê duyệt: " : "Approved Date: "}
          <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
            {syllabus.approvedDate}
          </Text>
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
          {language === "vi" ? "Trạng thái:" : "Status:"}
          <Text
            style={{
              color: syllabus.isActive ? colors.successText : colors.alertText,
              fontWeight: "700",
            }}
          >
            {syllabus.isActive
              ? language === "vi"
                ? " Hoạt động"
                : " Active"
              : language === "vi"
                ? " Không hoạt động"
                : " Inactive"}
          </Text>
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          {language === "vi" ? "Ghi chú: " : "Note: "}
          <Text style={{ color: colors.textPrimary }}>{syllabus.note}</Text>
        </Text>
      </View>
    </View>
  );

  const renderMaterialsTab = () => (
    <View>
      {syllabus.materials.map((m, idx) => (
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.primary,
                flex: 1,
              }}
            >
              {m.description}
            </Text>
            {m.isMainMaterial && (
              <View
                style={{
                  backgroundColor: colors.successBg,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    color: colors.successText,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {language === "vi" ? "CHÍNH" : "MAIN"}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              color: colors.textPrimary,
              marginBottom: 4,
              fontWeight: "500",
            }}
          >
            {language === "vi" ? "Tác giả: " : "Author: "}
            {m.author}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              marginBottom: 4,
              fontSize: 13,
            }}
          >
            {language === "vi" ? "Nhà xuất bản: " : "Publisher: "}
            {m.publisher} ({m.publishedDate})
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            {language === "vi" ? "Ấn bản: " : "Edition: "}
            {m.edition} • ISBN: {m.isbn}
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {m.isHardCopy && (
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 12,
                  backgroundColor: colors.divider,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                {language === "vi" ? "Bản cứng" : "Hard Copy"}
              </Text>
            )}
            {m.isOnline && (
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 12,
                  backgroundColor: colors.divider,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                {language === "vi" ? "Trực tuyến" : "Online"}
              </Text>
            )}
          </View>
          {m.note ? (
            <Text
              style={{
                color: colors.textSecondary,
                fontStyle: "italic",
                marginTop: 8,
                fontSize: 13,
              }}
            >
              {language === "vi" ? "Ghi chú: " : "Note: "}
              {m.note}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );

  const renderCLOsTab = () => (
    <View>
      {syllabus.clos.map((clo, idx) => (
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
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.primary,
              marginBottom: 6,
            }}
          >
            {clo.name}
          </Text>
          <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
            {clo.description}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderSessionsTab = () => (
    <View>
      {syllabus.sessions.map((s, idx) => (
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: colors.primary,
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {s.sessionNo}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textPrimary,
                flex: 1,
              }}
            >
              {s.topic}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.background,
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              {language === "vi" ? "Kiểu học: " : "Learning Type: "}
              <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
                {s.learningTeachingType}
              </Text>
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              ITU:{" "}
              <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
                {s.itu}
              </Text>
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                marginBottom: 12,
                fontSize: 13,
              }}
            >
              {language === "vi" ? "LO liên kết: " : "Linked LO: "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                {s.lo}
              </Text>
            </Text>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.divider,
                paddingTop: 8,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {language === "vi"
                  ? "Tài liệu sinh viên:"
                  : "Student Materials:"}
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  marginBottom: 8,
                  fontSize: 13,
                }}
              >
                {s.studentMaterials}
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {language === "vi" ? "Nhiệm vụ sinh viên:" : "Student Tasks:"}
              </Text>
              <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                {s.studentTasks}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderQuestionsTab = () => (
    <View>
      {syllabus.constructiveQuestions.map((q, idx) => (
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{ fontSize: 15, fontWeight: "700", color: colors.primary }}
            >
              {q.name}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {language === "vi" ? "Buổi " : "Session "}
              {q.sessionNo}
            </Text>
          </View>
          <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
            {q.details}
          </Text>
        </View>
      ))}
      {syllabus.constructiveQuestions.length === 0 && (
        <Text
          style={{
            color: colors.textSecondary,
            fontStyle: "italic",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {language === "vi"
            ? "Chưa có câu hỏi xây dựng."
            : "No constructive questions available."}
        </Text>
      )}
    </View>
  );

  const renderAssessmentsTab = () => (
    <View>
      {syllabus.assessments.map((a, idx) => (
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 12,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.primary,
                }}
              >
                {a.category} - {a.type}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {language === "vi" ? "Phần: " : "Part: "}
                <Text style={{ fontWeight: "600", color: colors.textPrimary }}>
                  {a.part}
                </Text>{" "}
                | {language === "vi" ? "Tỷ trọng: " : "Weight: "}
                <Text style={{ fontWeight: "700", color: colors.alertText }}>
                  {a.weight}
                </Text>
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.background,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: colors.textPrimary,
                  fontSize: 12,
                }}
              >
                {a.duration}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.background,
              padding: 12,
              borderRadius: 8,
            }}
          >
            <View style={styles.gridRow}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "CLO liên kết:" : "Linked CLO:"}
              </Text>
              <Text
                style={[
                  styles.gridValue,
                  { color: colors.textPrimary, fontWeight: "600" },
                ]}
              >
                {a.clo}
              </Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Điểm hoàn thành:" : "Completion Min:"}
              </Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                {a.completionCriteria}
              </Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Định dạng:" : "Format:"}
              </Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                {a.questionType} ({a.noQuestion}{" "}
                {language === "vi" ? "câu" : "Qs"})
              </Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Kiến thức/Kỹ năng:" : "Knowledge/Skill:"}
              </Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                {a.knowledgeAndSkill}
              </Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                {language === "vi" ? "Hướng dẫn chấm:" : "Grading Guide:"}
              </Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                {a.gradingGuide}
              </Text>
            </View>
            {a.note ? (
              <Text
                style={{
                  color: colors.textSecondary,
                  fontStyle: "italic",
                  marginTop: 8,
                  fontSize: 12,
                }}
              >
                {language === "vi" ? "Ghi chú: " : "Note: "}
                {a.note}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return "play-circle-outline";
      case "pdf":
        return "document-text-outline";
      case "slide":
        return "albums-outline";
      case "doc":
        return "document-outline";
      default:
        return "document-outline";
    }
  };

  const renderLessonsTab = () => {
    const chapters = (syllabus as any).chapters || [];
    if (chapters.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Ionicons
            name="folder-open-outline"
            size={48}
            color={colors.textSecondary}
            style={{ opacity: 0.5, marginBottom: 12 }}
          />
          <Text
            style={{
              color: colors.textSecondary,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            {language === "vi"
              ? "Chưa có bài học nào được cập nhật cho môn này."
              : "No lessons available for this subject yet."}
          </Text>
        </View>
      );
    }

    return (
      <View>
        {chapters.map((chapter: any, index: number) => {
          const isExpanded = expandedChapter === chapter.id;
          return (
            <View
              key={chapter.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                  padding: 0,
                  overflow: "hidden",
                  ...styles.shadowSmall,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setExpandedChapter(isExpanded ? null : chapter.id)
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: isExpanded
                    ? colors.primaryBg
                    : "transparent",
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: isExpanded
                      ? colors.primary
                      : colors.divider,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      color: isExpanded ? "white" : colors.textPrimary,
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: isExpanded ? colors.primary : colors.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {chapter.title}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: colors.textSecondary }}
                    numberOfLines={isExpanded ? undefined : 1}
                  >
                    {chapter.description}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.textSecondary}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {isExpanded && chapter.lessons && chapter.lessons.length > 0 && (
                <View
                  style={{
                    backgroundColor: colors.background,
                    paddingVertical: 8,
                  }}
                >
                  {chapter.lessons.map((lesson: any, lIdx: number) => (
                    <TouchableOpacity
                      key={lesson.id}
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push({
                          pathname: "/subject/lesson/[id]",
                          params: {
                            id: lesson.id,
                            url: lesson.url,
                            title: lesson.title,
                            type: lesson.type,
                          },
                        } as any)
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth:
                          lIdx < chapter.lessons.length - 1 ? 1 : 0,
                        borderBottomColor: colors.divider,
                      }}
                    >
                      <Ionicons
                        name={getLessonIcon(lesson.type)}
                        size={24}
                        color={colors.primary}
                        style={{ marginRight: 12 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: colors.textPrimary,
                            marginBottom: 4,
                          }}
                        >
                          {lesson.title}
                        </Text>
                        {lesson.duration && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={colors.textSecondary}
                              style={{ marginRight: 4 }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                              }}
                            >
                              {lesson.duration}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Ionicons
                        name="play-circle"
                        size={20}
                        color={colors.textSecondary}
                        style={{ opacity: 0.5 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralTab();
      case "lessons":
        return renderLessonsTab();
      case "materials":
        return renderMaterialsTab();
      case "clos":
        return renderCLOsTab();
      case "sessions":
        return renderSessionsTab();
      case "questions":
        return renderQuestionsTab();
      case "assessments":
        return renderAssessmentsTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
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
          style={{
            padding: 8,
            marginRight: 12,
            marginLeft: -8,
            borderRadius: 20,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: colors.textPrimary,
            }}
            numberOfLines={1}
          >
            {syllabus.subjectCode}
          </Text>
          <Text
            style={{ fontSize: 13, color: colors.textSecondary }}
            numberOfLines={1}
          >
            {language === "vi"
              ? syllabus.name
              : syllabus.englishName || syllabus.name}
          </Text>
        </View>
        {syllabus && (
          <TouchableOpacity
            onPress={() => toggleBookmark(syllabus.subjectCode)}
            activeOpacity={0.7}
            style={{
              marginRight: 10,
              padding: 6,
              borderRadius: 12,
              backgroundColor: isBookmarked
                ? "rgba(245,158,11,0.15)"
                : isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
            }}
          >
            <Ionicons
              name={isBookmarked ? "star" : "star-outline"}
              size={20} // Slightly smaller than the back arrow to match the credits badge
              color={isBookmarked ? "#F59E0B" : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        <View
          style={{
            backgroundColor: colors.primaryBg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}
          >
            {syllabus.credits}{" "}
            {syllabus.credits > 1
              ? language === "vi"
                ? "Tín chỉ"
                : "Credits"
              : language === "vi"
                ? "Tín chỉ"
                : "Credit"}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
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
                borderBottomColor:
                  activeTab === tab.key ? colors.primary : "transparent",
              }}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={
                  activeTab === tab.key ? colors.primary : colors.textSecondary
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontWeight: activeTab === tab.key ? "700" : "500",
                  color:
                    activeTab === tab.key
                      ? colors.primary
                      : colors.textSecondary,
                  fontSize: 14,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content body */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
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
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  gridLabel: {
    width: 130,
    fontSize: 14,
    fontWeight: "500",
  },
  gridValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
