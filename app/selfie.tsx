import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, X, Check, ArrowLeft } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue
} from 'react-native-reanimated';

const window = Dimensions.get('window');
const SCREEN_WIDTH = window.width;
const SCREEN_HEIGHT = window.height;
const FRAME_SIZE = Math.min(window.width, window.height) * 0.9;
const FRAME_PADDING = 20;

const FRAME_X = (SCREEN_WIDTH - FRAME_SIZE) / 2;
const FRAME_Y = (SCREEN_HEIGHT - FRAME_SIZE) / 2;

export default function SelfieScreen() {
    const { dispatch } = useVerification();
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoBase64, setPhotoBase64] = useState<string | null>(null)
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const borderWidth = useSharedValue(2);
    const borderOpacity = useSharedValue(1);

    useEffect(() => {
        borderWidth.value = withRepeat(
            withSequence(
                withTiming(4, { duration: 1000 }),
                withTiming(2, { duration: 1000 })
            ),
            -1,
            true
        );

        borderOpacity.value = withRepeat(
            withSequence(
                withTiming(0.5, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedFrameStyle = useAnimatedStyle(() => ({
        borderWidth: borderWidth.value,
        opacity: borderOpacity.value,
    }));

    const handleCapture = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: true,
                exif: false,
                shutterSound: false
            });


            if (photo?.uri) {
                setPhoto(photo.uri);
                setPhotoBase64(photo?.base64 ?? '');

            }


        } catch (error) {
            console.error('Failed to take photo:', error);
        }
    };

    const handleConfirm = () => {
        if (!photo) return;

        dispatch({ type: 'SET_SELFIE_IMAGE', payload: photo });
        dispatch({ type: 'SET_SELFIE_BASE64', payload: photoBase64 });
        router.push('/review');
    };

    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Camera is not supported on web</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (photo) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setPhoto(null)}
                    >
                        <ArrowLeft color="#fff" size={24} />
                        <Text style={styles.backButtonText}>Retake</Text>
                    </TouchableOpacity>
                </View>

                <Image source={{ uri: photo }} style={styles.preview} />

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                >
                    <Check color="#fff" size={24} />
                    <Text style={styles.confirmButtonText}>Confirm Selfie</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing='front'

            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => router.back()}
                        >
                            <X color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.guide}>
                        <Animated.View style={[styles.guideBorder, animatedFrameStyle]} />
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                        <Text style={styles.guideText}>
                            Position your face within the circle
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={handleCapture}
                            activeOpacity={0.7}
                        >
                            <CameraIcon color="#fff" size={32} />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 40,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guideBorder: {
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        borderColor: '#fff',
        borderRadius: FRAME_SIZE / 2,
        position: 'relative',
    },
    cornerTL: {
        position: 'absolute',
        top: FRAME_Y - FRAME_PADDING,
        left: FRAME_X - FRAME_PADDING,
        width: 20,
        height: 20,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#fff',
    },
    cornerTR: {
        position: 'absolute',
        top: FRAME_Y - FRAME_PADDING,
        right: FRAME_X - FRAME_PADDING,
        width: 20,
        height: 20,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: '#fff',
    },
    cornerBL: {
        position: 'absolute',
        bottom: FRAME_Y - FRAME_PADDING,
        left: FRAME_X - FRAME_PADDING,
        width: 20,
        height: 20,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#fff',
    },
    cornerBR: {
        position: 'absolute',
        bottom: FRAME_Y - FRAME_PADDING,
        right: FRAME_X - FRAME_PADDING,
        width: 20,
        height: 20,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderColor: '#fff',
    },
    guideText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    preview: {
        flex: 1,
        margin: 20,
        borderRadius: FRAME_SIZE / 2,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    confirmButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});