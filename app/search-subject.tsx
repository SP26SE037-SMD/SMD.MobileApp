import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { MOCK_SYLLABUSES, Syllabus } from '@/src/constants/mockData';

export default function SearchSubjectScreen() {
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Syllabus[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#3B82F6" : "#2563EB",
        primaryBg: isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)",
        border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        inputBg: isDark ? "#1E293B" : "#FFFFFF",
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setResults([]);
            setHasSearched(true);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = MOCK_SYLLABUSES.filter(s =>
            s.subjectCode.toLowerCase().includes(query) ||
            s.name.toLowerCase().includes(query) ||
            s.englishName.toLowerCase().includes(query)
        );
        setResults(filtered);
        setHasSearched(true);
    };

    const renderEmptyState = () => {
        if (!hasSearched) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={60} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        {language === 'vi' ? 'Nhập mã hoặc tên môn học để tìm kiếm' : 'Enter subject code or name to search'}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    {language === 'vi' ? 'Không tìm thấy môn học nào' : 'No subjects found'}
                </Text>
                <Text style={[{ color: colors.textSecondary, fontSize: 13, marginTop: 8, textAlign: 'center' }]}>
                    {language === 'vi' ? 'Lưu ý: Dữ liệu mẫu (Mock) hiện tại chỉ bao gồm PRF192, PRO192, CSD201' : 'Note: Current mock data only includes PRF192, PRO192, CSD201'}
                </Text>
            </View>
        );
    };

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
                    <Text style={[styles.creditsText, { color: colors.primary }]}>{item.credits} Cr</Text>
                </View>
            </View>

            <View style={styles.itemFooter}>
                <View style={styles.footerInfo}>
                    <Ionicons name="bar-chart-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>{item.degreeLevel}</Text>
                </View>
                <View style={styles.footerInfo}>
                    <Ionicons name="checkmark-circle-outline" size={14} color={item.isActive ? "#16A34A" : colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.footerText, { color: item.isActive ? "#16A34A" : colors.textSecondary }]}>
                        {item.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>
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
                    {language === 'vi' ? 'Tìm kiếm Môn học' : 'Search Subjects'}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <View style={[styles.searchInputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                            placeholder={language === 'vi' ? "Nhập mã Môn (vd: PRF192)" : "Enter Subject Code (e.g. PRF192)"}
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                            autoFocus
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchQuery(''); setResults([]); setHasSearched(false); }}>
                                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Results List */}
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyState}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            </KeyboardAvoidingView>
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
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        zIndex: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            }
        })
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        margin: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
    },
    listContainer: {
        padding: 20,
        flexGrow: 1,
    },
    resultCard: {
        borderRadius: 12,
        padding: 16,
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
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    creditsText: {
        fontSize: 12,
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
        paddingTop: 80,
        paddingHorizontal: 30,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    }
});
