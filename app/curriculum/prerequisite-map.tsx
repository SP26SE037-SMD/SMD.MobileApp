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

        const subjectToGroupMap = new Map<string, string>();
        semesters.forEach(sem => {
          (sem.subjects || []).forEach(sub => {
            const gId = sub.groupId || sub.electiveGroupId;
            if (gId) subjectToGroupMap.set(sub.subjectCode, gId);
          });
        });

        semesters.forEach((sem) => {
          const semNum = sem.semester ?? (sem as any).semesterNo;
          const semId = `sem-${semNum}`;
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

          // Add Semester Pill
          newNodes.push({
            id: semId,
            type: "semesterNode",
            position: { x: 20, y: yOffset + 30 },
            data: { label: `Sem ${semNum}` },
          });

          let currentX = 150;

          // Add Independent Subjects
          independentSubjects.forEach((sub) => {
            const prereqs = sub.prerequisiteSubjectCodes || (sub.prerequisiteSubjectCode ? [sub.prerequisiteSubjectCode] : []);
            newNodes.push({
              id: sub.subjectCode,
              type: "customNode",
              position: { x: currentX, y: yOffset },
              data: {
                code: sub.subjectCode,
                name: sub.subjectName,
                credits: sub.credit ?? sub.credits ?? 0,
                prereqs: prereqs.length > 0 ? prereqs.join(", ") : "No prerequisites",
                isElective: false
              },
            });
            currentX += 220;
          });

          // Add Groups as SINGLE node
          groupMap.forEach((subs, gId) => {
            const groupInfo = groupDetails[gId];
            const isElective = groupInfo ? groupInfo.type !== "COMBO" : true;
            
            // Assume credit from first subject in group
            const firstSub = subs[0];
            const credits = firstSub ? (firstSub.credit ?? firstSub.credits ?? 0) : 0;
            
            const allPrereqs = new Set<string>();
            subs.forEach(s => {
                const ps = s.prerequisiteSubjectCodes || (s.prerequisiteSubjectCode ? [s.prerequisiteSubjectCode] : []);
                ps.forEach((p: string) => allPrereqs.add(p));
            });
            
            newNodes.push({
              id: `group-${gId}`,
              type: "customNode",
              position: { x: currentX, y: yOffset },
              data: {
                code: groupInfo?.groupCode || `GROUP`,
                name: groupInfo?.groupName || "Group Subject",
                credits: credits,
                prereqs: allPrereqs.size > 0 ? Array.from(allPrereqs).join(", ") : "No prerequisites",
                isElective: isElective
              },
            });
            currentX += 220;
          });

          // Process Edges
          subjects.forEach((sub) => {
            const targetGId = sub.groupId || sub.electiveGroupId;
            const targetNodeId = targetGId ? `group-${targetGId}` : sub.subjectCode;

            const prereqs = sub.prerequisiteSubjectCodes || (sub.prerequisiteSubjectCode ? [sub.prerequisiteSubjectCode] : []);
            prereqs.forEach((prereq) => {
              const sourceGId = subjectToGroupMap.get(prereq);
              const sourceNodeId = sourceGId ? `group-${sourceGId}` : prereq;
              
              const edgeId = `e-${sourceNodeId}-${targetNodeId}`;
              
              // avoid duplicate edges between groups
              if (!newEdges.find(e => e.id === edgeId) && sourceNodeId !== targetNodeId) {
                newEdges.push({
                  id: edgeId,
                  source: sourceNodeId,
                  target: targetNodeId,
                  animated: true,
                  style: { stroke: "#94a3b8", strokeWidth: 2 },
                  markerEnd: { type: "arrowclosed", color: "#94a3b8" },
                });
              }
            });
          });

          yOffset += 200;
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
        .react-flow__node-customNode {
           box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
           border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        const { ReactFlow, Controls, Background, MiniMap, ReactFlowProvider, Handle, Position } = window.ReactFlow;
        const initialNodes = ${JSON.stringify(nodes)};
        const initialEdges = ${JSON.stringify(edges)};

        const CustomNode = ({ data }) => {
          const isElective = data.isElective;
          return (
            <div style={{
              width: 180,
              minHeight: 120,
              backgroundColor: isElective ? "#f0f9ff" : "#ffffff",
              border: isElective ? "2px solid #3b82f6" : "2px solid #22c55e",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              position: "relative"
            }}>
              <Handle type="target" position={Position.Top} style={{ background: '#94a3b8' }} />
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <strong style={{ fontSize: 14, color: "#0f172a" }}>{data.code}</strong>
                  {isElective && (
                    <span style={{ fontSize: 9, fontWeight: "bold", color: "#2563eb", backgroundColor: "#dbeafe", padding: "2px 6px", borderRadius: 4 }}>
                      ELECTIVE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 12, lineHeight: 1.4 }}>
                  {data.name}
                </div>
              </div>
              
              <div>
                <span style={{ fontSize: 11, fontWeight: "bold", color: isElective ? "#3b82f6" : "#22c55e", backgroundColor: isElective ? "#e0f2fe" : "#dcfce7", padding: "2px 6px", borderRadius: 4 }}>
                  {data.credits} TC
                </span>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>
                  {data.prereqs}
                </div>
              </div>

              <Handle type="source" position={Position.Bottom} style={{ background: '#94a3b8' }} />
            </div>
          );
        };

        const SemesterNode = ({ data }) => {
          return (
            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: "bold",
              color: "#0f172a"
            }}>
              {data.label}
            </div>
          );
        };

        const nodeTypes = {
          customNode: CustomNode,
          semesterNode: SemesterNode
        };

        function Flow() {
          return (
            <ReactFlow 
                nodes={initialNodes} 
                edges={initialEdges} 
                nodeTypes={nodeTypes}
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
                  if (n.type === 'semesterNode') return '#f8fafc';
                  if (n.data?.isElective) return '#f0f9ff';
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
