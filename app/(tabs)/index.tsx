import { searchSubjects } from "@/src/services/subjectService";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import type { Subject } from "@/src/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Colors for suggested subjects
const COLORS = [
  "#059669",
  "#0D9488",
  "#7C3AED",
  "#EA580C",
  "#16A34A",
  "#0EA5E9",
];

interface SuggestedSubject {
  id: string;
  code: string;
  name: string;
  credits: number;
  color: string;
}

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { unreadCount, notifications, markAsRead } = useNotificationStore();

  // Fetch suggested subjects from API


  const colors = {
    background: isDark ? "#0F172A" : "#F1F5F9",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    textPrimary: isDark ? "#F1F5F9" : "#1E293B",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#10B981" : "#059669",
    primaryBg: isDark ? "rgba(16,185,129,0.12)" : "rgba(5,150,105,0.08)",
    iconBg: isDark ? "#1E293B" : "#F8FAFC",
    iconBorder: isDark ? "#334155" : "#E2E8F0",
    searchBg: isDark ? "#1E293B" : "#FFFFFF",
    tealBg: isDark ? "rgba(20,184,166,0.12)" : "rgba(20,184,166,0.08)",
    teal: isDark ? "#2DD4BF" : "#0D9488",
    purpleBg: isDark ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)",
    purple: isDark ? "#A78BFA" : "#7C3AED",
    orangeBg: isDark ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.08)",
    orange: isDark ? "#FB923C" : "#EA580C",
    greenBg: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)",
    green: isDark ? "#4ADE80" : "#16A34A",
    changeBg: isDark ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.08)",
    taskBg: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)",
  };

  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Section */}
        <View
          style={{
            backgroundColor: isDark ? "#1E3A5F" : "#059669",
            marginHorizontal: 16,
            marginTop: 8,
            borderRadius: 24,
            padding: 24,
            paddingBottom: 28,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Decorative Elements */}
          <View
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -40,
              left: -20,
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 20,
              right: 80,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 30,
              right: 40,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.25)",
            }}
          />

          {/* Top Row: Icons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 20,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowNotificationsModal(true)}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "#F43F5E",
                    borderRadius: 10,
                    minWidth: 16,
                    height: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                    borderWidth: 1.5,
                    borderColor: isDark ? "#0F172A" : "#FFFFFF",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 9, fontWeight: "bold" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/qr-scanner")}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="qr-code-outline" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/settings")}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="settings-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Greeting Content */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon Container */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Image 
                source={require("@/assets/images/logo/logo-without-name.png")}
                style={{ width: "100%", height: "100%", borderRadius: 16, resizeMode: "contain" }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: "white",
                  letterSpacing: -0.5,
                  marginBottom: 4,
                }}
              >
                {"Hello! 👋"}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: "500",
                }}
              >
                {"Ready to explore new knowledge?"}
              </Text>
            </View>
          </View>
        </View>

        {/* Suggested Subjects - Horizontal Scroll */}
        <View style={{ marginTop: 24, marginBottom: 28 }}>
          <Text
            style={{
              paddingHorizontal: 16,
              fontSize: 18,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            {"Explore"}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "row", gap: 14, paddingHorizontal: 16 }}
          >
            {/* Tìm Curriculum Card */}
            <TouchableOpacity
              onPress={() => router.push("/search-curriculum")}
              activeOpacity={0.85}
              style={{
                width: 160,
                backgroundColor: colors.card,
                borderRadius: 18,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.05,
                shadowRadius: 12,
                elevation: isDark ? 0 : 3,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: colors.primaryBg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <MaterialIcons
                  name="menu-book"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                {"Find Curriculum"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                {"Explore training programs"}
              </Text>
            </TouchableOpacity>

            {/* Tìm Môn Học Card */}
            <TouchableOpacity
              onPress={() => router.push("/search-subject")}
              activeOpacity={0.85}
              style={{
                width: 160,
                backgroundColor: colors.card,
                borderRadius: 18,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0 : 0.05,
                shadowRadius: 12,
                elevation: isDark ? 0 : 3,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: colors.tealBg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <MaterialIcons name="science" size={24} color={colors.teal} />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                {"Find Subject"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                {"Lookup subject information"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            {"Recent Activity"}
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 18,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.05,
              shadowRadius: 12,
              elevation: isDark ? 0 : 3,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.primaryBg,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <MaterialIcons name="history" size={28} color={colors.primary} />
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: colors.textPrimary,
                marginBottom: 4,
              }}
            >
              {"No recent activities"}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {"Start exploring curriculum\nand your favorite subjects!"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={() => setShowNotificationsModal(false)}
        >
          <View
            style={{
              position: "absolute",
              top: 100, // Below header
              right: 20,
              left: 20,
              backgroundColor: colors.card,
              borderRadius: 20,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 20,
              elevation: 10,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
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
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.textPrimary,
                }}
              >
                {"New Notifications"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowNotificationsModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            
            {notifications.slice(0, 3).length === 0 ? (
                <View style={{ paddingVertical: 40, alignItems: "center" }}>
                   <Text style={{ color: colors.textSecondary, fontSize: 15 }}>No new notifications</Text>
                </View>
            ) : notifications.slice(0, 3).map((notification, index) => {
              const isStatusType = notification.code === "BROADCAST_SYSTEM" || notification.code === "EVENT_TASK";
              return (
              <TouchableOpacity
                key={notification.notificationId}
                activeOpacity={0.7}
                onPress={() => {
                   if (!notification.isRead) markAsRead(notification.notificationId);
                }}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  borderBottomWidth:
                    index === notifications.slice(0, 3).length - 1 ? 0 : 1,
                  borderBottomColor: colors.cardBorder,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor:
                      isStatusType
                        ? colors.taskBg
                        : colors.changeBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  <MaterialIcons
                    name={
                      isStatusType ? "task-alt" : "notifications"
                    }
                    size={18}
                    color={
                      isStatusType ? "#16A34A" : "#EA580C"
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                        fontWeight: notification.isRead ? "500" : "600",
                        color: colors.textPrimary,
                        flex: 1,
                      }}
                    >
                      {notification.title || "Thông báo hệ thống"}
                    </Text>
                    {!notification.isRead && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: colors.primary,
                          marginLeft: 6,
                        }}
                      />
                    )}
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      lineHeight: 18,
                      marginBottom: 4,
                    }}
                  >
                    {notification.message}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : "Vừa xong"}
                  </Text>
                </View>
              </TouchableOpacity>
            )})}


            <TouchableOpacity
              onPress={() => {
                setShowNotificationsModal(false);
                router.push("/notifications");
              }}
              activeOpacity={0.8}
              style={{
                marginTop: 16,
                backgroundColor: colors.primaryBg,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {"View All"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
