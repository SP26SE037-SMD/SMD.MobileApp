import React, { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, useColorScheme, StyleSheet, ScrollView, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

import {
  getCurriculumById,
  getSemesterMappings,
  getGroupById,
} from "@/src/services/curriculumService";
import { getSubjectById } from "@/src/services/subjectService";
import type { Curriculum, Group, SemesterMapping, Subject } from "@/src/types";

export default function CurriculumGraphScreen() {
  const { curriculumId: id } = useLocalSearchParams<{ curriculumId: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLoading, setIsLoading] = useState(true);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [semesters, setSemesters] = useState<SemesterMapping[]>([]);
  const [groupDetails, setGroupDetails] = useState<Record<string, Group>>({});
  const [error, setError] = useState<string | null>(null);

  // Subject Modal states
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState<Subject | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [showConnections, setShowConnections] = useState(false);

  // Elective Group Modal states
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [selectedGroupSubjects, setSelectedGroupSubjects] = useState<any[]>([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");

  // SVG Connection states
  const [showGlobalConnections, setShowGlobalConnections] = useState(false);
  const [semLayouts, setSemLayouts] = useState<Record<number, number>>({});
  const [cardLayouts, setCardLayouts] = useState<Record<string, { x: number, y: number, w: number, h: number }>>({});

  const colors = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    textPrimary: isDark ? "#F1F5F9" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    primary: isDark ? "#10B981" : "#059669",
    primaryBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.08)",
    divider: isDark ? "#334155" : "#E2E8F0",
    alertText: isDark ? "#FCA5A5" : "#EF4444",
    electiveBg: isDark ? "rgba(168, 85, 247, 0.15)" : "rgba(219, 234, 254, 0.8)",
    electiveText: isDark ? "#C084FC" : "#2563eb",
    electiveBorder: isDark ? "#8b5cf6" : "#3b82f6",
    subjectBorder: isDark ? "#22c55e" : "#22c55e",
    subjectBg: isDark ? "#1E293B" : "#ffffff",
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [currData, semData] = await Promise.all([
          getCurriculumById(id as string),
          getSemesterMappings(id as string),
        ]);

        setCurriculum(currData);

        const sems = semData.semesterMappings || [];
        sems.sort((a, b) => (a.semester ?? (a as any).semesterNo ?? 0) - (b.semester ?? (b as any).semesterNo ?? 0));
        setSemesters(sems);

        // Fetch groups
        const groupIds = new Set<string>();
        sems.forEach((sem) => {
          (sem.subjects || []).forEach((sub) => {
            const gId = sub.groupId || sub.electiveGroupId;
            if (gId) {
              groupIds.add(gId);
            }
          });
        });

        if (groupIds.size > 0) {
          const groupPromises = Array.from(groupIds).map((gId) => getGroupById(gId));
          const groupResults = await Promise.allSettled(groupPromises);
          const groupMap: Record<string, Group> = {};
          groupResults.forEach((res) => {
            if (res.status === "fulfilled") {
              groupMap[res.value.groupId] = res.value;
            }
          });
          setGroupDetails(groupMap);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load map data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const openSubjectModal = async (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setShowConnections(false);
    setIsModalVisible(true);
    setIsModalLoading(true);
    try {
        const fullSubject = await getSubjectById(subjectId);
        setModalData(fullSubject);
    } catch (error) {
        console.error("Error fetching subject details:", error);
    } finally {
        setIsModalLoading(false);
    }
  };

  const getUnlocks = (subjectCode: string) => {
    const unlocks: string[] = [];
    semesters.forEach(sem => {
      (sem.subjects || []).forEach(s => {
        const prereqs = s.prerequisiteSubjectCodes || (s.prerequisiteSubjectCode ? [s.prerequisiteSubjectCode] : []);
        if (prereqs.includes(subjectCode)) {
          unlocks.push(s.subjectCode);
        }
      });
    });
    return [...new Set(unlocks)];
  };

  const getUiIdForSubjectCode = (code: string) => {
    for (const sem of semesters) {
       for (const sub of (sem.subjects || [])) {
          if (sub.subjectCode === code) {
             const gId = sub.groupId || sub.electiveGroupId;
             if (gId && groupDetails[gId]) {
                return groupDetails[gId].groupCode;
             }
             return code;
          }
       }
    }
    return code;
  };

  const edges = useMemo(() => {
    const edgeList: { source: string, target: string }[] = [];
    semesters.forEach(sem => {
       (sem.subjects || []).forEach(sub => {
          const prereqs = sub.prerequisiteSubjectCodes || (sub.prerequisiteSubjectCode ? [sub.prerequisiteSubjectCode] : []);
          const targetUiId = getUiIdForSubjectCode(sub.subjectCode);
          
          prereqs.forEach(pCode => {
             const sourceUiId = getUiIdForSubjectCode(pCode);
             if (sourceUiId && targetUiId && sourceUiId !== targetUiId) {
                if (!edgeList.some(e => e.source === sourceUiId && e.target === targetUiId)) {
                   edgeList.push({ source: sourceUiId, target: targetUiId });
                }
             }
          });
       });
    });
    return edgeList;
  }, [semesters, groupDetails]);

  const renderSubjectCard = (sub: any, isGroup: boolean, groupInfo?: Group, semNum?: number, allGroupSubs?: any[]) => {
    const isElective = isGroup && groupInfo?.type !== "COMBO";
    const code = isGroup ? (groupInfo?.groupCode || "GROUP") : sub.subjectCode;
    const name = isGroup ? (groupInfo?.groupName || "Group Subject") : sub.subjectName;
    const credits = sub.credit ?? sub.credits ?? 0;
    
    let prereqsText = "No prerequisites";
    if (!isGroup) {
      const p = sub.prerequisiteSubjectCodes || (sub.prerequisiteSubjectCode ? [sub.prerequisiteSubjectCode] : []);
      if (p.length > 0) prereqsText = p.join(", ");
    }

    return (
      <TouchableOpacity
        key={code}
        activeOpacity={0.8}
        onPress={() => {
            if (isElective) {
                setSelectedGroupSubjects(allGroupSubs || []);
                setSelectedGroupName(name);
                setIsGroupModalVisible(true);
            } else if (!isGroup && sub.subjectId) {
                openSubjectModal(sub.subjectId);
            }
        }}
        onLayout={(e) => {
            if (semNum !== undefined) {
                const { x, y, width, height } = e.nativeEvent.layout;
                setCardLayouts(prev => ({
                    ...prev,
                    [code]: {
                        x: x + 80, // Offset for semester pill container
                        y: y + (semLayouts[semNum] || 0),
                        w: width,
                        h: height
                    }
                }));
            }
        }}
        style={[
          styles.subjectCard,
          {
            backgroundColor: isElective ? colors.electiveBg : colors.subjectBg,
            borderColor: isElective ? colors.electiveBorder : colors.subjectBorder,
            shadowColor: isDark ? "#000" : "#000",
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <Text style={{ fontWeight: "700", fontSize: 15, color: colors.textPrimary, flex: 1 }} numberOfLines={1}>
              {code}
            </Text>
            {isElective && (
              <View style={[styles.electiveBadge, { backgroundColor: "rgba(37, 99, 235, 0.15)" }]}>
                <Text style={{ fontSize: 9, fontWeight: "700", color: colors.electiveText }}>ELECTIVE</Text>
              </View>
            )}
          </View>
          
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 18 }} numberOfLines={2}>
            {name}
          </Text>
        </View>

        <View style={{ marginTop: 'auto' }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <View style={[styles.creditBadge, { backgroundColor: isElective ? "rgba(37, 99, 235, 0.1)" : "rgba(34, 197, 94, 0.1)" }]}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: isElective ? colors.electiveBorder : colors.subjectBorder }}>
                {credits} TC
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 10, color: colors.textSecondary }} numberOfLines={1}>
            {isElective && allGroupSubs ? `${allGroupSubs.length} subjects` : prereqsText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubjectModal = () => {
    return (
      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsModalVisible(false)} />
          
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Subject Detail</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {isModalLoading ? (
              <View style={[styles.center, { paddingVertical: 40 }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12, color: colors.textSecondary }}>Loading subject details...</Text>
              </View>
            ) : modalData ? (
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
                    <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "700", marginBottom: 4 }}>
                        {modalData.subjectCode}
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: colors.textPrimary, marginBottom: 8 }}>
                        {modalData.subjectName}
                    </Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Credits</Text>
                            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>{modalData.credits ?? 0}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Time Allocation</Text>
                            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.textPrimary }}>{modalData.timeAllocation ?? "N/A"}</Text>
                        </View>
                    </View>
                    
                    {modalData.description && (
                        <View style={{ marginTop: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textPrimary, marginBottom: 6 }}>Description</Text>
                            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>
                                {modalData.description}
                            </Text>
                        </View>
                    )}
                </View>
              </ScrollView>
            ) : (
              <View style={styles.center}>
                <Text style={{ color: colors.alertText }}>Failed to load subject</Text>
              </View>
            )}

            {modalData && (
                <View style={[styles.modalActions, { borderTopColor: colors.divider }]}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, { backgroundColor: colors.primary, flex: 1 }]}
                        onPress={() => {
                            setIsModalVisible(false);
                            router.push({ pathname: "/subject/[code]", params: { code: modalData.subjectCode } } as any);
                        }}
                    >
                        <Ionicons name="open-outline" size={18} color="#fff" />
                        <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 6 }}>View Full Detail</Text>
                    </TouchableOpacity>
                </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const renderGroupModal = () => {
    return (
      <Modal visible={isGroupModalVisible} transparent animationType="slide" onRequestClose={() => setIsGroupModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsGroupModalVisible(false)} />
          
          <View style={[styles.modalContent, { backgroundColor: colors.background, height: "65%" }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Elective Group</Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>{selectedGroupName}</Text>
              </View>
              <TouchableOpacity onPress={() => setIsGroupModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                {selectedGroupSubjects.map((sub, index) => (
                    <TouchableOpacity
                        key={sub.subjectCode || index}
                        style={[styles.groupSubjectItem, { backgroundColor: colors.card, borderColor: colors.divider }]}
                        onPress={() => {
                            // Close group modal and open subject modal
                            setIsGroupModalVisible(false);
                            setTimeout(() => {
                                if (sub.subjectId) openSubjectModal(sub.subjectId);
                            }, 300);
                        }}
                    >
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.textPrimary, marginBottom: 4 }}>
                                    {sub.subjectCode}
                                </Text>
                                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                                    {sub.subjectName}
                                </Text>
                            </View>
                            <View style={[styles.creditBadge, { backgroundColor: colors.primaryBg, alignSelf: "center", paddingVertical: 4, paddingHorizontal: 10 }]}>
                                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>
                                    {sub.credit ?? sub.credits ?? 0} TC
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            Prerequisite Map
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }} numberOfLines={1}>
                {curriculum ? curriculum.curriculumCode : "Loading..."}
            </Text>
        </View>
        <TouchableOpacity 
            style={[styles.headerToggle, { backgroundColor: showGlobalConnections ? colors.primary : colors.card, borderColor: showGlobalConnections ? colors.primary : colors.divider }]}
            onPress={() => setShowGlobalConnections(!showGlobalConnections)}
        >
            <Ionicons name="git-network-outline" size={16} color={showGlobalConnections ? "#fff" : colors.textPrimary} />
            <Text style={{ color: showGlobalConnections ? "#fff" : colors.textPrimary, fontSize: 12, fontWeight: "600", marginLeft: 6 }}>
                Links
            </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.textSecondary }}>Loading map data...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: colors.alertText }}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 20 }}>
          <View style={{ position: "relative" }}>
              {showGlobalConnections && (
                  <Svg style={StyleSheet.absoluteFill}>
                      {edges.map(e => {
                          const sL = cardLayouts[e.source];
                          const tL = cardLayouts[e.target];
                          if (!sL || !tL) return null;
                          
                          // Source is typically above or left of target
                          const startX = sL.x + (sL.w / 2);
                          const startY = sL.y + sL.h;
                          const endX = tL.x + (tL.w / 2);
                          const endY = tL.y;
                          
                          // Bezier curve points
                          const cpX1 = startX;
                          const cpY1 = startY + 40;
                          const cpX2 = endX;
                          const cpY2 = endY - 40;
                          
                          const path = `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;
                          
                          return (
                              <Path 
                                  key={`${e.source}-${e.target}`} 
                                  d={path} 
                                  stroke={colors.primary} 
                                  strokeWidth={2.5} 
                                  fill="none" 
                                  opacity={0.6}
                                  strokeDasharray="4, 4"
                              />
                          );
                      })}
                  </Svg>
              )}

              {semesters.map((sem, idx) => {
                const semNum = sem.semester ?? (sem as any).semesterNo ?? (idx + 1);
                const subjects = sem.subjects || [];

                // Group subjects for rendering
                const groupMap = new Map<string, any[]>();
                const independentSubjects: any[] = [];
                subjects.forEach((sub) => {
                  const gId = sub.groupId || sub.electiveGroupId;
                  if (gId) {
                    if (!groupMap.has(gId)) groupMap.set(gId, []);
                    groupMap.get(gId)?.push(sub);
                  } else {
                    independentSubjects.push(sub);
                  }
                });

                return (
                  <View 
                      key={`sem-${semNum}`} 
                      style={styles.semesterRow}
                      onLayout={(e) => {
                          setSemLayouts(prev => ({ ...prev, [semNum]: e.nativeEvent.layout.y }));
                      }}
                  >
                    {/* Semester Pill */}
                    <View style={styles.semesterPillContainer}>
                      <View style={[styles.semesterPill, { backgroundColor: colors.card, borderColor: colors.divider }]}>
                        <Text style={{ fontWeight: "700", color: colors.primary, fontSize: 13 }}>
                          Sem {semNum}
                        </Text>
                      </View>
                    </View>

                    {/* Wrapping Subjects */}
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingRight: 16 }}>
                      {independentSubjects.map((sub) => renderSubjectCard(sub, false, undefined, semNum, undefined))}
                      
                      {Array.from(groupMap.entries()).map(([gId, subs]) => {
                        const firstSub = subs[0];
                        if (!firstSub) return null;
                        return renderSubjectCard(firstSub, true, groupDetails[gId], semNum, subs);
                      })}
                    </View>
                  </View>
                );
              })}
          </View>
          <View style={{ height: 60 }} />
        </ScrollView>
      )}

      {renderSubjectModal()}
      {renderGroupModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  semesterRow: {
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start", // changed to flex-start for wrap support
  },
  semesterPillContainer: {
    width: 80,
    alignItems: "center",
    paddingTop: 12,
  },
  semesterPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  subjectCard: {
    width: 130, // Slightly smaller width to fit 2 per row nicely on small phones
    height: 120,
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    marginBottom: 10, // Margin bottom for wrapping
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  electiveBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  creditBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  modalCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  infoItem: {
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
  },
  groupSubjectItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  }
});
