import { StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Camera as CameraIcon, Sun, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';

export default function SelfieInstructionsScreen() {
    const { state } = useVerification();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.step}>Final Step</Text>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
                            style={styles.selfieImage}
                        />
                        <Text style={styles.title}>Take a Selfie</Text>
                        <Text style={styles.subtitle}>
                            We'll compare your selfie with your ID photo{'\n'}
                            to verify your identity
                        </Text>
                    </View>

                    <View style={styles.instructions}>
                        <View style={styles.instruction}>
                            <CameraIcon size={32} color="#1a237e" style={styles.icon} />
                            <View style={styles.instructionText}>
                                <Text style={styles.instructionTitle}>Look Straight</Text>
                                <Text style={styles.instructionDescription}>
                                    Position your face directly in front of the camera
                                </Text>
                            </View>
                        </View>

                        <View style={styles.instruction}>
                            <Sun size={32} color="#1a237e" style={styles.icon} />
                            <View style={styles.instructionText}>
                                <Text style={styles.instructionTitle}>Good Lighting</Text>
                                <Text style={styles.instructionDescription}>
                                    Ensure your face is well-lit and clearly visible
                                </Text>
                            </View>
                        </View>

                        <View style={styles.instruction}>
                            <AlertCircle size={32} color="#1a237e" style={styles.icon} />
                            <View style={styles.instructionText}>
                                <Text style={styles.instructionTitle}>No Accessories</Text>
                                <Text style={styles.instructionDescription}>
                                    Remove sunglasses, masks, or any face coverings
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/selfie')}
                >
                    <Text style={styles.buttonText}>Take Selfie</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    step: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    selfieImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    instructions: {
        gap: 24,
    },
    instruction: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 16,
        marginTop: 4,
    },
    instructionText: {
        flex: 1,
    },
    instructionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    instructionDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#1a237e',
        margin: 24,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});