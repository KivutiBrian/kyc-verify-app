import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera as CameraIcon, Camera as FlipCamera, X, Check, ArrowLeft } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue
} from 'react-native-reanimated';
import { useImageManipulator, ImageManipulator } from 'expo-image-manipulator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const FRAME_WIDTH = 2500;
const FRAME_HEIGHT = 500;
const FRAME_PADDING = 40;

// Calculate frame position relative to screen
const FRAME_X = (SCREEN_WIDTH - FRAME_WIDTH) / 2;
const FRAME_Y = (SCREEN_HEIGHT - FRAME_HEIGHT) / 2;

export default function CameraScreen() {
    const { side } = useLocalSearchParams<{ side: 'front' | 'back' }>();
    const { dispatch } = useVerification();
    const [facing, setFacing] = useState<CameraType>('back');
    const [uri, setUri] = useState<string | null>(null);
    const [permission, requestPermission] = Platform.OS === 'web'
        ? [{ granted: true }, async () => ({ status: 'granted' })] as const
        : useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);


    const context = useImageManipulator(uri || '')

    // Animation values
    const borderWidth = useSharedValue(2);
    const borderOpacity = useSharedValue(1);

    useEffect(() => {
        // Start the animation when component mounts
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


    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleCapture = async () => {

        try {



            const photo = await cameraRef.current?.takePictureAsync({
                quality: 1,
                base64: true,
                shutterSound: false
            });


            if (photo?.uri) {
                // Calculate the scale factor between the screen and the captured image
                const screenRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
                const photoRatio = photo.height / photo.width;

                let scaledWidth, scaledHeight, offsetY = 0;

                if (photoRatio > screenRatio) {
                    // Image is taller than screen ratio
                    scaledWidth = photo.width;
                    scaledHeight = photo.width * screenRatio;
                    offsetY = (photo.height - scaledHeight) / 2;
                } else {
                    // Image is wider than screen ratio
                    scaledHeight = photo.height;
                    scaledWidth = photo.height / screenRatio;
                }

                // Calculate crop dimensions based on the scaled image
                const scale = scaledWidth / SCREEN_WIDTH;
                const cropX = Math.max(0, FRAME_X * scale);
                const cropY = Math.max(0, (FRAME_Y * scale) + offsetY);
                const cropWidth = Math.min(photo.width, FRAME_WIDTH * scale);
                const cropHeight = Math.min(photo.height - cropY, FRAME_HEIGHT * scale);


                const a = ImageManipulator.manipulate(photo.uri)
                a.crop({
                    height: cropHeight,
                    originX: cropX,
                    originY: cropY,
                    width: cropWidth
                })

                const image = await a.renderAsync()
                const result = await image.saveAsync()

                setUri(result.uri)
            }

        } catch (error) {
            console.error('Failed to take photo:', error);
        }
    };

    const handleConfirm = () => {
        if (!uri) return;

        dispatch({
            type: side === 'front' ? 'SET_FRONT_IMAGE' : 'SET_BACK_IMAGE',
            payload: uri
        });

        if (side === 'front') {
            router.push('/instructions?side=back');
        } else {
            router.push('/review');
        }
    };


    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.button} onPress={() => requestPermission()}>
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

    if (uri) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setUri(null)}
                    >
                        <ArrowLeft color="#fff" size={24} />
                        <Text style={styles.backButtonText}>Retake</Text>
                    </TouchableOpacity>
                </View>

                <Image source={{ uri: uri }} style={styles.preview} />

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                >
                    <Check color="#fff" size={24} />
                    <Text style={styles.confirmButtonText}>Confirm {side === 'front' ? 'Front' : 'Back'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                facing={facing}
                style={styles.camera}
                mode='picture'
                responsiveOrientationWhenOrientationLocked

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
                            Position the {side} of your ID within the frame
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={handleCapture}
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
    flipButton: {
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
        width: 280,
        height: 180,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 12,
    },
    cornerTL: {
        position: 'absolute',
        top: (Dimensions.get('window').height - FRAME_HEIGHT) / 2 - FRAME_PADDING,
        left: (SCREEN_WIDTH - FRAME_WIDTH) / 2 - FRAME_PADDING,
        width: 20,
        height: 20,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#fff',
    },
    cornerTR: {
        position: 'absolute',
        top: (Dimensions.get('window').height - FRAME_HEIGHT) / 2 - FRAME_PADDING,
        right: (SCREEN_WIDTH - FRAME_WIDTH) / 2 - FRAME_PADDING,
        width: 20,
        height: 20,
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderColor: '#fff',
    },
    cornerBL: {
        position: 'absolute',
        bottom: (Dimensions.get('window').height - FRAME_HEIGHT) / 2 - FRAME_PADDING,
        left: (SCREEN_WIDTH - FRAME_WIDTH) / 2 - FRAME_PADDING,
        width: 20,
        height: 20,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#fff',
    },
    cornerBR: {
        position: 'absolute',
        bottom: (Dimensions.get('window').height - FRAME_HEIGHT) / 2 - FRAME_PADDING,
        right: (SCREEN_WIDTH - FRAME_WIDTH) / 2 - FRAME_PADDING,
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
        borderRadius: 12,
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