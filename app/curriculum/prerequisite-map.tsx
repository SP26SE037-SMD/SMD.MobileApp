import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Animated,
    Dimensions,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { MOCK_CURRICULUMS, Subject } from '@/src/constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 120;
const CARD_HEIGHT = 90;
const CARD_MARGIN = 10;
const SEM_LABEL_WIDTH = 72;
const ROW_HEIGHT = CARD_HEIGHT + 40;

// --- Status color system ---
type CourseStatus = 'completed' | 'in_progress' | 'not_started' | 'locked';

function getStatus(code: string, selectedCode: string | null): CourseStatus {
    // Mock statuses for demo
    const completed = ['PRF192', 'MAE101', 'CEA201', 'ENW492', 'PRO192', 'MAD101'];
    const inProgress = ['CSD201', 'DBI202', 'OSG202', 'SSG104'];
    if (completed.includes(code)) return 'completed';
    if (inProgress.includes(code)) return 'in_progress';
    return 'not_started';
}

function statusBorderColor(status: CourseStatus, isDark: boolean) {
    switch (status) {
        case 'completed': return '#22C55E';
        case 'in_progress': return '#3B82F6';
        case 'not_started': return isDark ? '#475569' : '#CBD5E1';
        case 'locked': return '#EF4444';
    }
}

function statusBgColor(status: CourseStatus, isDark: boolean) {
    switch (status) {
        case 'completed': return isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)';
        case 'in_progress': return isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.08)';
        case 'not_started': return isDark ? '#1E293B' : '#FFFFFF';
        case 'locked': return isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.05)';
    }
}

function statusLabel(status: CourseStatus, lang: string) {
    if (lang === 'vi') {
        switch (status) {
            case 'completed': return 'Đã hoàn thành';
            case 'in_progress': return 'Đang học';
            case 'not_started': return 'Chưa học';
            case 'locked': return 'Bị khóa';
        }
    } else {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in_progress': return 'In Progress';
            case 'not_started': return 'Not Started';
            case 'locked': return 'Locked';
        }
    }
}

// --- Main Screen ---
export default function PrerequisiteMapScreen() {
    const { curriculumId } = useLocalSearchParams<{ curriculumId: string }>();
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const curriculum = MOCK_CURRICULUMS.find(c => c.id === curriculumId);
    const subjects: Subject[] = curriculum?.subjects ?? [];

    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [showLines, setShowLines] = useState(true);
    const bottomSheetAnim = useRef(new Animated.Value(0)).current;
    const isSheetOpen = useRef(false);

    // Group by semester
    const grouped = React.useMemo(() => {
        const map: Record<number, Subject[]> = {};
        for (const s of subjects) {
            if (!map[s.semester]) map[s.semester] = [];
            map[s.semester].push(s);
        }
        return Object.entries(map).sort(([a], [b]) => Number(a) - Number(b));
    }, [subjects]);

    // Pre-compute card centre positions from layout constants.
    // Each row is: paddingLeft(8) + semLabel(72) + colIdx*(CARD_WIDTH+CARD_MARGIN) + CARD_MARGIN/2 + CARD_WIDTH/2
    // Each row y: rowIdx * ROW_HEIGHT + paddingVertical(20) + CARD_HEIGHT/2
    // We keep top-of-card (y) and bottom-of-card (y + CARD_HEIGHT).
    const cardPositions = React.useMemo(() => {
        const pos: Record<string, { x: number; y: number }> = {};
        grouped.forEach(([, semSubjects], rowIdx) => {
            semSubjects.forEach((sub, colIdx) => {
                const x = 8 + SEM_LABEL_WIDTH + colIdx * (CARD_WIDTH + CARD_MARGIN) + CARD_MARGIN / 2;
                const y = rowIdx * ROW_HEIGHT + 20; // top of card
                pos[sub.code] = { x, y };
            });
        });
        return pos;
    }, [grouped]);

    const openSheet = useCallback((code: string) => {
        setSelectedCode(code);
        isSheetOpen.current = true;
        Animated.spring(bottomSheetAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 11 }).start();
    }, [bottomSheetAnim]);

    const closeSheet = useCallback(() => {
        Animated.timing(bottomSheetAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
            setSelectedCode(null);
            isSheetOpen.current = false;
        });
    }, [bottomSheetAnim]);

    // Bottom sheet slide-up transform
    const sheetTranslateY = bottomSheetAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [420, 0],
    });

    // Prerequisite chain helpers
    function getAllPrerequisites(code: string, acc: Set<string> = new Set()): Set<string> {
        const sub = subjects.find(s => s.code === code);
        if (!sub || !sub.prerequisite) return acc;
        const prereq = sub.prerequisite;
        if (!acc.has(prereq)) {
            acc.add(prereq);
            getAllPrerequisites(prereq, acc);
        }
        return acc;
    }

    function getAllDependents(code: string): Set<string> {
        const deps = new Set<string>();
        const queue = [code];
        while (queue.length) {
            const cur = queue.shift()!;
            for (const s of subjects) {
                if (s.prerequisite === cur && !deps.has(s.code)) {
                    deps.add(s.code);
                    queue.push(s.code);
                }
            }
        }
        return deps;
    }

    const prereqs = selectedCode ? getAllPrerequisites(selectedCode) : new Set<string>();
    const deps = selectedCode ? getAllDependents(selectedCode) : new Set<string>();
    const highlighted = selectedCode ? new Set([selectedCode, ...prereqs, ...deps]) : null;

    // Build SVG path connectors
    function buildConnectors() {
        const connectors: { from: string; to: string }[] = [];
        for (const s of subjects) {
            if (s.prerequisite) connectors.push({ from: s.prerequisite, to: s.code });
        }
        return connectors;
    }

    const colors = {
        background: isDark ? '#0F172A' : '#F1F5F9',
        card: isDark ? '#1E293B' : '#FFFFFF',
        textPrimary: isDark ? '#F1F5F9' : '#0F172A',
        textSecondary: isDark ? '#94A3B8' : '#64748B',
        primary: '#3B82F6',
        divider: isDark ? '#334155' : '#E2E8F0',
        semLabel: isDark ? '#0F172A' : '#E2E8F0',
        overlay: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)',
        sheetBg: isDark ? '#1E293B' : '#FFFFFF',
    };

    const selectedSubject = subjects.find(s => s.code === selectedCode);

    // Canvas total width = semester label + max cols * (card + margin)
    const maxCols = Math.max(...grouped.map(([, subs]) => subs.length));
    const canvasWidth = Math.max(SCREEN_WIDTH, SEM_LABEL_WIDTH + maxCols * (CARD_WIDTH + CARD_MARGIN) + 20);
    const canvasHeight = grouped.length * ROW_HEIGHT + 20;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {language === 'vi' ? 'Sơ đồ môn tiên quyết' : 'Prerequisite Map'}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>{curriculum?.name}</Text>
                </View>
            </View>

            {/* Toggle bar */}
            <View style={[styles.toggleBar, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
                <Ionicons name="git-network-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: colors.textPrimary, flex: 1 }}>
                    {language === 'vi' ? 'Hiện đường kết nối' : 'Show connector lines'}
                </Text>
                <Switch
                    value={showLines}
                    onValueChange={setShowLines}
                    trackColor={{ false: colors.divider, true: colors.primary + '80' }}
                    thumbColor={showLines ? colors.primary : colors.textSecondary}
                />
            </View>

            {/* Scrollable canvas */}
            <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ width: canvasWidth, position: 'relative' }}>
                        {/* SVG connector layer */}
                        {showLines && (
                            <Svg
                                width={canvasWidth}
                                height={canvasHeight}
                                style={StyleSheet.absoluteFillObject}
                                pointerEvents="none"
                            >
                                {buildConnectors().map(({ from, to }) => {
                                    const fromPos = cardPositions[from];
                                    const toPos = cardPositions[to];
                                    if (!fromPos || !toPos) return null;
                                    const isHighlighted = highlighted && (highlighted.has(from) && highlighted.has(to));
                                    const opacity = highlighted ? (isHighlighted ? 1 : 0.08) : 0.35;
                                    const stroke = isHighlighted ? colors.primary : (isDark ? '#94A3B8' : '#94A3B8');
                                    const x1 = fromPos.x + CARD_WIDTH / 2;
                                    const y1 = fromPos.y + CARD_HEIGHT;
                                    const x2 = toPos.x + CARD_WIDTH / 2;
                                    const y2 = toPos.y;
                                    const cy = (y1 + y2) / 2;
                                    return (
                                        <Path
                                            key={`${from}-${to}`}
                                            d={`M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`}
                                            stroke={stroke}
                                            strokeWidth={isHighlighted ? 2.5 : 1.5}
                                            strokeDasharray={isHighlighted ? undefined : '4 3'}
                                            fill="none"
                                            opacity={opacity}
                                        />
                                    );
                                })}
                            </Svg>
                        )}

                        {/* Semester rows */}
                        {grouped.map(([sem, semSubjects], rowIdx) => (
                            <View key={sem} style={[styles.semRow, { height: ROW_HEIGHT }]}>
                                {/* Semester label */}
                                <View style={[styles.semLabel, { backgroundColor: isDark ? '#0F172A' : '#E2E8F0' }]}>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, textAlign: 'center' }}>
                                        {language === 'vi' ? `HK ${sem}` : `S${sem}`}
                                    </Text>
                                </View>
                                {/* Course cards */}
                                <View style={styles.cardsRow}>
                                    {semSubjects.map((sub, colIdx) => {
                                        const status = getStatus(sub.code, selectedCode);
                                        const isSelected = sub.code === selectedCode;
                                        const isRelated = highlighted ? highlighted.has(sub.code) : true;
                                        const opacity = highlighted ? (isRelated ? 1 : 0.25) : 1;
                                        return (
                                            <TouchableOpacity
                                                key={sub.code}
                                                activeOpacity={0.8}
                                                onPress={() => isSelected ? closeSheet() : openSheet(sub.code)}
                                                onLayout={undefined}
                                                style={[
                                                    styles.courseCard,
                                                    {
                                                        backgroundColor: statusBgColor(status, isDark),
                                                        borderColor: isSelected ? colors.primary : statusBorderColor(status, isDark),
                                                        borderWidth: isSelected ? 2.5 : 1.5,
                                                        opacity,
                                                        transform: [{ scale: isSelected ? 1.04 : 1 }],
                                                    },
                                                ]}
                                            >
                                                <Text style={[styles.cardCode, { color: colors.textPrimary }]} numberOfLines={1}>
                                                    {sub.code}
                                                </Text>
                                                <Text style={[styles.cardName, { color: colors.textSecondary }]} numberOfLines={2}>
                                                    {sub.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                    <View style={[styles.creditBadge, { backgroundColor: statusBorderColor(status, isDark) + '25' }]}>
                                                        <Text style={{ fontSize: 10, fontWeight: '700', color: statusBorderColor(status, isDark) }}>
                                                            {sub.credits} TC
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>

            {/* Tap-away overlay */}
            {selectedCode && (
                <TouchableOpacity
                    style={[StyleSheet.absoluteFillObject, { backgroundColor: 'transparent' }]}
                    activeOpacity={1}
                    onPress={closeSheet}
                />
            )}

            {/* Bottom Sheet */}
            {selectedCode && selectedSubject && (
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { backgroundColor: colors.sheetBg, transform: [{ translateY: sheetTranslateY }] },
                    ]}
                >
                    {/* Handle */}
                    <View style={[styles.sheetHandle, { backgroundColor: colors.divider }]} />

                    {/* Course info */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
                        <View style={[styles.sheetCodeBadge, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={{ fontWeight: '800', fontSize: 15, color: colors.primary }}>
                                {selectedSubject.code}
                            </Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 }}>
                                {selectedSubject.name}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                                {selectedSubject.credits} {language === 'vi' ? 'tín chỉ' : 'credits'} •{' '}
                                {language === 'vi' ? `Học kỳ ${selectedSubject.semester}` : `Semester ${selectedSubject.semester}`}
                            </Text>
                        </View>
                    </View>

                    {/* Status badge */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={[styles.statusDot, { backgroundColor: statusBorderColor(getStatus(selectedSubject.code, selectedCode), isDark) }]} />
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                            {statusLabel(getStatus(selectedSubject.code, selectedCode), language)}
                        </Text>
                    </View>

                    {/* Prerequisites */}
                    <Text style={[styles.sheetSectionLabel, { color: colors.textSecondary }]}>
                        {language === 'vi' ? 'Môn tiên quyết' : 'Prerequisites'}
                    </Text>
                    {selectedSubject.prerequisite ? (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                            {selectedSubject.prerequisite.split(',').map(p => p.trim()).filter(Boolean).map(p => (
                                <View key={p} style={[styles.chip, { backgroundColor: '#EF4444' + '18', borderColor: '#EF4444' + '40' }]}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#EF4444' }}>{p}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12, fontStyle: 'italic' }}>
                            {language === 'vi' ? 'Không có môn tiên quyết' : 'No prerequisites'}
                        </Text>
                    )}

                    {/* Dependents */}
                    <Text style={[styles.sheetSectionLabel, { color: colors.textSecondary }]}>
                        {language === 'vi' ? 'Môn phụ thuộc vào môn này' : 'Dependent courses'}
                    </Text>
                    {deps.size > 0 ? (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                            {[...deps].map(d => (
                                <View key={d} style={[styles.chip, { backgroundColor: '#3B82F6' + '18', borderColor: '#3B82F6' + '40' }]}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#3B82F6' }}>{d}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' }}>
                            {language === 'vi' ? 'Không có môn phụ thuộc' : 'No dependent courses'}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[styles.closeBtn, { borderColor: colors.divider }]}
                        onPress={closeSheet}
                    >
                        <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize: 14 }}>
                            {language === 'vi' ? 'Đóng' : 'Close'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 },
    headerTitle: { fontSize: 17, fontWeight: '700' },
    toggleBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    semRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingLeft: 8,
    },
    semLabel: {
        width: SEM_LABEL_WIDTH,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 0,
    },
    cardsRow: {
        flexDirection: 'row',
        paddingLeft: 0,
    },
    courseCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 14,
        padding: 10,
        marginHorizontal: CARD_MARGIN / 2,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    cardCode: { fontSize: 13, fontWeight: '800', letterSpacing: 0.3 },
    cardName: { fontSize: 10, lineHeight: 14, flex: 1 },
    creditBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 20,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetCodeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    sheetSectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    closeBtn: {
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
});
