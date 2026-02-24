import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { useWishlistStore } from "@/src/store/useWishlistStore";
import { MOCK_SYLLABUSES } from "@/src/constants/mockData";

// Colors for suggested subjects
const COLORS = ["#2563EB", "#0D9488", "#7C3AED", "#EA580C", "#16A34A", "#0EA5E9"];

// Map mock syllabus to the format required by the UI
const getSuggestedSubjects = (lang: string) => MOCK_SYLLABUSES.slice(0, 6).map((syl, index) => ({
  id: syl.id,
  code: syl.subjectCode,
  name: lang === 'vi' ? syl.name : (syl.englishName || syl.name),
  credits: syl.credits,
  color: COLORS[index % COLORS.length]
}));

export default function DashboardScreen() {
  const { language } = useSettingsStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = {
    background: isDark ? "#0F172A" : "#F1F5F9",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    textPrimary: isDark ? "#F1F5F9" : "#1E293B",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#3B82F6" : "#2563EB",
    primaryBg: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.08)",
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

  const RECENT_NOTIFICATIONS = [
    {
      id: "1",
      type: "change",
      title: "Cập nhật Curriculum CNTT",
      message: "Chương trình đào tạo CNTT 2024 đã được cập nhật lịch học mới.",
      time: "5 phút trước",
      read: false,
    },
    {
      id: "2",
      type: "task",
      title: "Đăng ký môn học sắp đến hạn",
      message: "Thời gian đăng ký môn học kỳ 2 sẽ kết thúc vào 28/02.",
      time: "15 phút trước",
      read: false,
    },
    {
      id: "3",
      type: "change",
      title: "Thay đổi lịch thi",
      message: "Lịch thi môn Trí tuệ nhân tạo chuyển sang 15/03.",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: "4",
      type: "task",
      title: "Nhắc nhở nộp bài tập",
      message: "Bài tập môn Học máy cần được nộp trước 01/03.",
      time: "2 giờ trước",
      read: true,
    },
    {
      id: "5",
      type: "change",
      title: "Phòng học thay đổi",
      message: "Phát triển ứng dụng di động sang phòng A305.",
      time: "3 giờ trước",
      read: true,
    },
  ];

  const bookmarkedSubjects = useWishlistStore(state => state.bookmarkedSubjects);
  const toggleBookmark = useWishlistStore(state => state.toggleBookmark);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 20,
          }}
        >
          {/* Greeting */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "700",
                color: colors.textPrimary,
                letterSpacing: -0.5,
              }}
            >
              {language === 'vi' ? 'Chào bạn! 👋' : 'Hello! 👋'}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: colors.textSecondary,
                marginTop: 4,
                fontWeight: "400",
              }}
            >
              {language === 'vi' ? 'Chúc bạn một ngày vui vẻ' : 'Have a great day'}
            </Text>
          </View>

          {/* Action Icons */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowNotificationsModal(true)}
              activeOpacity={0.7}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: colors.iconBg,
                borderWidth: 1,
                borderColor: colors.iconBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.textPrimary}
              />
              {/* Notification badge */}
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#EF4444",
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/qr-scanner")}
              activeOpacity={0.7}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: colors.iconBg,
                borderWidth: 1,
                borderColor: colors.iconBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="qr-code-outline"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/settings")}
              activeOpacity={0.7}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: colors.iconBg,
                borderWidth: 1,
                borderColor: colors.iconBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggested Subjects - Horizontal Scroll */}
        <View style={{ marginBottom: 28 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 24,
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                letterSpacing: -0.3,
              }}
            >
              {language === 'vi' ? 'Gợi ý học kỳ này' : 'Suggested this semester'}
            </Text>
          </View>

          <FlatList
            data={getSuggestedSubjects(language)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: "/subject/[code]", params: { code: item.code } } as any)}
                style={{
                  width: 220,
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  padding: 18,
                  marginHorizontal: 6,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0 : 0.06,
                  shadowRadius: 12,
                  elevation: isDark ? 0 : 3,
                }}
              >
                {/* Code badge */}
                <View
                  style={{
                    backgroundColor: item.color + (isDark ? "20" : "12"),
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                    alignSelf: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: item.color,
                    }}
                  >
                    {item.code}
                  </Text>
                </View>

                {/* Subject Name */}
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: colors.textPrimary,
                    marginBottom: 8,
                    lineHeight: 21,
                  }}
                >
                  {item.name}
                </Text>

                {/* Credits */}
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    marginBottom: 16,
                  }}
                >
                  {item.credits} {language === 'vi' ? 'tín chỉ' : 'credits'}
                </Text>

                {/* Wishlist Star Button */}
                <TouchableOpacity
                  onPress={() => toggleBookmark(item.code)}
                  activeOpacity={0.7}
                  style={{
                    alignSelf: "flex-end",
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: bookmarkedSubjects.includes(item.code)
                      ? "rgba(245,158,11,0.15)"
                      : isDark
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={bookmarkedSubjects.includes(item.code) ? "star" : "star-outline"}
                    size={20}
                    color={bookmarkedSubjects.includes(item.code) ? "#F59E0B" : colors.textSecondary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            {language === 'vi' ? 'Khám phá' : 'Explore'}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row", gap: 14 }}>
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
                {language === 'vi' ? 'Tìm Curriculum' : 'Find Curriculum'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                {language === 'vi' ? 'Khám phá chương trình đào tạo' : 'Explore training programs'}
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
                <MaterialIcons
                  name="science"
                  size={24}
                  color={colors.teal}
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
                {language === 'vi' ? 'Tìm Môn Học' : 'Find Subject'}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}
              >
                {language === 'vi' ? 'Tra cứu thông tin môn học' : 'Lookup subject information'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            {language === 'vi' ? 'Hoạt động gần đây' : 'Recent Activity'}
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
              <MaterialIcons
                name="history"
                size={28}
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
              {language === 'vi' ? 'Chưa có hoạt động nào' : 'No recent activities'}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {language === 'vi' ? 'Hãy bắt đầu tìm kiếm curriculum\nhoặc môn học yêu thích!' : 'Start exploring curriculum\nand your favorite subjects!'}
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
                {language === 'vi' ? 'Thông báo mới' : 'New Notifications'}
              </Text>
              <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {RECENT_NOTIFICATIONS.map((notification, index) => (
              <TouchableOpacity
                key={notification.id}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  paddingVertical: 12,
                  borderBottomWidth:
                    index === RECENT_NOTIFICATIONS.length - 1 ? 0 : 1,
                  borderBottomColor: colors.cardBorder,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor:
                      notification.type === "change"
                        ? colors.changeBg
                        : colors.taskBg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  <MaterialIcons
                    name={
                      notification.type === "change" ? "swap-horiz" : "task-alt"
                    }
                    size={18}
                    color={
                      notification.type === "change" ? "#EA580C" : "#16A34A"
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
                      style={{
                        fontSize: 14,
                        fontWeight: notification.read ? "500" : "600",
                        color: colors.textPrimary,
                        flex: 1,
                      }}
                    >
                      {notification.title}
                    </Text>
                    {!notification.read && (
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
                    {notification.time}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

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
                {language === 'vi' ? 'Xem tất cả' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView >
  );
}
