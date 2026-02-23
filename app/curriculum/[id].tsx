import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { MOCK_CURRICULUMS } from '@/src/constants/mockData';

export default function CurriculumDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
    };

    const curriculum = MOCK_CURRICULUMS.find(c => c.id === id);

    // Group subjects by semester
    const groupedSubjects = React.useMemo(() => {
        if (!curriculum?.subjects) return {};
        return curriculum.subjects.reduce((acc, subject) => {
            const sem = subject.semester;
            if (!acc[sem]) acc[sem] = [];
            acc[sem].push(subject);
            return acc;
        }, {} as Record<number, typeof curriculum.subjects>);
    }, [curriculum]);

    if (!curriculum) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '600' }}>
                    {language === 'vi' ? "Không tìm thấy chương trình" : "Curriculum not found"}
                </Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.primary, borderRadius: 8 }}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>{language === 'vi' ? "Quay lại" : "Go Back"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: colors.card,
                borderBottomWidth: 1,
                borderBottomColor: colors.divider
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 }} numberOfLines={1}>
                    {language === 'vi' ? "Chi tiết chương trình" : "Curriculum Details"}
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Hero Section / General Info */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadow }]}>
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
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{language === 'vi' ? "Mã ngành" : "Code"}</Text>
                            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{curriculum.code}</Text>
                        </View>
                        <View style={[styles.infoItem, { borderRightWidth: 1, borderRightColor: colors.divider }]}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{language === 'vi' ? "Tín chỉ" : "Credits"}</Text>
                            <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{curriculum.credits}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{language === 'vi' ? "Quyết định" : "Decision No"}</Text>
                            <Text style={[styles.infoValue, { color: colors.textPrimary }]} numberOfLines={1}>{curriculum.decisionNo || "N/A"}</Text>
                        </View>
                    </View>

                    {curriculum.description && (
                        <View style={{ marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.divider }}>
                            <Text style={{ color: colors.textSecondary, lineHeight: 22, fontSize: 15 }}>{curriculum.description}</Text>
                        </View>
                    )}
                </View>

                {/* PLOs */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="list-circle" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        {language === 'vi' ? "Chuẩn đầu ra (PLOs)" : "Program Learning Outcomes"}
                    </Text>
                </View>

                {curriculum.plos && curriculum.plos.length > 0 ? (
                    <View style={styles.ploList}>
                        {curriculum.plos.map((plo, idx) => (
                            <View key={idx} style={[styles.ploCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                                <View style={[styles.ploBadge, { backgroundColor: colors.primaryBg }]}>
                                    <Text style={{ fontWeight: '700', color: colors.primary, fontSize: 13 }}>{plo.name}</Text>
                                </View>
                                <Text style={{ color: colors.textPrimary, lineHeight: 20, fontSize: 14 }}>{plo.description}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={{ color: colors.textSecondary, fontStyle: 'italic', marginBottom: 24 }}>
                        {language === 'vi' ? "Chưa có chuẩn đầu ra." : "No PLOs available."}
                    </Text>
                )}

                {/* Subjects */}
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                    <Ionicons name="golf-outline" size={24} color={colors.successText} style={{ marginRight: 8 }} />
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                        {language === 'vi' ? "Danh sách môn học" : "Subjects"}
                    </Text>
                </View>

                {Object.keys(groupedSubjects).length > 0 ? (
                    <View style={styles.subjectList}>
                        {Object.entries(groupedSubjects)
                            .sort(([a], [b]) => Number(a) - Number(b))
                            .map(([semester, subjects]) => (
                                <View key={`sem-${semester}`} style={{ marginBottom: 24 }}>
                                    <View style={[styles.semesterHeader, { backgroundColor: colors.divider }]}>
                                        <Text style={{ fontWeight: '700', color: colors.textPrimary, fontSize: 15 }}>
                                            {language === 'vi' ? `Học kỳ ${semester}` : `Semester ${semester}`}
                                        </Text>
                                    </View>

                                    {subjects.map((sub, idx) => (
                                        <View key={idx} style={[styles.subjectCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, ...styles.shadowSmall }]}>
                                            <View style={styles.subjectHeader}>
                                                <View style={[styles.subjectCodeBadge, { backgroundColor: colors.background }]}>
                                                    <Text style={{ fontWeight: '700', color: colors.textPrimary, fontSize: 14 }}>{sub.code}</Text>
                                                </View>
                                            </View>

                                            <Text style={{ fontWeight: '600', color: colors.textPrimary, fontSize: 16, marginBottom: 8, lineHeight: 22 }}>
                                                {sub.name}
                                            </Text>

                                            <View style={styles.subjectFooter}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
                                                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                                                        {sub.credits} {language === 'vi' ? 'tín chỉ' : 'credits'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {sub.prerequisite ? (
                                                <View style={[styles.prereqContainer, { backgroundColor: colors.alertBg }]}>
                                                    <Ionicons name="alert-circle-outline" size={16} color={colors.alertText} style={{ marginRight: 6 }} />
                                                    <Text style={{ color: colors.alertText, fontSize: 13, fontWeight: '500', flex: 1 }}>
                                                        {language === 'vi' ? 'Tiên quyết:' : 'Prerequisite:'} {sub.prerequisite}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    ))}
                                </View>
                            ))}
                    </View>
                ) : (
                    <Text style={{ color: colors.textSecondary, fontStyle: 'italic' }}>
                        {language === 'vi' ? "Chưa có môn học nào." : "No subjects available."}
                    </Text>
                )}

                {/* View Map Button */}
                <TouchableOpacity
                    style={[styles.mapButton, { backgroundColor: colors.primary, ...styles.shadow }]}
                    onPress={() => Alert.alert("Thông báo", "Tính năng xem sơ đồ đang được phát triển.")}
                    activeOpacity={0.8}
                >
                    <Ionicons name="git-network-outline" size={22} color="white" style={{ marginRight: 10 }} />
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                        {language === 'vi' ? "Xem sơ đồ môn học" : "View Curriculum Map"}
                    </Text>
                </TouchableOpacity>

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
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    heroTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 4,
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    infoGrid: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 12,
        paddingVertical: 12,
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
    },
    ploList: {
        marginBottom: 24,
    },
    ploCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    ploBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    semesterHeader: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    subjectList: {
        marginBottom: 12,
    },
    subjectCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    subjectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    subjectCodeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    semesterBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    subjectFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prereqContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 14,
        marginTop: 16,
        marginBottom: 40,
    }
});
