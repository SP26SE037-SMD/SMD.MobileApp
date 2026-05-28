import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, useColorScheme, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

import {
  getCurriculumById,
  getSemesterMappings,
  getGroupById,
} from "@/src/services/curriculumService";
import type { Curriculum, Group, SemesterMapping } from "@/src/types";

export default function CurriculumGraphScreen() {
  const { curriculumId: id } = useLocalSearchParams<{ curriculumId: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isLoading, setIsLoading] = useState(true);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    background: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    textPrimary: isDark ? "#F1F5F9" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const curr = await getCurriculumById(id);
        setCurriculum(curr);

        const semResponse = await getSemesterMappings(id);
        const semesters = semResponse?.semesterMappings || [];

        // Collect all group IDs to fetch
        const groupIds = new Set<string>();
        semesters.forEach((sem) => {
          (sem.subjects || []).forEach((sub) => {
            const gId = sub.groupId || sub.electiveGroupId;
            if (gId) groupIds.add(gId);
          });
        });

        const groupDetails: Record<string, Group> = {};
        if (groupIds.size > 0) {
          const groupPromises = Array.from(groupIds).map((gId) => getGroupById(gId));
          const groupResults = await Promise.allSettled(groupPromises);
          groupResults.forEach((res) => {
            if (res.status === "fulfilled" && res.value) {
              groupDetails[res.value.groupId] = res.value;
            }
          });
        }

        // Build Nodes and Edges
        const newNodes: any[] = [];
        const newEdges: any[] = [];
        let yOffset = 50;
        let maxRowWidth = 800;

        semesters.forEach((sem) => {
          const semId = `sem-${sem.semester ?? (sem as any).semesterNo}`;
          const subjects = sem.subjects || [];

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

          // Calculate Semester Box Width
          const totalGroupsWidth = Array.from(groupMap.values()).reduce(
            (acc, subs) => acc + Math.max(180, subs.length * 180 + 40),
            0
          );
          const semWidth = Math.max(maxRowWidth, independentSubjects.length * 180 + totalGroupsWidth + 100);
          maxRowWidth = Math.max(maxRowWidth, semWidth);

          newNodes.push({
            id: semId,
            type: "group",
            position: { x: 50, y: yOffset },
            style: {
              width: semWidth,
              height: 280,
              backgroundColor: "rgba(241, 245, 249, 0.5)",
              border: "2px solid #cbd5e1",
              borderRadius: 8,
            },
            data: { label: `Semester ${sem.semester ?? (sem as any).semesterNo}` },
          });

          let currentX = 20;

          // Add Independent Subjects
          independentSubjects.forEach((sub) => {
            newNodes.push({
              id: sub.subjectCode,
              parentId: semId,
              extent: "parent",
              position: { x: currentX, y: 60 },
              data: {
                label: `<strong>${sub.subjectCode}</strong><br/>${sub.subjectName}<br/><span style="font-size:10px;color:#64748b">${sub.credit ?? sub.credits ?? 0} credits</span>`,
              },
              style: {
                width: 150,
                backgroundColor: "#ffffff",
                border: "2px solid #3b82f6",
                borderRadius: 8,
                padding: 10,
                textAlign: "center",
                fontSize: 12,
              },
            });
            currentX += 180;
          });

          // Add Groups
          groupMap.forEach((subs, gId) => {
            const gWidth = Math.max(180, subs.length * 180 + 20);
            const groupInfo = groupDetails[gId];
            newNodes.push({
              id: `group-${gId}`,
              parentId: semId,
              extent: "parent",
              position: { x: currentX, y: 50 },
              style: {
                width: gWidth,
                height: 200,
                backgroundColor: "rgba(219, 234, 254, 0.4)",
                border: "2px dashed #8b5cf6",
                borderRadius: 8,
              },
              data: {
                label: groupInfo ? `${groupInfo.groupName} (${groupInfo.type})` : `Group ${gId.substring(0, 4)}`,
              },
            });

            let gx = 10;
            subs.forEach((sub) => {
              newNodes.push({
                id: sub.subjectCode,
                parentId: `group-${gId}`,
                extent: "parent",
                position: { x: gx, y: 50 },
                data: {
                  label: `<strong>${sub.subjectCode}</strong><br/>${sub.subjectName}<br/><span style="font-size:10px;color:#64748b">${sub.credit ?? sub.credits ?? 0} credits</span>`,
                },
                style: {
                  width: 150,
                  backgroundColor: "#ffffff",
                  border: "2px solid #a855f7",
                  borderRadius: 8,
                  padding: 10,
                  textAlign: "center",
                  fontSize: 12,
                },
              });
              gx += 180;
            });

            currentX += gWidth + 20;
          });

          // Process Edges
          subjects.forEach((sub) => {
            const prereqs = sub.prerequisiteSubjectCodes || (sub.prerequisiteSubjectCode ? [sub.prerequisiteSubjectCode] : []);
            prereqs.forEach((prereq) => {
              newEdges.push({
                id: `e-${prereq}-${sub.subjectCode}`,
                source: prereq,
                target: sub.subjectCode,
                animated: true,
                style: { stroke: "#94a3b8", strokeWidth: 2 },
                markerEnd: { type: "arrowclosed", color: "#94a3b8" },
              });
            });
          });

          yOffset += 320;
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (err) {
        console.error(err);
        setError("Failed to load graph data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>React Flow</title>
      <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <link rel="stylesheet" href="https://unpkg.com/reactflow@11.11.4/dist/style.css" />
      <script src="https://unpkg.com/reactflow@11.11.4/dist/umd/index.js"></script>
      <style>
        body, html, #root {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        /* Custom Node Styles */
        .react-flow__node-group {
           box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .react-flow__node-default {
           box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        const { ReactFlow, Controls, Background, MiniMap, ReactFlowProvider } = window.ReactFlow;
        const initialNodes = ${JSON.stringify(nodes)};
        const initialEdges = ${JSON.stringify(edges)};

        function Flow() {
          // React Flow auto handles rendering of the passed nodes and edges
          return (
            <ReactFlow 
                nodes={initialNodes} 
                edges={initialEdges} 
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
            >
              <Background color="#cbd5e1" gap={20} />
              <Controls />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'group') return '#cbd5e1';
                  return '#3b82f6';
                }}
                nodeColor={(n) => {
                  if (n.type === 'group') return 'rgba(241, 245, 249, 0.5)';
                  return '#fff';
                }}
              />
            </ReactFlow>
          );
        }

        const App = () => (
          <ReactFlowProvider>
            <Flow />
          </ReactFlowProvider>
        );

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {curriculum ? `${curriculum.curriculumCode} Graph` : "Loading Graph..."}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={{ marginTop: 12, color: colors.textSecondary }}>Building graph...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "#EF4444" }}>{error}</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: htmlContent }}
            style={{ flex: 1, backgroundColor: "transparent" }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false} // Disable RN scroll to allow web zoom/pan
            bounces={false}
          />
        </View>
      )}
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
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
