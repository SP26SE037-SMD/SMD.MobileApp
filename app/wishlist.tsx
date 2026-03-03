import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { MOCK_SYLLABUSES, Syllabus } from '@/src/constants/mockData';

export default function WishlistScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const bookmarkedIds = useWishlistStore(state => state.bookmarkedSubjects);
    const wishlistSubjects = MOCK_SYLLABUSES.filter(s => bookmarkedIds.includes(s.subjectCode));

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        primaryBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.08)",
        border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
            <Text style={[styles.emptyText, { color: colors.textPrimary, fontWeight: '700', fontSize: 18, marginBottom: 8 }]}>
                {language === 'vi' ? 'Danh sách trống' : 'Wishlist is empty'}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {language === 'vi' ? 'Hãy thả sao các môn học bạn quan tâm để lưu trữ tại đây.' : 'Star the subjects you are interested in to save them here.'}
            </Text>
            <TouchableOpacity
                style={{ marginTop: 24, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: colors.primary, borderRadius: 8 }}
                onPress={() => router.push('/(tabs)')}
            >
                <Text style={{ color: 'white', fontWeight: '600' }}>{language === 'vi' ? "Khám phá môn học" : "Explore Subjects"}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: Syllabus }) => (
        <TouchableOpacity
            style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push({ pathname: "/subject/[code]", params: { code: item.subjectCode } } as any)}
            activeOpacity={0.7}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={[styles.itemCode, { color: colors.primary }]}>{item.subjectCode}</Text>
                    <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={2}>
                        {language === 'vi' ? item.name : (item.englishName || item.name)}
                    </Text>
                </View>
                <View style={[styles.creditsBadge, { backgroundColor: colors.primaryBg }]}>
                    <Text style={[styles.creditsText, { color: colors.primary }]}>{item.credits} {item.credits > 1 ? (language === 'vi' ? 'TC' : 'Cr') : (language === 'vi' ? 'TC' : 'Cr')}</Text>
                </View>
            </View>

            <View style={styles.itemFooter}>
                <View style={styles.footerInfo}>
                    <Ionicons name="bar-chart-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>{item.degreeLevel}</Text>
                </View>
                <View style={styles.footerInfo}>
                    <Ionicons name={item.isActive ? "checkmark-circle" : "close-circle"} size={14} color={item.isActive ? "#16A34A" : colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.footerText, { color: item.isActive ? "#16A34A" : colors.textSecondary }]}>
                        {item.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>

            {/* Absolute positioning for un-favorite action */}
            <TouchableOpacity
                style={{ position: 'absolute', top: 12, right: 12, backgroundColor: "rgba(245,158,11,0.15)", padding: 6, borderRadius: 10 }}
                onPress={() => useWishlistStore.getState().toggleBookmark(item.subjectCode)}
            >
                <Ionicons name="star" size={18} color="#F59E0B" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    {language === 'vi' ? 'Yêu thích' : 'Wishlist'}
                </Text>
                <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            <View style={{ flex: 1 }}>
                {wishlistSubjects.length > 0 ? (
                    <Text style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 5, color: colors.textSecondary, fontSize: 13 }}>
                        {language === 'vi' ? `Bạn đã lưu ${wishlistSubjects.length} môn học.` : `You have saved ${wishlistSubjects.length} subjects.`}
                    </Text>
                ) : null}

                <FlatList
                    data={wishlistSubjects}
                    keyExtractor={(item) => item.subjectCode}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    backButton: {
        padding: 5,
        marginLeft: -5,
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 20,
        flexGrow: 1,
    },
    resultCard: {
        borderRadius: 12,
        padding: 16,
        paddingBottom: 16,
        paddingRight: 40, // Ensure space for absolute star icon
        marginBottom: 12,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            }
        })
    },
    itemCode: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 4,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    creditsBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    creditsText: {
        fontSize: 11,
        fontWeight: '700',
    },
    itemFooter: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150,150,150,0.1)',
        gap: 16,
    },
    footerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 30,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    }
});
