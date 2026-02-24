import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { useWishlistStore } from '@/src/store/useWishlistStore';
import { MOCK_SYLLABUSES, Syllabus } from '@/src/constants/mockData';

export default function WishlistTabScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const bookmarkedIds = useWishlistStore(state => state.bookmarkedSubjects);
    // Display mock data for UI demo if no real items are bookmarked
    const wishlistSubjects = bookmarkedIds.length > 0
        ? MOCK_SYLLABUSES.filter(s => bookmarkedIds.includes(s.subjectCode))
        : MOCK_SYLLABUSES.slice(0, 3);

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#3B82F6" : "#2563EB",
        primaryBg: isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)",
        border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View
                style={{
                    backgroundColor: colors.card,
                    borderRadius: 20,
                    padding: 32,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    width: "100%",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0 : 0.05,
                    shadowRadius: 12,
                    elevation: isDark ? 0 : 3,
                }}
            >
                <View
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 20,
                        backgroundColor: colors.primaryBg,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                    }}
                >
                    <Ionicons name="heart-outline" size={36} color={colors.primary} />
                </View>
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: "600",
                        color: colors.textPrimary,
                        marginBottom: 8,
                    }}
                >
                    {language === 'vi' ? "Chưa có mục yêu thích" : "No favorites yet"}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        textAlign: "center",
                        lineHeight: 22,
                    }}
                >
                    {language === 'vi' ? "Hãy thêm curriculum hoặc môn học\nvào wishlist để theo dõi dễ dàng hơn!" : "Add curriculum or subjects\nto your wishlist to track them easily!"}
                </Text>

                <TouchableOpacity
                    onPress={() => router.push('/(tabs)')}
                    activeOpacity={0.85}
                    style={{
                        marginTop: 24,
                        backgroundColor: colors.primary,
                        borderRadius: 12,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: 14,
                            fontWeight: "600",
                        }}
                    >
                        {language === 'vi' ? "Khám phá ngay" : "Explore now"}
                    </Text>
                </TouchableOpacity>
            </View>
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
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    {language === 'vi' ? 'Yêu thích' : 'Wishlist'}
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    {language === 'vi' ? "Các môn học và curriculum yêu thích" : "Your favorite subjects and curriculum"}
                </Text>
            </View>

            <View style={{ flex: 1 }}>
                {wishlistSubjects.length > 0 ? (
                    <Text style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, color: colors.textSecondary, fontSize: 13, fontWeight: "500" }}>
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
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        marginTop: 4,
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
        flexGrow: 1,
    },
    resultCard: {
        borderRadius: 16,
        padding: 16,
        paddingBottom: 16,
        paddingRight: 40,
        marginBottom: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
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
        paddingTop: 40,
    }
});
