import {
    getAssessmentsBySyllabus,
    getMaterialsBySyllabus,
    getSessionsBySyllabus,
    searchSubjects,
    getSyllabusById,
} from "@/src/services/subjectService";
import type {
    Assessment,
    Material,
    Session,
    Subject,
    Syllabus,
} from "@/src/types";
import { useWishlistStore } from "@/src/store/useWishlistStore";
import {
    Ionicons
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
    | "materials"
    | "sessions"
    | "assessments";

export default function SubjectDetailsScreen() {
    const { code } = useLocalSearchParams<{ code: string }>();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [activeTab, setActiveTab] = useState<TabKey>("general");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Data from API
    const [subject, setSubject] = useState<Subject | null>(null);
    const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    const isBookmarked = useWishlistStore((state) =>
        code ? state.isBookmarked(code) : false,
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

    // Fetch subject → syllabus → sessions + assessments + materials
    useEffect(() => {
        if (!code) return;
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Search for subject by code
                const subjectsResult = await searchSubjects({
                    search: code,
                    searchBy: "code",
                    page: 0,
                    size: 5,
                });

                const foundSubject = subjectsResult.content?.find(
                    (s) => s.subjectCode.toLowerCase() === code.toLowerCase(),
                );

                if (!foundSubject) {
                    setError(`Subject '${code}' not found.`);
                    setIsLoading(false);
                    return;
                }
                setSubject(foundSubject);

                // Step 2: Get syllabus for this subject
                // Try fetching syllabus using subjectId
                try {
                    const syllabusData = await getSyllabusById(foundSubject.subjectId);
                    setSyllabus(syllabusData);

                    // Step 3: Fetch sessions, assessments, materials in parallel
                    const syllabusId = syllabusData.syllabusId;
                    const [sessionsRes, assessmentsRes, materialsRes] = await Promise.allSettled([
                        getSessionsBySyllabus(syllabusId),
                        getAssessmentsBySyllabus(syllabusId),
                        getMaterialsBySyllabus(syllabusId),
                    ]);

                    if (sessionsRes.status === "fulfilled") {
                        setSessions(sessionsRes.value || []);
                    }
                    if (assessmentsRes.status === "fulfilled") {
                        setAssessments(assessmentsRes.value || []);
                    }
                    if (materialsRes.status === "fulfilled") {
                        setMaterials(materialsRes.value || []);
                    }
                } catch (syllabusErr) {
                    console.warn("[SubjectDetail] Syllabus not found, showing subject info only:", syllabusErr);
                    // Subject exists but no syllabus — that's OK
                }
            } catch (err) {
                console.error("[SubjectDetail] Error:", err);
                setError("Failed to load subject data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [code]);

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.textSecondary, marginTop: 16, fontSize: 15 }}>
                    {"Loading subject..."}
                </Text>
            </SafeAreaView>
        );
    }

    // Error / Not found state
    if (error || !subject) {
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
                    {error || `Subject not found for '${code?.toUpperCase()}'.`}
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

    const tabs = [
        {
            key: "general",
            label: "General",
            icon: "information-circle-outline" as const,
        },
        {
            key: "materials",
            label: "Materials",
            icon: "library-outline" as const,
        },
        {
            key: "sessions",
            label: "Sessions",
            icon: "calendar-outline" as const,
        },
        {
            key: "assessments",
            label: "Assessment",
            icon: "pie-chart-outline" as const,
        },
    ];

    const displayCode = subject.subjectCode || code?.toUpperCase() || "";
    const displayName = syllabus?.englishName || syllabus?.syllabusName || subject.subjectName || "";
    const credits = syllabus?.credits || syllabus?.noCredit || subject.credits || 0;

    // Tab: General Info
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
                    {"Basic Information"}
                </Text>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                        {"Subject Code:"}
                    </Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                        {displayCode}
                    </Text>
                </View>
                {syllabus && (
                    <>
                        <View style={styles.gridRow}>
                            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                {"Syllabus Code:"}
                            </Text>
                            <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                {syllabus.syllabusCode}
                            </Text>
                        </View>
                        {syllabus.degreeLevel && (
                            <View style={styles.gridRow}>
                                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                    {"Degree Level:"}
                                </Text>
                                <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                    {syllabus.degreeLevel}
                                </Text>
                            </View>
                        )}
                        {syllabus.timeAllocation && (
                            <View style={styles.gridRow}>
                                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                    {"Time Allocation:"}
                                </Text>
                                <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                    {syllabus.timeAllocation}
                                </Text>
                            </View>
                        )}
                        {syllabus.prerequisite && (
                            <View style={styles.gridRow}>
                                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                    {"Pre-Requisite:"}
                                </Text>
                                <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                    {syllabus.prerequisite}
                                </Text>
                            </View>
                        )}
                        {syllabus.scoringScale != null && (
                            <View style={styles.gridRow}>
                                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                    {"Scoring Scale:"}
                                </Text>
                                <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                    {syllabus.scoringScale}
                                </Text>
                            </View>
                        )}
                        {syllabus.minAvgMarkToPass != null && (
                            <View style={styles.gridRow}>
                                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                    {"Min. Mark to Pass:"}
                                </Text>
                                <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                    {syllabus.minAvgMarkToPass}
                                </Text>
                            </View>
                        )}
                    </>
                )}
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                        {"Credits:"}
                    </Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                        {credits}
                    </Text>
                </View>
            </View>

            {/* Description */}
            {(syllabus?.description || subject.description) && (
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
                        {"Description"}
                    </Text>
                    <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
                        {syllabus?.description || subject.description}
                    </Text>
                </View>
            )}

            {/* Student Tasks */}
            {syllabus?.studentTasks && (
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
                        {"Student Tasks"}
                    </Text>
                    <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
                        {syllabus.studentTasks}
                    </Text>
                </View>
            )}

            {/* Tools */}
            {syllabus?.tools && (
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
                        {"Tools"}
                    </Text>
                    <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
                        {syllabus.tools}
                    </Text>
                </View>
            )}

            {/* Approval Details */}
            {syllabus && (
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: colors.textPrimary,
                            marginBottom: 8,
                        }}
                    >
                        {"Approval Details"}
                    </Text>
                    {syllabus.decisionNo && (
                        <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                            {"Decision No: "}
                            <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
                                {syllabus.decisionNo}
                            </Text>
                        </Text>
                    )}
                    {syllabus.approvedDate && (
                        <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                            {"Approved Date: "}
                            <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
                                {syllabus.approvedDate}
                            </Text>
                        </Text>
                    )}
                    <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>
                        {"Status:"}
                        <Text
                            style={{
                                color: (syllabus.isActive || syllabus.status === "PUBLISHED") ? colors.successText : colors.alertText,
                                fontWeight: "700",
                            }}
                        >
                            {(syllabus.isActive || syllabus.status === "PUBLISHED")
                                ? " Active"
                                : " Inactive"}
                        </Text>
                    </Text>
                    {syllabus.note && (
                        <Text style={{ color: colors.textSecondary }}>
                            {"Note: "}
                            <Text style={{ color: colors.textPrimary }}>{syllabus.note}</Text>
                        </Text>
                    )}
                </View>
            )}
        </View>
    );

    // Tab: Materials
    const renderMaterialsTab = () => (
        <View>
            {materials.length > 0 ? (
                materials.map((m, idx) => (
                    <View
                        key={m.materialId || idx}
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
                                {m.title || m.description}
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
                                        {"MAIN"}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {m.author && (
                            <Text style={{ color: colors.textPrimary, marginBottom: 4, fontWeight: "500" }}>
                                {"Author: "}{m.author}
                            </Text>
                        )}
                        {m.publisher && (
                            <Text style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 13 }}>
                                {"Publisher: "}{m.publisher}{m.publishedDate ? ` (${m.publishedDate})` : ""}
                            </Text>
                        )}
                        {(m.edition || m.isbn) && (
                            <Text style={{ color: colors.textSecondary, marginBottom: 8, fontSize: 13 }}>
                                {m.edition ? `Edition: ${m.edition}` : ""}
                                {m.isbn ? ` • ISBN: ${m.isbn}` : ""}
                            </Text>
                        )}
                        {m.materialType && (
                            <View style={{ flexDirection: "row", gap: 8 }}>
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
                                    {m.materialType}
                                </Text>
                            </View>
                        )}
                        {m.note ? (
                            <Text
                                style={{
                                    color: colors.textSecondary,
                                    fontStyle: "italic",
                                    marginTop: 8,
                                    fontSize: 13,
                                }}
                            >
                                {"Note: "}{m.note}
                            </Text>
                        ) : null}
                    </View>
                ))
            ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Ionicons name="library-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 12 }} />
                    <Text style={{ color: colors.textSecondary, fontStyle: "italic", textAlign: "center" }}>
                        {"No materials available."}
                    </Text>
                </View>
            )}
        </View>
    );

    // Tab: Sessions
    const renderSessionsTab = () => (
        <View>
            {sessions.length > 0 ? (
                sessions
                    .sort((a, b) => (a.sessionNumber || 0) - (b.sessionNumber || 0))
                    .map((s, idx) => (
                        <View
                            key={s.sessionId || idx}
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
                                        {s.sessionNumber}
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
                                    {s.sessionTitle}
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: colors.background,
                                    padding: 12,
                                    borderRadius: 8,
                                }}
                            >
                                {s.learningTeachingType && (
                                    <Text style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 13 }}>
                                        {"Learning Type: "}
                                        <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
                                            {s.learningTeachingType}
                                        </Text>
                                    </Text>
                                )}
                                {s.itu && (
                                    <Text style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 13 }}>
                                        ITU:{" "}
                                        <Text style={{ color: colors.textPrimary, fontWeight: "500" }}>
                                            {s.itu}
                                        </Text>
                                    </Text>
                                )}
                                {s.lo && (
                                    <Text style={{ color: colors.textSecondary, marginBottom: 12, fontSize: 13 }}>
                                        {"Linked LO: "}
                                        <Text style={{ color: colors.primary, fontWeight: "700" }}>
                                            {s.lo}
                                        </Text>
                                    </Text>
                                )}

                                {(s.studentMaterials || s.studentTasks) && (
                                    <View
                                        style={{
                                            borderTopWidth: 1,
                                            borderTopColor: colors.divider,
                                            paddingTop: 8,
                                        }}
                                    >
                                        {s.studentMaterials && (
                                            <>
                                                <Text style={{ color: colors.textSecondary, marginBottom: 2, fontSize: 13, fontWeight: "500" }}>
                                                    {"Student Materials:"}
                                                </Text>
                                                <Text style={{ color: colors.textPrimary, marginBottom: 8, fontSize: 13 }}>
                                                    {s.studentMaterials}
                                                </Text>
                                            </>
                                        )}
                                        {s.studentTasks && (
                                            <>
                                                <Text style={{ color: colors.textSecondary, marginBottom: 2, fontSize: 13, fontWeight: "500" }}>
                                                    {"Student Tasks:"}
                                                </Text>
                                                <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                                                    {s.studentTasks}
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
            ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 12 }} />
                    <Text style={{ color: colors.textSecondary, fontStyle: "italic", textAlign: "center" }}>
                        {"No sessions available."}
                    </Text>
                </View>
            )}
        </View>
    );

    // Tab: Assessments
    const renderAssessmentsTab = () => (
        <View>
            {assessments.length > 0 ? (
                assessments.map((a, idx) => (
                    <View
                        key={a.assessmentId || idx}
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
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.primary }}>
                                    {a.category ? `${a.category} - ` : ""}{a.type || "Assessment"}
                                </Text>
                                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                                    {a.part ? `Part: ` : ""}
                                    {a.part && <Text style={{ fontWeight: "600", color: colors.textPrimary }}>{a.part}</Text>}
                                    {a.weight ? ` | Weight: ` : ""}
                                    {a.weight && <Text style={{ fontWeight: "700", color: colors.alertText }}>{a.weight}{typeof a.weight === 'number' ? '%' : ''}</Text>}
                                </Text>
                            </View>
                            {a.duration && (
                                <View
                                    style={{
                                        backgroundColor: colors.background,
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                    }}
                                >
                                    <Text style={{ fontWeight: "600", color: colors.textPrimary, fontSize: 12 }}>
                                        {a.duration}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.background,
                                padding: 12,
                                borderRadius: 8,
                            }}
                        >
                            {a.clo && (
                                <View style={styles.gridRow}>
                                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                        {"Linked CLO:"}
                                    </Text>
                                    <Text style={[styles.gridValue, { color: colors.textPrimary, fontWeight: "600" }]}>
                                        {a.clo}
                                    </Text>
                                </View>
                            )}
                            {a.completionCriteria && (
                                <View style={styles.gridRow}>
                                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                        {"Completion Min:"}
                                    </Text>
                                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                        {a.completionCriteria}
                                    </Text>
                                </View>
                            )}
                            {a.questionType && (
                                <View style={styles.gridRow}>
                                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                        {"Format:"}
                                    </Text>
                                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                        {a.questionType}{a.noQuestion ? ` (${a.noQuestion} Qs)` : ""}
                                    </Text>
                                </View>
                            )}
                            {a.knowledgeAndSkill && (
                                <View style={styles.gridRow}>
                                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                        {"Knowledge/Skill:"}
                                    </Text>
                                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                        {a.knowledgeAndSkill}
                                    </Text>
                                </View>
                            )}
                            {a.gradingGuide && (
                                <View style={styles.gridRow}>
                                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                                        {"Grading Guide:"}
                                    </Text>
                                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                                        {a.gradingGuide}
                                    </Text>
                                </View>
                            )}
                            {a.note ? (
                                <Text
                                    style={{
                                        color: colors.textSecondary,
                                        fontStyle: "italic",
                                        marginTop: 8,
                                        fontSize: 12,
                                    }}
                                >
                                    {"Note: "}{a.note}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                ))
            ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Ionicons name="pie-chart-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 12 }} />
                    <Text style={{ color: colors.textSecondary, fontStyle: "italic", textAlign: "center" }}>
                        {"No assessments available."}
                    </Text>
                </View>
            )}
        </View>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case "general":
                return renderGeneralTab();
            case "materials":
                return renderMaterialsTab();
            case "sessions":
                return renderSessionsTab();
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
                        {displayCode}
                    </Text>
                    <Text
                        style={{ fontSize: 13, color: colors.textSecondary }}
                        numberOfLines={1}
                    >
                        {displayName}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => toggleBookmark(displayCode)}
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
                        size={20}
                        color={isBookmarked ? "#F59E0B" : colors.textSecondary}
                    />
                </TouchableOpacity>
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
                        {credits}{" "}
                        {Number(credits) > 1 ? "Credits" : "Credit"}
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
