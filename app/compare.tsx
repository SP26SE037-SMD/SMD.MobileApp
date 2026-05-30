import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// MOCK DATA FOR UI DESIGN
const mockChanges = [
    {
        section: "Basic Information",
        items: [
            { field: "Credits", old: "2", new: "3", status: "MODIFIED" },
            { field: "Time Allocation", old: "0 Theory - 30 Practical - 30 Self Study", new: "10 Theory - 20 Practical - 30 Self Study", status: "MODIFIED" },
            { field: "Degree Level", old: "Bachelor", new: "Bachelor", status: "UNCHANGED" },
        ]
    },
    {
        section: "CLOs",
        items: [
            { field: "CLO1 - Demonstrate basic skills", old: "Bloom: Understand", new: "Bloom: Understand", status: "UNCHANGED" },
            { field: "CLO2 - Advanced techniques", old: "Bloom: Apply", new: "Bloom: Analyze", status: "MODIFIED" },
            { field: "CLO3 - Teamwork & Leadership", old: null, new: "Bloom: Evaluate", status: "ADDED" },
            { field: "CLO4 - History of sports", old: "Bloom: Remember", new: null, status: "REMOVED" },
        ]
    },
    {
        section: "Materials",
        items: [
            { field: "Textbook 1", old: "Edition 2021", new: "Edition 2024", status: "MODIFIED" },
            { field: "Reference Document A", old: "Available", new: null, status: "REMOVED" },
        ]
    }
];

export default function CompareSyllabusScreen() {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [activeFilter, setActiveFilter] = useState<"ALL" | "MODIFIED" | "ADDED" | "REMOVED">("ALL");

    const colors = {
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        textPrimary: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        primary: isDark ? "#10B981" : "#059669",
        divider: isDark ? "#334155" : "#E2E8F0",
        addedBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
        addedText: isDark ? "#34D399" : "#059669",
        removedBg: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
        removedText: isDark ? "#F87171" : "#DC2626",
        modifiedBg: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)",
        modifiedText: isDark ? "#FBBF24" : "#D97706",
    };

    const renderChangeBadge = (status: string) => {
        let bgColor, textColor, label, icon;
        switch (status) {
            case "ADDED":
                bgColor = colors.addedBg;
                textColor = colors.addedText;
                label = "Added";
                icon = "add-circle";
                break;
            case "REMOVED":
                bgColor = colors.removedBg;
                textColor = colors.removedText;
                label = "Removed";
                icon = "remove-circle";
                break;
            case "MODIFIED":
                bgColor = colors.modifiedBg;
                textColor = colors.modifiedText;
                label = "Modified";
                icon = "create";
                break;
            default:
                return null;
        }

        return (
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: bgColor, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                <Ionicons name={icon as any} size={12} color={textColor} style={{ marginRight: 4 }} />
                <Text style={{ color: textColor, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{label}</Text>
            </View>
        );
    };

    const filteredData = mockChanges.map(section => {
        const filteredItems = section.items.filter(item => {
            if (activeFilter === "ALL") return true;
            return item.status === activeFilter;
        });
        return { ...section, items: filteredItems };
    }).filter(section => section.items.length > 0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.divider }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "800", color: colors.textPrimary }}>Compare Syllabus</Text>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>Changes from previous version</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                    {(["ALL", "MODIFIED", "ADDED", "REMOVED"] as const).map(filter => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor: activeFilter === filter ? colors.primary : (isDark ? "#1E293B" : "#E2E8F0"),
                            }}
                        >
                            <Text style={{ 
                                fontSize: 13, 
                                fontWeight: "600", 
                                color: activeFilter === filter ? "#FFFFFF" : colors.textSecondary 
                            }}>
                                {filter === "ALL" ? "All Changes" : filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Changes List */}
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                {filteredData.length === 0 ? (
                    <View style={{ alignItems: "center", marginTop: 40 }}>
                        <Ionicons name="checkmark-circle-outline" size={60} color={colors.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                        <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: "500" }}>No changes found.</Text>
                    </View>
                ) : (
                    filteredData.map((section, index) => (
                        <View key={index} style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 12 }}>
                                {section.section}
                            </Text>
                            
                            <View style={{ backgroundColor: colors.card, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.divider }}>
                                {section.items.map((item, i) => (
                                    <View key={i} style={{ padding: 16, borderBottomWidth: i === section.items.length - 1 ? 0 : 1, borderBottomColor: colors.divider }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary, flex: 1, marginRight: 12 }}>
                                                {item.field}
                                            </Text>
                                            {renderChangeBadge(item.status)}
                                        </View>
                                        
                                        {item.status === "MODIFIED" && (
                                            <View style={{ gap: 8, marginTop: 8 }}>
                                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                                    <View style={{ width: 20, alignItems: "center", marginRight: 8 }}>
                                                        <Ionicons name="remove" size={16} color={colors.removedText} />
                                                    </View>
                                                    <Text style={{ flex: 1, fontSize: 14, color: colors.removedText, textDecorationLine: "line-through", opacity: 0.8 }}>
                                                        {item.old}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                                                    <View style={{ width: 20, alignItems: "center", marginRight: 8 }}>
                                                        <Ionicons name="add" size={16} color={colors.addedText} />
                                                    </View>
                                                    <Text style={{ flex: 1, fontSize: 14, color: colors.addedText }}>
                                                        {item.new}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {item.status === "ADDED" && (
                                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
                                                <Ionicons name="add" size={16} color={colors.addedText} style={{ marginRight: 8 }} />
                                                <Text style={{ flex: 1, fontSize: 14, color: colors.addedText }}>{item.new}</Text>
                                            </View>
                                        )}

                                        {item.status === "REMOVED" && (
                                            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 4 }}>
                                                <Ionicons name="remove" size={16} color={colors.removedText} style={{ marginRight: 8 }} />
                                                <Text style={{ flex: 1, fontSize: 14, color: colors.removedText, textDecorationLine: "line-through" }}>{item.old}</Text>
                                            </View>
                                        )}

                                        {item.status === "UNCHANGED" && (
                                            <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>{item.old}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
