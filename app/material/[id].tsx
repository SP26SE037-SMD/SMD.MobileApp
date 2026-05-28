import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    useColorScheme,
    FlatList,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    useWindowDimensions,
    ViewToken
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import { getMaterialBlocksByMaterialId } from "@/src/services/syllabusService";
import type { MaterialBlock } from "@/src/types";

const MaterialBlockItem = React.memo(({ item, width, colors }: { item: MaterialBlock, width: number, colors: any }) => {
    const isHeading2 = item.blockType === "Heading 2" || item.blockType === "H2";
    const isHeading1 = item.blockType === "Heading 1" || item.blockType === "H1";
    
    let textAlign: "auto" | "left" | "right" | "center" | "justify" = "left";
    if (item.blockStyle) {
        if (item.blockStyle.startsWith("{")) {
            try {
                const styleObj = JSON.parse(item.blockStyle);
                if (styleObj.align && ["left", "right", "center", "justify"].includes(styleObj.align)) {
                    textAlign = styleObj.align as any;
                }
            } catch (e) {
                // Ignore parse error
            }
        } else if (["left", "right", "center", "justify"].includes(item.blockStyle)) {
            textAlign = item.blockStyle as any;
        }
    }

    const tagsStyles = React.useMemo(() => ({
        body: {
            color: colors.textPrimary,
            fontSize: isHeading1 ? 24 : isHeading2 ? 20 : 16,
            fontWeight: (isHeading1 || isHeading2 ? "bold" : "normal") as "bold" | "normal",
            fontStyle: (item.blockStyle === "italic" ? "italic" : "normal") as "italic" | "normal",
            textAlign: textAlign,
        },
        a: {
            color: colors.primary,
            textDecorationLine: "none" as const
        }
    }), [colors.textPrimary, colors.primary, isHeading1, isHeading2, item.blockStyle, textAlign]);

    const source = React.useMemo(() => ({ html: item.contentText }), [item.contentText]);

    return (
        <View style={{ marginBottom: 16 }}>
            <RenderHtml
                contentWidth={width - 40}
                source={source}
                tagsStyles={tagsStyles}
            />
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.item.blockId === nextProps.item.blockId && 
           prevProps.width === nextProps.width &&
           prevProps.colors.textPrimary === nextProps.colors.textPrimary;
});

export default function MaterialDetailScreen() {
    const { id, title } = useLocalSearchParams<{ id: string, title?: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { width } = useWindowDimensions();

    const [blocks, setBlocks] = useState<MaterialBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(1); // API seems to be 1-indexed based on our recent changes
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastVisibleIndex, setLastVisibleIndex] = useState(0);

    const [showToc, setShowToc] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    const colors = {
        background: isDark ? "#121212" : "#f8f9fa",
        card: isDark ? "#1e1e1e" : "#ffffff",
        textPrimary: isDark ? "#ffffff" : "#1f2937",
        textSecondary: isDark ? "#a0a0a0" : "#6b7280",
        primary: "#4f46e5",
        divider: isDark ? "#333333" : "#e5e7eb",
    };

    useEffect(() => {
        if (!id) return;
        fetchInitialBlocks();
    }, [id]);

    const fetchInitialBlocks = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getMaterialBlocksByMaterialId(id as string, 1, 20);
            setBlocks(data.content || []);
            setPage(1);
            setHasMore((data.page + 1) < data.totalPages);
        } catch (err) {
            console.error("[MaterialDetail] Failed to fetch initial blocks:", err);
            setError("Failed to load material blocks.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMoreBlocks = async () => {
        if (!hasMore || isFetchingMore || isLoading) return;

        try {
            setIsFetchingMore(true);
            const nextPage = page + 1;
            const data = await getMaterialBlocksByMaterialId(id as string, nextPage, 20);
            
            const newBlocks = data.content || [];
            setBlocks(prev => {
                const existingIds = new Set(prev.map(b => b.blockId));
                const uniqueNewBlocks = newBlocks.filter(b => !existingIds.has(b.blockId));
                return [...prev, ...uniqueNewBlocks];
            });
            setPage(nextPage);
            setHasMore((data.page + 1) < data.totalPages);
        } catch (err) {
            console.error("[MaterialDetail] Failed to fetch more blocks:", err);
        } finally {
            setIsFetchingMore(false);
        }
    };

    const handleScrollToHeading = (index: number) => {
        setShowToc(false);
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
            }
        }, 300);
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        if (viewableItems.length > 0) {
            const lastItem = viewableItems[viewableItems.length - 1];
            if (lastItem.index !== null) {
                setLastVisibleIndex(lastItem.index);
            }
        }
    }).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 10 }).current;

    useEffect(() => {
        if (blocks.length > 0 && lastVisibleIndex >= blocks.length - 5) {
            fetchMoreBlocks();
        }
    }, [lastVisibleIndex, blocks.length]);

    const renderBlock = React.useCallback(({ item, index }: { item: MaterialBlock, index: number }) => {
        return <MaterialBlockItem item={item} width={width} colors={colors} />;
    }, [width, colors]);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: "center" }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    const heading2Blocks = blocks
        .map((b, index) => ({ ...b, index }))
        .filter(b => b.blockType === "Heading 2" || b.blockType === "H2");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.divider }]}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {title || "Material Details"}
                </Text>
                <TouchableOpacity onPress={() => setShowToc(true)} style={{ padding: 8 }}>
                    <Ionicons name="list-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {error ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                    <Text style={{ color: colors.textSecondary, textAlign: "center" }}>{error}</Text>
                    <TouchableOpacity onPress={fetchInitialBlocks} style={{ marginTop: 16, padding: 12, backgroundColor: colors.primary, borderRadius: 8 }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={blocks}
                    keyExtractor={(item, index) => item.blockId || index.toString()}
                    renderItem={renderBlock}
                    contentContainerStyle={{ padding: 20 }}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            if (flatListRef.current) {
                                flatListRef.current.scrollToIndex({ index: info.index, animated: true });
                            }
                        });
                    }}
                    ListFooterComponent={
                        isFetchingMore ? (
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
                        ) : null
                    }
                    ListEmptyComponent={
                        <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 40 }}>
                            No content available.
                        </Text>
                    }
                />
            )}

            {/* Table of Contents Modal */}
            <Modal visible={showToc} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.divider }]}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Table of Contents</Text>
                            <TouchableOpacity onPress={() => setShowToc(false)}>
                                <Ionicons name="close" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        {heading2Blocks.length > 0 ? (
                            <FlatList
                                data={heading2Blocks}
                                keyExtractor={(item) => item.blockId}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.tocItem, { borderBottomColor: colors.divider }]}
                                        onPress={() => handleScrollToHeading(item.index)}
                                    >
                                        <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                                            {item.contentText.replace(/<[^>]+>/g, '').trim()}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <Text style={{ color: colors.textSecondary, padding: 20, textAlign: "center" }}>
                                No headings found.
                            </Text>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        height: "70%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 16,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    tocItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
});
