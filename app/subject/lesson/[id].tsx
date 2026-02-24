import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    useColorScheme,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import PdfReader from '@hashiprobr/expo-pdf-reader';
import * as Print from 'expo-print';
import { useSettingsStore } from '@/src/store/useSettingsStore';

const MOCK_PDF_BLOCKS = [
    { block_id: 1001, material_id: 1, idx: 1, block_style: "heading", content_text: "1. Khái niệm cơ bản về Lập trình" },
    { block_id: 1002, material_id: 1, idx: 2, block_style: "paragraph", content_text: "Lập trình máy tính, theo định nghĩa chung nhất, là quá trình thiết kế, viết, thử nghiệm và bảo trì mã nguồn của các chương trình máy tính. Công việc này bao gồm chỉ thị cho máy tính thực hiện các tác vụ với độ chính xác cao." },
    { block_id: 1003, material_id: 1, idx: 3, block_style: "paragraph", content_text: "Các ngôn ngữ phổ biến trên thế giới thường bao gồm:" },
    { block_id: 1004, material_id: 1, idx: 4, block_style: "collection", content_text: "• Ngôn ngữ C và C++ (Ứng dụng hệ thống)" },
    { block_id: 1005, material_id: 1, idx: 5, block_style: "collection", content_text: "• Java (Ứng dụng doanh nghiệp, thiết bị di động)" },
    { block_id: 1006, material_id: 1, idx: 6, block_style: "collection", content_text: "• Python (Phân tích dữ liệu, Trí tuệ nhân tạo)" },
    { block_id: 1007, material_id: 1, idx: 7, block_style: "collection", content_text: "• JavaScript (Phát triển giao diện Web)" },
    { block_id: 1008, material_id: 1, idx: 8, block_style: "paragraph", content_text: "Mỗi ngôn ngữ sẽ có cú pháp và cách thức hoạt động riêng biệt, phục vụ cho những mục đích đa dạng trong thế giới công nghệ." },

    { block_id: 1009, material_id: 1, idx: 9, block_style: "heading", content_text: "2. Thuật toán là gì?" },
    { block_id: 1010, material_id: 1, idx: 10, block_style: "paragraph", content_text: "Thuật toán (Algorithm) là một dãy hữu hạn các bước có trình tự để giải một bài toán cụ thể. Có thể hình dung thuật toán giống như công thức nấu ăn: Nếu làm đúng các bước, bạn sẽ luôn đạt được kết quả mong muốn." },
    { block_id: 1011, material_id: 1, idx: 11, block_style: "paragraph", content_text: "Một thuật toán tốt cần đảm bảo các tiêu chí sau:" },
    { block_id: 1012, material_id: 1, idx: 12, block_style: "collection", content_text: "1. Tính dừng: Phải kết thúc sau một số bước hữu hạn." },
    { block_id: 1013, material_id: 1, idx: 13, block_style: "collection", content_text: "2. Tính xác định: Mỗi bước phải thật rõ ràng, không mập mờ." },
    { block_id: 1014, material_id: 1, idx: 14, block_style: "collection", content_text: "3. Tính đúng đắn: Luôn cho kết quả chính xác để giải quyết vấn đề." },

    { block_id: 1015, material_id: 1, idx: 15, block_style: "heading", content_text: "3. Lợi ích của việc học Lập trình" },
    { block_id: 1016, material_id: 1, idx: 16, block_style: "paragraph", content_text: "Trong thời đại kỹ thuật số, việc học lập trình mang lại vô vàn lợi ích kể cả khi bạn không trở thành Kỹ sư phần mềm chuyên nghiệp:" },
    { block_id: 1017, material_id: 1, idx: 17, block_style: "collection", content_text: "- Rèn luyện tư duy logic và kỹ năng giải quyết thuật toán." },
    { block_id: 1018, material_id: 1, idx: 18, block_style: "collection", content_text: "-Tự động hoá các quy trình nhàm chán ngoài đời thực." },
    { block_id: 1019, material_id: 1, idx: 19, block_style: "collection", content_text: "- Góp phần xây dựng cái nhìn sâu sắc về vạn vật (Internet of Things)." }
];


export default function LessonViewerScreen() {
    const { url, title, type } = useLocalSearchParams<{
        id: string;
        url: string;
        title: string;
        type: string;
    }>();
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [generatedPdfUri, setGeneratedPdfUri] = useState<string | null>(null);

    React.useEffect(() => {
        if (type === 'pdf') {
            const generatePdf = async () => {
                try {
                    const htmlContent = `
                        <html>
                            <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                                <style>
                                    body { font-family: 'Helvetica', sans-serif; padding: 20px; color: ${isDark ? '#F1F5F9' : '#0F172A'}; background-color: ${isDark ? '#0F172A' : '#F8FAFC'}; }
                                    h1 { font-size: 24px; font-weight: bold; margin-top: 12px; margin-bottom: 16px; }
                                    p { font-size: 16px; line-height: 1.5; margin-bottom: 12px; }
                                    .collection { font-size: 16px; line-height: 1.5; margin-bottom: 4px; margin-left: 16px; }
                                </style>
                            </head>
                            <body>
                                ${MOCK_PDF_BLOCKS.sort((a, b) => a.idx - b.idx).map(block => {
                        if (block.block_style === 'heading') return `<h1>${block.content_text}</h1>`;
                        if (block.block_style === 'paragraph') return `<p>${block.content_text}</p>`;
                        if (block.block_style === 'collection') return `<div class="collection">${block.content_text}</div>`;
                        return `<p>${block.content_text}</p>`;
                    }).join('')}
                            </body>
                        </html>
                    `;
                    const { uri } = await Print.printToFileAsync({ html: htmlContent });
                    setGeneratedPdfUri(uri);
                } catch (err) {
                    console.error('Failed to generate PDF:', err);
                    setError(true);
                }
            };
            generatePdf();
        }
    }, [type, isDark]);

    const colors = {
        background: isDark ? '#0F172A' : '#F8FAFC',
        card: isDark ? '#1E293B' : '#FFFFFF',
        textPrimary: isDark ? '#F1F5F9' : '#0F172A',
        textSecondary: isDark ? '#94A3B8' : '#64748B',
        primary: isDark ? '#3B82F6' : '#2563EB',
        divider: isDark ? '#334155' : '#E2E8F0',
    };

    const openInBrowser = async () => {
        if (url) {
            try {
                await Linking.openURL(url);
            } catch (_) { }
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'pdf':
                return language === 'vi' ? 'Tài liệu PDF' : 'PDF Document';
            case 'video':
                return language === 'vi' ? 'Video Bài giảng' : 'Video Lecture';
            case 'slide':
                return language === 'vi' ? 'Slide Bài trình chiếu' : 'Presentation Slide';
            case 'doc':
                return language === 'vi' ? 'Tài liệu đọc' : 'Reading Document';
            default:
                return language === 'vi' ? 'Tài liệu học' : 'Lesson Material';
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'pdf':
                return 'document-text';
            case 'video':
                return 'play-circle';
            case 'slide':
                return 'albums';
            default:
                return 'document';
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    backgroundColor: colors.card,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ padding: 8, marginRight: 12, marginLeft: -8, borderRadius: 20 }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <Ionicons
                    name={getTypeIcon()}
                    size={20}
                    color={colors.primary}
                    style={{ marginRight: 8 }}
                />

                <View style={{ flex: 1 }}>
                    <Text
                        style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary }}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>{getTypeLabel()}</Text>
                </View>

                {/* Open in external browser button */}
                <TouchableOpacity
                    onPress={openInBrowser}
                    style={{
                        padding: 8,
                        borderRadius: 10,
                        backgroundColor: colors.primary + '20',
                    }}
                >
                    <Ionicons name="open-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* PDF Viewer */}
            {type === 'pdf' ? (
                <View style={{ flex: 1, backgroundColor: colors.background }}>
                    {(loading || !generatedPdfUri) && !error && (
                        <View style={styles.overlay}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 14 }}>
                                {language === 'vi' ? 'Đang tạo tài liệu PDF...' : 'Generating PDF document...'}
                            </Text>
                        </View>
                    )}
                    {generatedPdfUri && (
                        <PdfReader
                            source={{ uri: generatedPdfUri }}
                            onLoadEnd={() => setLoading(false)}
                            onError={(err: any) => {
                                console.error('Pdf load error:', err);
                                setLoading(false);
                                setError(true);
                            }}
                            style={{ flex: 1, backgroundColor: colors.background, opacity: error ? 0 : 1 }}
                        />
                    )}
                    {error && (
                        <View style={styles.overlay}>
                            <Ionicons
                                name="cloud-offline-outline"
                                size={56}
                                color={colors.textSecondary}
                                style={{ opacity: 0.5, marginBottom: 16 }}
                            />
                            <Text
                                style={{
                                    color: colors.textPrimary,
                                    fontSize: 17,
                                    fontWeight: '700',
                                    marginBottom: 8,
                                    textAlign: 'center',
                                }}
                            >
                                {language === 'vi' ? 'Không thể tải tài liệu' : 'Could not load document'}
                            </Text>
                            <Text
                                style={{
                                    color: colors.textSecondary,
                                    textAlign: 'center',
                                    marginBottom: 24,
                                    lineHeight: 22,
                                    paddingHorizontal: 30,
                                }}
                            >
                                {language === 'vi'
                                    ? 'Có lỗi xảy ra khi tải tài liệu. Hãy thử mở trong trình duyệt.'
                                    : 'Something went wrong loading this document. Try opening it in your browser.'}
                            </Text>
                            <TouchableOpacity
                                onPress={openInBrowser}
                                style={{
                                    backgroundColor: colors.primary,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 14,
                                    paddingHorizontal: 28,
                                    borderRadius: 12,
                                }}
                            >
                                <Ionicons
                                    name="open-outline"
                                    size={18}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
                                    {language === 'vi' ? 'Mở Trình Duyệt' : 'Open in Browser'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : null}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
});
