import { searchSubjects } from "@/src/services/subjectService";
import type { Subject } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState, useRef } from "react";
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
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchSubjectScreen() {
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"code" | "name">("code");
  const [results, setResults] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const windowWidth = Dimensions.get('window').width;
  const tabWidth = (windowWidth - 40) / 2; // 40 is the horizontal padding of searchContainer
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: searchBy === "name" ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [searchBy]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const colors = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    textPrimary: isDark ? "#F1F5F9" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#10B981" : "#059669",
    primaryBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.08)",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    inputBg: isDark ? "#1E293B" : "#FFFFFF",
    toggleBg: isDark ? "#0F172A" : "#F1F5F9",
    toggleActiveBg: isDark ? "#10B981" : "#059669",
  };

  const fetchSubjects = async (currentPage: number = 0, isLoadMore = false) => {
    if (isLoadMore) {
        setIsFetchingMore(true);
    } else {
        setIsLoading(true);
    }

    try {
      // API expects empty string instead of undefined when not filled
      // We do not need to send searchBy if searchQuery is empty to get all
      const response = await searchSubjects({
          search: searchQuery.trim(),
          searchBy: searchQuery.trim() ? searchBy : "all" as any,
          status: "COMPLETED",
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
    } catch (error) {
      console.error("[SearchSubject] API Error:", error);
      if (!isLoadMore) setResults([]);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
     fetchSubjects(0);
  }, []);

  const handleSearch = () => {
    fetchSubjects(0, false);
  };

  const handleLoadMore = () => {
      if (!isLoading && !isFetchingMore && page < totalPages - 1) {
          fetchSubjects(page + 1, true);
      }
  };

  const renderEmptyState = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={60} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {"No subjects found"}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() =>
        router.push({ pathname: "/subject/[code]", params: { code: item.subjectCode } } as any)
      }
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={[styles.itemName, { color: colors.textPrimary }]} numberOfLines={2}>
            {item.subjectName}
          </Text>
          <Text style={[styles.itemCode, { color: colors.primary }]}>{item.subjectCode}</Text>
        </View>
        {item.credits != null && (
          <View style={[styles.creditsBadge, { backgroundColor: colors.primaryBg }]}>
            <Text style={[styles.creditsText, { color: colors.primary }]}>
              {item.credits} {"Credit"}
            </Text>
          </View>
        )}
      </View>

      {(item.degreeLevel || item.status) && (
        <View style={styles.itemFooter}>
          {item.degreeLevel && (
            <View style={styles.footerInfo}>
              <Ionicons name="bar-chart-outline" size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>{item.degreeLevel}</Text>
            </View>
          )}
          {item.status && (
            <View style={styles.footerInfo}>
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color={item.status === "COMPLETED" ? "#16A34A" : colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.footerText, { color: item.status === "COMPLETED" ? "#16A34A" : colors.textSecondary }]}>
                {item.status}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {"Search Subjects"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* Search Section */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {/* Underline Tabs */}
          <View style={[styles.toggleWrapper, { borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }]}>
            {/* Sliding Indicator */}
            <Animated.View
               style={{
                 position: "absolute",
                 bottom: -1, // Overlaps the wrapper's border
                 left: 0,
                 width: tabWidth,
                 height: 2,
                 backgroundColor: colors.primary,
                 transform: [
                   {
                     translateX: slideAnim.interpolate({
                       inputRange: [0, 1],
                       outputRange: [0, tabWidth]
                     })
                   }
                 ]
               }}
            />

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setSearchBy("code")}
              activeOpacity={0.8}
            >
              <Ionicons name="code-slash-outline" size={16} color={searchBy === "code" ? colors.primary : colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.toggleText, { color: searchBy === "code" ? colors.primary : colors.textSecondary }]}>
                By Code
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setSearchBy("name")}
              activeOpacity={0.8}
            >
              <Ionicons name="text-outline" size={16} color={searchBy === "name" ? colors.primary : colors.textSecondary} style={{ marginRight: 6 }} />
              <Text style={[styles.toggleText, { color: searchBy === "name" ? colors.primary : colors.textSecondary }]}>
                By Name
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={[styles.searchInputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder={searchBy === "code" ? "Enter subject code (e.g. PRF192)" : "Enter subject name"}
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
                  fetchSubjects(0, false); // Reload all after clear
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results List */}
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Searching...</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.subjectId}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  toggleWrapper: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1, // Overlaps the wrapper's border
  },
  toggleActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: { fontSize: 14, fontWeight: "700" },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, height: "100%" },
  clearButton: { padding: 4 },
  listContent: { padding: 20, flexGrow: 1 },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 6, lineHeight: 22 },
  itemCode: { fontSize: 14, fontWeight: "500" },
  creditsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  creditsText: { fontSize: 12, fontWeight: "600" },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(150,150,150,0.1)",
  },
  footerInfo: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  footerText: { fontSize: 12, fontWeight: "500" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 14 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 15, fontWeight: "500", textAlign: "center" },
});
