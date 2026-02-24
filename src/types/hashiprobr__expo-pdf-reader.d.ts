declare module '@hashiprobr/expo-pdf-reader' {
    import React from 'react';
    import { StyleProp, ViewStyle } from 'react-native';

    export interface PdfReaderProps {
        source: {
            uri?: string;
            base64?: string;
        };
        style?: StyleProp<ViewStyle>;
        onLoad?: () => void;
        onLoadEnd?: () => void;
        onError?: (error: any) => void;
    }

    const PdfReader: React.FC<PdfReaderProps>;
    export default PdfReader;
}
