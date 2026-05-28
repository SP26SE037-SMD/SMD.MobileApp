import {
    getCurriculumById,
    getGroupById,
    getPLOsByCurriculum,
    getSemesterMappings,
} from "@/src/services/curriculumService";
import type {
    Curriculum,
    Group,
    PLO,
    SemesterMapping,
    SemesterSubject,
} from "@/src/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "general" | "plos" | "subjects";

export default function CurriculumDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [activeTab, setActiveTab] = useState<TabKey>("general");
    const [selectedElectiveGroup, setSelectedElectiveGroup] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
    const [calculatedTotalCredits, setCalculatedTotalCredits] = useState<number>(0);
    const [plos, setPlos] = useState<PLO[]>([]);
    const [semesterMappings, setSemesterMappings] = useState<SemesterMapping[]>([]);
    const [groupDetails, setGroupDetails] = useState<Record<string, Group>>({});
    const [error, setError] = useState<string | null>(null);

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
        electiveBg: isDark ? "rgba(37, 99, 235, 0.15)" : "#DBEAFE", // bg-blue-100 equivalent
        electiveText: isDark ? "#60A5FA" : "#1D4ED8", // text-blue-700 equivalent
        electiveBorder: isDark ? "rgba(37, 99, 235, 0.3)" : "#BFDBFE",
        tabInactive: isDark ? "#334155" : "#E2E8F0",
    };

    // Fetch data on mount
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [currData, ploData, semData] = await Promise.allSettled([
                    getCurriculumById(id),
                    getPLOsByCurriculum(id),
                    getSemesterMappings(id),
                ]);

                if (currData.status === "fulfilled") {
                    setCurriculum(currData.value);
                } else {
                    setError("Failed to load curriculum");
                }

                if (ploData.status === "fulfilled") {
                    setPlos(ploData.value.content || []);
                }

                if (semData.status === "fulfilled") {
                    const mappings = semData.value.semesterMappings || [];
                    setSemesterMappings(mappings);

                    // Fetch group details for elective groups
                    const groupIds = new Set<string>();
                    mappings.forEach((mapping) => {
                        (mapping.subjects || []).forEach((sub) => {
                            const gId = sub.groupId || sub.electiveGroupId;
                            if (gId) {
                                groupIds.add(gId);
                            }
                        });
                    });

                    const groupMap: Record<string, Group> = {};
                    if (groupIds.size > 0) {
                        const groupPromises = Array.from(groupIds).map((gId) => getGroupById(gId));
                        const groupResults = await Promise.allSettled(groupPromises);
                        groupResults.forEach((res) => {
                            if (res.status === "fulfilled") {
                                groupMap[res.value.groupId] = res.value;
                            }
                        });
                        setGroupDetails(groupMap);
                    }

                    let total = 0;
                    const processedElectives = new Set<string>();

                    mappings.forEach((mapping) => {
                        (mapping.subjects || []).forEach((sub) => {
                            const gId = sub.groupId || sub.electiveGroupId;
                            const credit = sub.credit ?? sub.credits ?? 0;
                            
                            if (gId) {
                                const gInfo = groupMap[gId];
                                if (gInfo && gInfo.type === "COMBO") {
                                    total += credit;
                                } else {
                                    // ELECTIVE
                                    if (!processedElectives.has(gId)) {
                                        total += credit;
                                        processedElectives.add(gId);
                                    }
                                }
                            } else {
                                total += credit;
                            }
                        });
                    });
                    setCalculatedTotalCredits(total);
                }
            } catch (err) {
                console.error("[CurriculumDetail] Error:", err);
                setError("Failed to load curriculum data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

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

    // Loading state
    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.textSecondary, marginTop: 16, fontSize: 15 }}>
                    {"Loading curriculum..."}
                </Text>
            </SafeAreaView>
        );
    }

    // Error / Not found state
    if (error || !curriculum) {
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
                    {error || "Curriculum not found"}
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

    // Count total subjects
    const totalSubjects = semesterMappings.reduce((acc, sem) => acc + (sem.subjects?.length || 0), 0);

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
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{curriculum.curriculumCode}</Text>
                        <Text style={[styles.subtitle, { color: colors.primary }]}>{curriculum.curriculumName || curriculum.curriculumCode}</Text>
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    <View style={[styles.infoItem, { borderRightWidth: 1, borderRightColor: colors.divider }]}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            {"Code"}
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{curriculum.curriculumCode}</Text>
                    </View>
                    <View style={[styles.infoItem, { borderRightWidth: 1, borderRightColor: colors.divider }]}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            {"Credits"}
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{curriculum.totalCredits ?? calculatedTotalCredits}</Text>
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
                {curriculum.department && (
                    <View style={styles.gridRow}>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                            {"Department:"}
                        </Text>
                        <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{curriculum.department}</Text>
                    </View>
                )}
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                        {"Total Subjects:"}
                    </Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                        {totalSubjects}
                    </Text>
                </View>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                        {"Semesters:"}
                    </Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>
                        {semesterMappings.length}
                    </Text>
                </View>
                {curriculum.status && (
                    <View style={styles.gridRow}>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>
                            {"Status:"}
                        </Text>
                        <Text style={[styles.gridValue, { color: colors.primary, fontWeight: "700" }]}>
                            {curriculum.status}
                        </Text>
                    </View>
                )}
            </View>

            {/* View Map Button */}
            <TouchableOpacity
                style={[styles.mapButton, { backgroundColor: colors.primary, ...styles.shadow }]}
                onPress={() =>
                    router.push({
                        pathname: "/curriculum/prerequisite-map" as any,
                        params: { curriculumId: curriculum.curriculumId },
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
            {plos && plos.length > 0 ? (
                plos.map((plo, idx) => (
                    <View
                        key={plo.ploId || idx}
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
                            <Text style={{ fontWeight: "700", color: colors.primary, fontSize: 13 }}>
                                {plo.ploName || (plo as any).name || (plo as any).ploCode || (plo as any).code || `PLO ${idx + 1}`}
                            </Text>
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

    // Tab: Subjects (by semester)
    const renderSubjectsTab = () => (
        <View>
            {semesterMappings.length > 0 ? (
                semesterMappings
                    .sort((a, b) => (a.semester ?? (a as any).semesterNo ?? 0) - (b.semester ?? (b as any).semesterNo ?? 0))
                    .map((semMapping, idx) => {
                        const semValue = semMapping.semester ?? (semMapping as any).semesterNo ?? (semMapping as any).no;

                        const finalSubjects: any[] = [];
                        const groupMap = new Map<string, any>();

                            semMapping.subjects?.forEach((sub) => {
                                const gId = sub.groupId || sub.electiveGroupId;
                                const gInfo = gId ? groupDetails[gId] : null;

                                if (gId) {
                                    if (gInfo && gInfo.type === "COMBO") {
                                        finalSubjects.push({ kind: "combo", ...sub });
                                    } else {
                                        if (!groupMap.has(gId)) {
                                            groupMap.set(gId, {
                                                kind: "elective",
                                                groupId: gId,
                                                groupCode: gInfo?.groupCode || sub.subjectCode.substring(0, 7),
                                                groupName: gInfo?.groupName || "Elective Group",
                                                subjects: [],
                                            });
                                        }
                                        groupMap.get(gId).subjects.push(sub);
                                    }
                                } else {
                                    finalSubjects.push({ kind: "subject", ...sub });
                                }
                            });

                            groupMap.forEach((group) => {
                                finalSubjects.push(group);
                            });

                            return (
                                <View key={`sem-${semValue ?? 'unknown'}-${idx}`} style={{ marginBottom: 24 }}>
                                    <View style={[styles.semesterHeader, { backgroundColor: colors.divider }]}>
                                        <Text style={{ fontWeight: "700", color: colors.textPrimary, fontSize: 15 }}>
                                            {semValue === 0
                                                ? "Semester 0 (Prerequisite)"
                                                : `Semester ${semValue ?? idx + 1}`}
                                        </Text>
                                    </View>

                                    {finalSubjects.map((item, idx) => {
                                const isElective = item.kind === "elective";
                                const isCombo = item.kind === "combo";

                                if (isElective) {
                                    return (
                                        <TouchableOpacity
                                            key={`elective-${item.groupId}-${idx}`}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setSelectedElectiveGroup(item);
                                            }}
                                            style={[
                                                styles.subjectCard,
                                                {
                                                    backgroundColor: colors.electiveBg,
                                                    borderColor: colors.electiveBorder,
                                                    ...styles.shadowSmall,
                                                },
                                            ]}
                                        >
                                            <View style={styles.subjectHeader}>
                                                <View
                                                    style={[
                                                        styles.subjectCodeBadge,
                                                        { backgroundColor: colors.electiveBg },
                                                    ]}
                                                >
                                                    <Text style={{ fontWeight: "700", color: colors.electiveText, fontSize: 14 }}>
                                                        {item.groupCode}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <View style={{ backgroundColor: colors.electiveBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                                                        <Text style={{ color: colors.electiveText, fontSize: 10, fontWeight: "700" }}>ELECTIVE</Text>
                                                    </View>
                                                    <Ionicons name="chevron-forward" size={16} color={colors.electiveText} />
                                                </View>
                                            </View>
                                            <Text
                                                style={{
                                                    fontWeight: "600",
                                                    color: colors.electiveText,
                                                    fontSize: 16,
                                                    marginBottom: 4,
                                                    lineHeight: 22,
                                                }}
                                            >
                                                {item.groupName}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
                                                {item.subjects.length} subjects replaced by this group
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }

                                // For Subject and Combo
                                return (
                                    <TouchableOpacity
                                        key={item.subjectId || idx}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            router.push({ pathname: "/subject/[code]", params: { code: item.subjectCode } } as any);
                                        }}
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
                                                <Text style={{ fontWeight: "700", color: colors.textPrimary, fontSize: 14 }}>
                                                    {item.subjectCode}
                                                </Text>
                                            </View>
                                            {isCombo && (
                                                <View style={{ backgroundColor: colors.primaryBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                                                    <Text style={{ color: colors.primary, fontSize: 10, fontWeight: "700" }}>COMBO</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text
                                            style={{
                                                fontWeight: "600",
                                                color: colors.textPrimary,
                                                fontSize: 16,
                                                marginBottom: 8,
                                                lineHeight: 22,
                                            }}
                                        >
                                            {item.subjectName}
                                        </Text>
                                        <View style={styles.subjectFooter}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Ionicons
                                                    name="time-outline"
                                                    size={16}
                                                    color={colors.textSecondary}
                                                    style={{ marginRight: 4 }}
                                                />
                                                <Text
                                                    style={{
                                                        color: colors.textSecondary,
                                                        fontSize: 13,
                                                        flex: 1,
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {item.credit ?? item.credits ?? 0} credits
                                                </Text>
                                            </View>
                                        </View>
                                        {item.prerequisiteSubjectCode || (item.prerequisiteSubjectCodes && item.prerequisiteSubjectCodes.length > 0) ? (
                                            <View style={[styles.prereqContainer, { backgroundColor: colors.alertBg }]}>
                                                <Ionicons name="alert-circle-outline" size={16} color={colors.alertText} style={{ marginRight: 6 }} />
                                                <Text style={{ color: colors.alertText, fontSize: 13, fontWeight: "500", flex: 1 }}>
                                                    Prerequisite: {item.prerequisiteSubjectCodes?.join(", ") || item.prerequisiteSubjectCode}
                                                </Text>
                                            </View>
                                        ) : null}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    );
                })
            ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                    <Ionicons name="book-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 12 }} />
                    <Text style={{ color: colors.textSecondary, fontStyle: "italic", textAlign: "center" }}>
                        {"No subjects available."}
                    </Text>
                </View>
            )}

            {/* View Map Button */}
            {semesterMappings.length > 0 && (
                <TouchableOpacity
                    style={[styles.mapButton, { backgroundColor: colors.primary, ...styles.shadow }]}
                    onPress={() =>
                        router.push({
                            pathname: "/curriculum/prerequisite-map" as any,
                            params: { curriculumId: curriculum.curriculumId },
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

            {/* Elective Group Modal */}
            <Modal
                visible={!!selectedElectiveGroup}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedElectiveGroup(null)}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
                    <View style={{ 
                        backgroundColor: colors.background, 
                        borderTopLeftRadius: 24, 
                        borderTopRightRadius: 24,
                        padding: 20,
                        maxHeight: "80%",
                    }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <View>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                                    <View style={{ backgroundColor: colors.electiveBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 }}>
                                        <Text style={{ color: colors.electiveText, fontSize: 10, fontWeight: "700" }}>ELECTIVE</Text>
                                    </View>
                                    <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>{selectedElectiveGroup?.groupCode}</Text>
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.textPrimary }}>
                                    {selectedElectiveGroup?.groupName}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedElectiveGroup(null)} style={{ padding: 4 }}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {(selectedElectiveGroup?.subjects || []).map((sub: any, idx: number) => (
                                <TouchableOpacity
                                    key={sub.subjectId || idx}
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        setSelectedElectiveGroup(null);
                                        router.push({ pathname: "/subject/[code]", params: { code: sub.subjectCode } } as any);
                                    }}
                                    style={[
                                        styles.subjectCard,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: colors.cardBorder,
                                            ...styles.shadowSmall,
                                            marginBottom: 12
                                        },
                                    ]}
                                >
                                    <View style={styles.subjectHeader}>
                                        <View style={[styles.subjectCodeBadge, { backgroundColor: colors.background }]}>
                                            <Text style={{ fontWeight: "700", color: colors.textPrimary, fontSize: 14 }}>
                                                {sub.subjectCode}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontWeight: "600", color: colors.textPrimary, fontSize: 16, marginBottom: 8 }}>
                                        {sub.subjectName}
                                    </Text>
                                    <View style={styles.subjectFooter}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
                                            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                                {sub.credit ?? sub.credits ?? 0} credits
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <View style={{ height: 20 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
                        {curriculum.curriculumCode}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }} numberOfLines={1}>
                        {curriculum.curriculumName || curriculum.curriculumCode}
                    </Text>
                </View>
                <View style={{ backgroundColor: colors.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>
                        {curriculum.totalCredits ?? calculatedTotalCredits} {"Credits"}
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
