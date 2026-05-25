import { searchCurriculums } from "@/src/services/curriculumService";
import type { Curriculum } from "@/src/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchCurriculumScreen() {

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState<"code" | "name" | "all">("all");
    const [results, setResults] = useState<Curriculum[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination state
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        divider: isDark ? "#334155" : "#E2E8F0",
        searchBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
        toggleBg: isDark ? "#0F172A" : "#F1F5F9",
        toggleActiveBg: isDark ? "#10B981" : "#059669",
        inputBg: isDark ? "#1E293B" : "#FFFFFF",
        border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    };

    const fetchCurriculums = async (currentPage: number = 0, isLoadMore = false) => {
        if (isLoadMore) {
            setIsFetchingMore(true);
        } else {
            setIsLoading(true);
        }
        setErrorMessage(null);

        try {
            const response = await searchCurriculums({
                search: searchQuery.trim(),
                searchBy: searchQuery.trim() ? searchBy : "all",
                status: "PUBLISHED",
                page: currentPage,
                size: 15,
            });

            if (response && response.content) {
                if (isLoadMore) {
                    setResults(prev => [...prev, ...response.content]);
                } else {
                    setResults(response.content);
                }
                setTotalPages(response.totalPages);
                setPage(currentPage);
            } else {
                if (!isLoadMore) setResults([]);
            }
        } catch (error: any) {
            console.error("[SearchCurriculum] API Error:", error);
            if (!isLoadMore) setResults([]);
            if (error?.response?.status === 403) {
                setErrorMessage("Your account does not have permission to search curriculums.");
            } else {
                setErrorMessage(error?.response?.data?.message || error?.message || "Failed to search. Please try again.");
            }
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        fetchCurriculums(0);
    }, []);

    const handleSearch = () => {
        fetchCurriculums(0, false);
    };

    const handleLoadMore = () => {
        if (!isLoading && !isFetchingMore && page < totalPages - 1) {
            fetchCurriculums(page + 1, true);
        }
    };

    const renderEmptyState = () => {
        if (isLoading) return null;
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 }}>
                {errorMessage ? (
                    <>
                        <Ionicons name="alert-circle-outline" size={60} color="#F59E0B" style={{ opacity: 0.5, marginBottom: 16 }} />
                        <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", color: "#F59E0B", paddingHorizontal: 20 }}>
                            {errorMessage}
                        </Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                        <Text style={{ fontSize: 15, fontWeight: "500", textAlign: "center", color: colors.textSecondary }}>
                            {"No curriculums found"}
                        </Text>
                    </>
                )}
            </View>
        );
    };

    const renderItem = ({ item }: { item: Curriculum }) => (
        <TouchableOpacity
            key={item.curriculumId}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: "/curriculum/[id]", params: { id: item.curriculumId } } as any)}
            style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>
                    {item.curriculumName || item.englishName || item.displayName || item.curriculumCode}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: "wrap", gap: 6 }}>
                    <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "500" }}>
                        {item.curriculumCode}
                    </Text>
                    {(item.major?.majorCode || item.department) && (
                        <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                            • {item.major?.majorCode || item.department}
                        </Text>
                    )}
                    {item.status && (
                        <Text style={{ fontSize: 13, color: item.status === "PUBLISHED" ? "#16A34A" : colors.textSecondary }}>
                            • {item.status}
                        </Text>
                    )}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                }}
            >
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.textPrimary }}>
                    {"Search Curriculums"}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                
                <View style={{ backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
                    {/* Toggle searchBy */}
                    <View style={{ flexDirection: "row", borderRadius: 8, padding: 4, marginBottom: 16, backgroundColor: colors.toggleBg }}>
                        {(["code", "name", "all"] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    paddingVertical: 8,
                                    borderRadius: 6,
                                    backgroundColor: searchBy === type ? colors.toggleActiveBg : "transparent",
                                }}
                                onPress={() => setSearchBy(type)}
                                activeOpacity={0.8}
                            >
                                <Ionicons 
                                    name={type === "code" ? "code-slash-outline" : type === "name" ? "text-outline" : "options-outline"} 
                                    size={14} 
                                    color={searchBy === type ? "#FFFFFF" : colors.textSecondary} 
                                    style={{ marginRight: 5 }} 
                                />
                                <Text style={{ fontSize: 13, fontWeight: "600", color: searchBy === type ? "#FFFFFF" : colors.textSecondary, textTransform: "capitalize" }}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Search Input */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 48,
                        backgroundColor: colors.inputBg,
                        borderColor: colors.border
                    }}>
                        <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
                        <TextInput
                            style={{ flex: 1, fontSize: 15, height: "100%", color: colors.textPrimary }}
                            placeholder={`Enter curriculum ${searchBy === 'all' ? 'code or name' : searchBy}...`}
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    setSearchQuery("");
                                    fetchCurriculums(0, false);
                                }}
                                style={{ padding: 4 }}
                            >
                                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Results List */}
                <View style={{ flex: 1 }}>
                    {isLoading ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ marginTop: 12, fontSize: 14, color: colors.textSecondary }}>Searching...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={results}
                            keyExtractor={(item) => item.curriculumId}
                            renderItem={renderItem}
                            contentContainerStyle={{ padding: 20, flexGrow: 1 }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={renderEmptyState}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <View style={{ paddingVertical: 20, alignItems: "center" }}>
                                        <ActivityIndicator size="small" color={colors.primary} />
                                    </View>
                                ) : null
                            }
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
