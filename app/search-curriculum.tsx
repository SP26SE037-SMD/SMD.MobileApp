import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MOCK_CURRICULUMS } from "@/src/constants/mockData";

export default function SearchCurriculumScreen() {
    
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [searchQuery, setSearchQuery] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<typeof MOCK_CURRICULUMS>([]);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setHasSearched(false);
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = MOCK_CURRICULUMS.filter(
            (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
        );

        setSearchResults(results);
        setHasSearched(true);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setHasSearched(false);
        setSearchResults([]);
    };

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        card: isDark ? "#1E293B" : "#FFFFFF",
        cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        divider: isDark ? "#334155" : "#E2E8F0",
        searchBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    };

    const RECENT_SEARCHES = [
        "Công nghệ phần mềm",
        "Chương trình kỹ sư cầu nối",
        "Khoa học máy tính",
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header with Search Input */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    gap: 12,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    style={{ padding: 4 }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.searchBg,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        height: 44,
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                    }}
                >
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={{
                            flex: 1,
                            marginLeft: 8,
                            fontSize: 15,
                            color: colors.textPrimary,
                            height: "100%",
                        }}
                        placeholder={"Search curriculum..."}
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            if (text.length === 0) {
                                setHasSearched(false);
                            }
                        }}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch} style={{ padding: 4 }}>
                            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Recent Searches (Only show if query is empty) */}
                {searchQuery.length === 0 ? (
                    <View style={{ padding: 20 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: colors.textPrimary,
                                }}
                            >
                                {"Recent searches"}
                            </Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: "600",
                                        color: colors.textSecondary,
                                    }}
                                >
                                    {"Clear all"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {RECENT_SEARCHES.map((search, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setSearchQuery(search);
                                    // Need to defer handleSearch to allow state to update first, or duplicate logic
                                    const query = search.toLowerCase();
                                    const results = MOCK_CURRICULUMS.filter(
                                        (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
                                    );
                                    setSearchResults(results);
                                    setHasSearched(true);
                                }}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 14,
                                    borderBottomWidth: index === RECENT_SEARCHES.length - 1 ? 0 : 1,
                                    borderBottomColor: colors.cardBorder,
                                }}
                            >
                                <MaterialIcons name="history" size={20} color={colors.textSecondary} />
                                <Text
                                    style={{
                                        flex: 1,
                                        marginLeft: 12,
                                        fontSize: 15,
                                        color: colors.textPrimary,
                                    }}
                                >
                                    {search}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : hasSearched ? (
                    /* Search Results */
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary, marginBottom: 16 }}>
                            {`Results for '${searchQuery}'`}
                        </Text>

                        {searchResults.length > 0 ? (
                            searchResults.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.7}
                                    onPress={() => router.push({ pathname: "/curriculum/[id]", params: { id: item.id } } as any)}
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
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>
                                            {(item.englishName || item.name)}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <Text style={{ fontSize: 13, color: colors.primary, fontWeight: "500" }}>
                                                {item.code}
                                            </Text>
                                            <Text style={{ fontSize: 13, color: colors.textSecondary, marginLeft: 8 }}>
                                                • {item.department} • {item.credits} {'credits'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={{ padding: 40, alignItems: "center" }}>
                                <Ionicons name="search-outline" size={48} color={colors.cardBorder} />
                                <Text
                                    style={{
                                        marginTop: 16,
                                        fontSize: 15,
                                        color: colors.textSecondary,
                                        textAlign: "center",
                                    }}
                                >
                                    {"No matching curriculums found."}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    /* Search Placeholder (typing but haven't pressed enter) */
                    <View style={{ padding: 40, alignItems: "center" }}>
                        <MaterialIcons name="menu-book" size={48} color={colors.cardBorder} />
                        <Text
                            style={{
                                marginTop: 16,
                                fontSize: 15,
                                color: colors.textSecondary,
                                textAlign: "center",
                            }}
                        >
                            {`Press Search to find '${searchQuery}'...`}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
