import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    useColorScheme,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useSettingsStore } from '@/src/store/useSettingsStore';

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

    const colors = {
        background: isDark ? '#0F172A' : '#F8FAFC',
        card: isDark ? '#1E293B' : '#FFFFFF',
        textPrimary: isDark ? '#F1F5F9' : '#0F172A',
        textSecondary: isDark ? '#94A3B8' : '#64748B',
        primary: isDark ? '#3B82F6' : '#2563EB',
        divider: isDark ? '#334155' : '#E2E8F0',
    };

    // For PDFs, use Google Docs Viewer so it renders inside the WebView
    const finalUrl =
        type === 'pdf'
            ? `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(url)}`
            : url;

    const isPDFOrDoc = type === 'pdf' || type === 'doc';

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

            {/* WebView for PDF / doc types */}
            {(isPDFOrDoc || type === 'slide' || type === 'video') ? (
                <View style={{ flex: 1 }}>
                    {/* Loading and Error overlays */}
                    {loading && !error && (
                        <View style={styles.overlay}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={{ color: colors.textSecondary, marginTop: 12, fontSize: 14 }}>
                                {language === 'vi' ? 'Đang tải tài liệu...' : 'Loading document...'}
                            </Text>
                        </View>
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

                    <WebView
                        source={{ uri: finalUrl }}
                        style={{ flex: 1, opacity: loading || error ? 0 : 1 }}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        onHttpError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState={false}
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction={false}
                    />
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
