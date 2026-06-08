import { Ionicons } from "@expo/vector-icons";
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
import { getSyllabusCompareStudent, SyllabusCompareStudentData } from "@/src/services/syllabusService";

export default function CompareSyllabusScreen() {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [activeFilter, setActiveFilter] = useState<"ALL" | "MODIFIED" | "ADDED" | "REMOVED">("ALL");
    
    // API State
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [riskInfo, setRiskInfo] = useState<{ level: string; reason: string } | null>(null);

    useEffect(() => {
        if (!id) return;
        
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getSyllabusCompareStudent(id as string);
                
                let assessmentDiff: any = {};
                let conceptDiff: any = {};
                let sessionDiff: any = {};

                if (data.assessmentDiffJson) {
                    try { assessmentDiff = JSON.parse(data.assessmentDiffJson); } catch (e) { console.error(e); }
                }
                
                if (data.conceptDiffJson) {
                    try { conceptDiff = JSON.parse(data.conceptDiffJson); } catch (e) { console.error(e); }
                }
                
                if (data.sessionDiffJson) {
                    try { sessionDiff = JSON.parse(data.sessionDiffJson); } catch (e) { console.error(e); }
                }

                const sections: any[] = [];

                // 1. Map Concepts
                const conceptItems: any[] = [];
                if (conceptDiff.added_concepts && Array.isArray(conceptDiff.added_concepts)) {
                    conceptDiff.added_concepts.forEach((c: string) => {
                        conceptItems.push({ field: "Concept", new: c, status: "ADDED" });
                    });
                }
                if (conceptDiff.removed_concepts && Array.isArray(conceptDiff.removed_concepts)) {
                    conceptDiff.removed_concepts.forEach((c: string) => {
                        conceptItems.push({ field: "Concept", old: c, status: "REMOVED" });
                    });
                }
                if (conceptDiff.modified_concepts && Array.isArray(conceptDiff.modified_concepts)) {
                    conceptDiff.modified_concepts.forEach((c: string) => {
                        conceptItems.push({ field: "Concept", new: c, status: "MODIFIED" });
                    });
                }

                if (conceptItems.length > 0) {
                    sections.push({ section: "Concepts & Materials", items: conceptItems });
                }

                // Risk Info
                if (conceptDiff.risk_assessment) {
                    setRiskInfo({
                        level: conceptDiff.risk_assessment,
                        reason: conceptDiff.risk_reason || ""
                    });
                }

                // 2. Map Assessments
                const assessmentItems: any[] = [];
                if (assessmentDiff.addedAssessments && Array.isArray(assessmentDiff.addedAssessments)) {
                    assessmentDiff.addedAssessments.forEach((a: any) => {
                        assessmentItems.push({ field: a.assessmentIdentifier || "Assessment", new: JSON.stringify(a), status: "ADDED" });
                    });
                }
                if (assessmentDiff.removedAssessments && Array.isArray(assessmentDiff.removedAssessments)) {
                    assessmentDiff.removedAssessments.forEach((a: any) => {
                        assessmentItems.push({ field: a.assessmentIdentifier || "Assessment", old: JSON.stringify(a), status: "REMOVED" });
                    });
                }
                if (assessmentDiff.changedAssessments && Array.isArray(assessmentDiff.changedAssessments)) {
                    assessmentDiff.changedAssessments.forEach((a: any) => {
                        assessmentItems.push({ 
                            field: a.assessmentIdentifier, 
                            details: Array.isArray(a.detailChanges) ? a.detailChanges : [],
                            status: "MODIFIED" 
                        });
                    });
                }

                if (assessmentItems.length > 0) {
                    sections.push({ section: "Assessments", items: assessmentItems });
                }

                // 3. Map Sessions
                const sessionItems: any[] = [];
                if (sessionDiff.addedSessions && Array.isArray(sessionDiff.addedSessions)) {
                    sessionDiff.addedSessions.forEach((s: any) => {
                        sessionItems.push({ field: "Session", new: s, status: "ADDED" });
                    });
                }
                if (sessionDiff.removedSessions && Array.isArray(sessionDiff.removedSessions)) {
                    sessionDiff.removedSessions.forEach((s: any) => {
                        sessionItems.push({ field: "Session", old: s, status: "REMOVED" });
                    });
                }
                if (sessionDiff.changedSessions && Array.isArray(sessionDiff.changedSessions)) {
                    sessionDiff.changedSessions.forEach((s: any) => {
                        sessionItems.push({ 
                            field: s.sessionName || "Session", 
                            details: Array.isArray(s.detailChanges) ? s.detailChanges : [],
                            status: "MODIFIED" 
                        });
                    });
                }

                if (sessionItems.length > 0) {
                    sections.push({ section: "Sessions", items: sessionItems });
                }

                setParsedData(sections);
                
            } catch (err: any) {
                console.error("[CompareScreen] API Error:", err);
                // Handle 404 explicitly as per user request
                if (err.response?.status === 404 || err.message?.includes('404')) {
                    setError("There is no older version of this syllabus to compare with.");
                } else {
                    setError(err.message || "Failed to load comparison data");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        divider: isDark ? "#334155" : "#E2E8F0",
        addedBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
        addedText: isDark ? "#34D399" : "#059669",
        removedBg: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
        removedText: isDark ? "#F87171" : "#DC2626",
        modifiedBg: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)",
        modifiedText: isDark ? "#FBBF24" : "#D97706",
        riskHighBg: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.1)",
        riskHighText: isDark ? "#FCA5A5" : "#EF4444",
        riskLowBg: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.1)",
        riskLowText: isDark ? "#6EE7B7" : "#10B981",
        riskMediumBg: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.1)",
        riskMediumText: isDark ? "#FCD34D" : "#F59E0B"
    };

    const renderChangeBadge = (status: string) => {
        let bgColor, textColor, label, icon;
        switch (status) {
            case "ADDED":
                bgColor = colors.addedBg;
                textColor = colors.addedText;
                label = "Added";
                icon = "add-circle";
                break;
            case "REMOVED":
                bgColor = colors.removedBg;
                textColor = colors.removedText;
                label = "Removed";
                icon = "remove-circle";
                break;
            case "MODIFIED":
                bgColor = colors.modifiedBg;
                textColor = colors.modifiedText;
                label = "Modified";
                icon = "create";
                break;
            default:
                return null;
        }

        return (
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: bgColor, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                <Ionicons name={icon as any} size={12} color={textColor} style={{ marginRight: 4 }} />
                <Text style={{ color: textColor, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{label}</Text>
            </View>
        );
    };

    const filteredData = parsedData.map(section => {
        const filteredItems = section.items.filter((item: any) => {
            if (activeFilter === "ALL") return true;
            return item.status === activeFilter;
        });
        return { ...section, items: filteredItems };
    }).filter(section => section.items.length > 0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textPrimary }}>Compare Syllabus</Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>Changes from previous version</Text>
                </View>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>Loading comparison...</Text>
                </View>
            ) : error ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                    <Ionicons name="alert-circle-outline" size={60} color="#F59E0B" style={{ opacity: 0.5, marginBottom: 16 }} />
                    <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", color: "#F59E0B" }}>
                        {error}
                    </Text>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.primary, borderRadius: 8 }}>
                        <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* Filter Tabs */}
                    <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                            {(["ALL", "MODIFIED", "ADDED", "REMOVED"] as const).map(filter => (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setActiveFilter(filter)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: activeFilter === filter ? colors.primary : (isDark ? "#1E293B" : "#E2E8F0"),
                                    }}
                                >
                                    <Text style={{ 
                                        fontSize: 13, 
                                        fontWeight: "600", 
                                        color: activeFilter === filter ? "#FFFFFF" : colors.textSecondary 
                                    }}>
                                        {filter === "ALL" ? "All Changes" : filter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Changes List */}
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                        
                        {/* Risk Assessment Box */}
                        {riskInfo && (
                            <View style={{ 
                                marginBottom: 24, 
                                backgroundColor: riskInfo.level === "HIGH" ? colors.riskHighBg : (riskInfo.level === "LOW" ? colors.riskLowBg : colors.riskMediumBg),
                                borderRadius: 12,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: riskInfo.level === "HIGH" ? colors.riskHighText : (riskInfo.level === "LOW" ? colors.riskLowText : colors.riskMediumText),
                            }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                    <Ionicons name="warning" size={20} color={riskInfo.level === "HIGH" ? colors.riskHighText : (riskInfo.level === "LOW" ? colors.riskLowText : colors.riskMediumText)} style={{ marginRight: 8 }} />
                                    <Text style={{ fontWeight: "800", fontSize: 16, color: riskInfo.level === "HIGH" ? colors.riskHighText : (riskInfo.level === "LOW" ? colors.riskLowText : colors.riskMediumText) }}>
                                        AI RISK ASSESSMENT: {riskInfo.level}
                                    </Text>
                                </View>
                                <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>
                                    {riskInfo.reason}
                                </Text>
                            </View>
                        )}

                        {filteredData.length === 0 ? (
                            <View style={{ alignItems: "center", marginTop: 40 }}>
                                <Ionicons name="checkmark-circle-outline" size={60} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                                <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "500" }}>No changes found.</Text>
                            </View>
                        ) : (
                            filteredData.map((section, index) => (
                                <View key={index} style={{ marginBottom: 24 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 }}>
                                        {section.section}
                                    </Text>
                                    
                                    <View style={{ backgroundColor: colors.card, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.divider }}>
                                        {section.items.map((item: any, i: number) => (
                                            <View key={i} style={{ padding: 16, borderBottomWidth: i === section.items.length - 1 ? 0 : 1, borderBottomColor: colors.divider }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary, flex: 1, marginRight: 12 }}>
                                                        {item.field}
                                                    </Text>
                                                    {renderChangeBadge(item.status)}
                                                </View>
                                                
                                                {item.status === "MODIFIED" && item.details && item.details.map((detail: string, detailIdx: number) => (
                                                    <View key={detailIdx} style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 8 }}>
                                                        <View style={{ width: 20, alignItems: "center", marginRight: 8, marginTop: 2 }}>
                                                            <Ionicons name="arrow-forward" size={14} color={colors.modifiedText} />
                                                        </View>
                                                        <Text style={{ flex: 1, fontSize: 14, color: colors.textPrimary, lineHeight: 20 }}>
                                                            {detail}
                                                        </Text>
                                                    </View>
                                                ))}

                                                {/* For concepts, they are simple added/removed strings mapped to new/old */}
                                                {item.status === "MODIFIED" && !item.details && item.new && (
                                                    <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
                                                        <Ionicons name="arrow-forward" size={16} color={colors.modifiedText} style={{ marginRight: 8 }} />
                                                        <Text style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}>{item.new}</Text>
                                                    </View>
                                                )}

                                                {item.status === "ADDED" && item.new && (
                                                    <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
                                                        <Ionicons name="add" size={16} color={colors.addedText} style={{ marginRight: 8 }} />
                                                        <Text style={{ flex: 1, fontSize: 14, color: colors.addedText }}>{item.new}</Text>
                                                    </View>
                                                )}

                                                {item.status === "REMOVED" && item.old && (
                                                    <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
                                                        <Ionicons name="remove" size={16} color={colors.removedText} style={{ marginRight: 8 }} />
                                                        <Text style={{ flex: 1, fontSize: 14, color: colors.removedText, textDecorationLine: "line-through" }}>{item.old}</Text>
                                                    </View>
                                                )}

                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
}
