import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSettingsStore } from '@/src/store/useSettingsStore';

export default function QRScannerScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const { language } = useSettingsStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        // You could navigate to a result screen or handle the data here
        alert(`${language === 'vi' ? 'Đã quét QR:' : 'Scanned QR:'} ${data}`);
        // Example: router.replace(`/scanned?data=${data}`);
        setTimeout(() => {
            setScanned(false);
        }, 2000); // Allow scanning again after 2 seconds or handle accordingly
    };

    const colors = {
        background: isDark ? "#0F172A" : "#F1F5F9",
        textPrimary: isDark ? "#F1F5F9" : "#1E293B",
    };

    if (hasPermission === null) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textPrimary }}>
                    {language === 'vi' ? 'Đang yêu cầu quyền truy cập camera...' : 'Requesting for camera permission...'}
                </Text>
            </SafeAreaView>
        );
    }
    if (hasPermission === false) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textPrimary }}>
                    {language === 'vi' ? 'Không có quyền truy cập camera' : 'No access to camera'}
                </Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{language === 'vi' ? 'Quay lại' : 'Go Back'}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{language === 'vi' ? 'Quét QR' : 'Scan QR'}</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing="back"
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {language === 'vi' ? 'Hướng camera vào mã QR để quét' : 'Point camera at QR code to scan'}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        zIndex: 10,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    iconButton: {
        padding: 4,
    },
    cameraContainer: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#3B82F6',
        backgroundColor: 'transparent',
        borderRadius: 12,
    },
    footer: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: 'black'
    },
    footerText: {
        color: 'white',
        fontSize: 14,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
