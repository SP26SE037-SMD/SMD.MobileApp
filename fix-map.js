const fs = require('fs');
let content = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');

const mappingReplacement = `
            {notifications.slice(0, 3).length === 0 ? (
                <View style={{ paddingVertical: 20, alignItems: "center" }}>
                   <Text style={{ color: colors.textSecondary }}>Không có thông báo mới</Text>
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
`;

const startIndex = content.indexOf('{RECENT_NOTIFICATIONS.map');
// find the end of this mapping which we know ends soon before the "View All" button.
const viewAllIndex = content.indexOf('router.push("/notifications");');

if (startIndex !== -1 && viewAllIndex !== -1) {
    // we need to find the `</TouchableOpacity>` and `))}` just before the viewAll button.
    const beforeViewAll = content.substring(startIndex, viewAllIndex);
    const endIndex = startIndex + beforeViewAll.lastIndexOf('))}') + 3;
    content = content.substring(0, startIndex) + mappingReplacement + content.substring(endIndex);
}

// Make sure destructuring is correct
content = content.replace('const { unreadCount } = useNotificationStore();', 'const { unreadCount, notifications, markAsRead } = useNotificationStore();');


fs.writeFileSync('app/(tabs)/index.tsx', content);
