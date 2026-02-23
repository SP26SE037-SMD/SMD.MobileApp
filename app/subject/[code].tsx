import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { MOCK_SYLLABUSES } from '@/src/constants/mockData';

type TabKey = 'general' | 'materials' | 'clos' | 'sessions' | 'questions' | 'assessments';

export default function SubjectDetailsScreen() {
    const { code } = useLocalSearchParams<{ code: string }>();
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [activeTab, setActiveTab] = useState<TabKey>('general');

    // Find the syllabus by subjectCode
    // In a real app, you might have an API like getSyllabusBySubjectCode(code)
    const syllabus = MOCK_SYLLABUSES.find(s => s.subjectCode.toLowerCase() === code?.toLowerCase());

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#3B82F6" : "#2563EB",
        primaryBg: isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)",
        divider: isDark ? "#334155" : "#E2E8F0",
        alertText: isDark ? "#FCA5A5" : "#EF4444",
        alertBg: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
        successText: isDark ? "#86EFAC" : "#16A34A",
        successBg: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.05)",
        tabInactive: isDark ? "#334155" : "#E2E8F0",
    };

    if (!syllabus) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '600', paddingHorizontal: 20, textAlign: 'center' }}>
                    {language === 'vi' ? `Không tìm thấy thông tin chi tiết (Syllabus) cho môn học ${code?.toUpperCase()}.` : `Syllabus not found for subject ${code?.toUpperCase()}.`}
                </Text>
                <Text style={{ color: colors.textSecondary, marginTop: 12, paddingHorizontal: 30, textAlign: 'center' }}>
                    *Note: Currently only PRF192, PRO192, and CSD201 are mocked with full syllabus details.
                </Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.primary, borderRadius: 8 }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>{language === 'vi' ? "Quay lại" : "Go Back"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const tabs = [
        { key: 'general', label: language === 'vi' ? 'Chung' : 'General', icon: 'information-circle-outline' as const },
        { key: 'materials', label: language === 'vi' ? 'Tài liệu' : 'Materials', icon: 'library-outline' as const },
        { key: 'clos', label: 'CLOs', icon: 'list-circle-outline' as const },
        { key: 'sessions', label: language === 'vi' ? 'Lịch trình' : 'Sessions', icon: 'calendar-outline' as const },
        { key: 'questions', label: 'CQ', icon: 'help-circle-outline' as const },
        { key: 'assessments', label: language === 'vi' ? 'Đánh giá' : 'Assessment', icon: 'pie-chart-outline' as const },
    ];

    const renderGeneralTab = () => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadow }]}>
            <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>{language === 'vi' ? "Thông tin cơ bản" : "Basic Information"}</Text>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Syllabus ID:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{syllabus.id}</Text>
                </View>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Degree Level:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{syllabus.degreeLevel}</Text>
                </View>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Time Allocation:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{syllabus.timeAllocation}</Text>
                </View>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Pre-Requisite:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{syllabus.prerequisite}</Text>
                </View>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Scoring Scale:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{syllabus.scoringScale}</Text>
                </View>
                <View style={styles.gridRow}>
                    <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Min. Mark to Pass:</Text>
                    <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{syllabus.minAvgMarkToPass}</Text>
                </View>
            </View>

            <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>{language === 'vi' ? "Mô tả" : "Description"}</Text>
                <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>{syllabus.description}</Text>
            </View>

            <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>{language === 'vi' ? "Nhiệm vụ sinh viên" : "Student Tasks"}</Text>
                <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>{syllabus.studentTasks}</Text>
            </View>

            <View style={{ marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>{language === 'vi' ? "Công cụ" : "Tools"}</Text>
                <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>{syllabus.tools}</Text>
            </View>

            <View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>{language === 'vi' ? "Thông tin duyệt" : "Approval Details"}</Text>
                <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Decision No: <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>{syllabus.decisionNo}</Text></Text>
                <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Approved Date: <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>{syllabus.approvedDate}</Text></Text>
                <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Status:
                    <Text style={{ color: syllabus.isActive ? colors.successText : colors.alertText, fontWeight: '700' }}>
                        {syllabus.isActive ? " Active" : " Inactive"}
                    </Text>
                </Text>
                <Text style={{ color: colors.textSecondary }}>Note: <Text style={{ color: colors.textPrimary }}>{syllabus.note}</Text></Text>
            </View>
        </View>
    );

    const renderMaterialsTab = () => (
        <View>
            {syllabus.materials.map((m, idx) => (
                <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary, flex: 1 }}>{m.description}</Text>
                        {m.isMainMaterial && (
                            <View style={{ backgroundColor: colors.successBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
                                <Text style={{ color: colors.successText, fontSize: 12, fontWeight: '700' }}>MAIN</Text>
                            </View>
                        )}
                    </View>
                    <Text style={{ color: colors.textPrimary, marginBottom: 4, fontWeight: '500' }}>Author: {m.author}</Text>
                    <Text style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 13 }}>Publisher: {m.publisher} ({m.publishedDate})</Text>
                    <Text style={{ color: colors.textSecondary, marginBottom: 8, fontSize: 13 }}>Edition: {m.edition} • ISBN: {m.isbn}</Text>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        {m.isHardCopy && <Text style={{ color: colors.textPrimary, fontSize: 12, backgroundColor: colors.divider, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>Hard Copy</Text>}
                        {m.isOnline && <Text style={{ color: colors.textPrimary, fontSize: 12, backgroundColor: colors.divider, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>Online</Text>}
                    </View>
                    {m.note ? <Text style={{ color: colors.textSecondary, fontStyle: 'italic', marginTop: 8, fontSize: 13 }}>Note: {m.note}</Text> : null}
                </View>
            ))}
        </View>
    );

    const renderCLOsTab = () => (
        <View>
            {syllabus.clos.map((clo, idx) => (
                <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 6 }}>{clo.name}</Text>
                    <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>{clo.description}</Text>
                </View>
            ))}
        </View>
    );

    const renderSessionsTab = () => (
        <View>
            {syllabus.sessions.map((s, idx) => (
                <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{ backgroundColor: colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{s.sessionNo}</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, flex: 1 }}>{s.topic}</Text>
                    </View>

                    <View style={{ backgroundColor: colors.background, padding: 12, borderRadius: 8 }}>
                        <Text style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 13 }}>Learning Type: <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>{s.learningTeachingType}</Text></Text>
                        <Text style={{ color: colors.textSecondary, marginBottom: 4, fontSize: 13 }}>ITU: <Text style={{ color: colors.textPrimary, fontWeight: '500' }}>{s.itu}</Text></Text>
                        <Text style={{ color: colors.textSecondary, marginBottom: 12, fontSize: 13 }}>Linked LO: <Text style={{ color: colors.primary, fontWeight: '700' }}>{s.lo}</Text></Text>

                        <View style={{ borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 8 }}>
                            <Text style={{ color: colors.textSecondary, marginBottom: 2, fontSize: 13, fontWeight: '500' }}>Student Materials:</Text>
                            <Text style={{ color: colors.textPrimary, marginBottom: 8, fontSize: 13 }}>{s.studentMaterials}</Text>

                            <Text style={{ color: colors.textSecondary, marginBottom: 2, fontSize: 13, fontWeight: '500' }}>Student Tasks:</Text>
                            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>{s.studentTasks}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderQuestionsTab = () => (
        <View>
            {syllabus.constructiveQuestions.map((q, idx) => (
                <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary }}>{q.name}</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Session {q.sessionNo}</Text>
                    </View>
                    <Text style={{ color: colors.textPrimary, lineHeight: 22 }}>{q.details}</Text>
                </View>
            ))}
            {syllabus.constructiveQuestions.length === 0 && (
                <Text style={{ color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 20 }}>No constructive questions available.</Text>
            )}
        </View>
    );

    const renderAssessmentsTab = () => (
        <View>
            {syllabus.assessments.map((a, idx) => (
                <View key={idx} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>{a.category} - {a.type}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>Part: <Text style={{ fontWeight: '600', color: colors.textPrimary }}>{a.part}</Text> | Weight: <Text style={{ fontWeight: '700', color: colors.alertText }}>{a.weight}</Text></Text>
                        </View>
                        <View style={{ backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                            <Text style={{ fontWeight: '600', color: colors.textPrimary, fontSize: 12 }}>{a.duration}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: colors.background, padding: 12, borderRadius: 8 }}>
                        <View style={styles.gridRow}>
                            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Linked CLO:</Text>
                            <Text style={[styles.gridValue, { color: colors.textPrimary, fontWeight: '600' }]}>{a.clo}</Text>
                        </View>
                        <View style={styles.gridRow}>
                            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Completion Min:</Text>
                            <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{a.completionCriteria}</Text>
                        </View>
                        <View style={styles.gridRow}>
                            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Format:</Text>
                            <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{a.questionType} ({a.noQuestion} Qs)</Text>
                        </View>
                        <View style={styles.gridRow}>
                            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Knowledge/Skill:</Text>
                            <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{a.knowledgeAndSkill}</Text>
                        </View>
                        <View style={styles.gridRow}>
                            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Grading Guide:</Text>
                            <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{a.gradingGuide}</Text>
                        </View>
                        {a.note ? (
                            <Text style={{ color: colors.textSecondary, fontStyle: 'italic', marginTop: 8, fontSize: 12 }}>Note: {a.note}</Text>
                        ) : null}
                    </View>
                </View>
            ))}
        </View>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'general': return renderGeneralTab();
            case 'materials': return renderMaterialsTab();
            case 'clos': return renderCLOsTab();
            case 'sessions': return renderSessionsTab();
            case 'questions': return renderQuestionsTab();
            case 'assessments': return renderAssessmentsTab();
            default: return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: colors.card,
                borderBottomWidth: 1,
                borderBottomColor: colors.divider,
                zIndex: 10
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary }} numberOfLines={1}>
                        {syllabus.subjectCode}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }} numberOfLines={1}>
                        {language === 'vi' ? syllabus.name : (syllabus.englishName || syllabus.name)}
                    </Text>
                </View>
                <View style={{ backgroundColor: colors.primaryBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
                        {syllabus.credits} {syllabus.credits > 1 ? (language === 'vi' ? 'Tín chỉ' : 'Credits') : (language === 'vi' ? 'Tín chỉ' : 'Credit')}
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
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                borderBottomWidth: 3,
                                borderBottomColor: activeTab === tab.key ? colors.primary : 'transparent',
                            }}
                        >
                            <Ionicons name={tab.icon} size={18} color={activeTab === tab.key ? colors.primary : colors.textSecondary} style={{ marginRight: 6 }} />
                            <Text style={{
                                fontWeight: activeTab === tab.key ? '700' : '500',
                                color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                                fontSize: 14
                            }}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content body */}
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
    gridRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start'
    },
    gridLabel: {
        width: 130,
        fontSize: 14,
        fontWeight: '500',
    },
    gridValue: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    }
});
