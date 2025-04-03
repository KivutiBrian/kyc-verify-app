import { StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Sun, ScanLine, Check } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';

export default function InstructionsScreen() {
    const { side = 'front' } = useLocalSearchParams<{ side?: 'front' | 'back' }>();
    const { state } = useVerification();

    const handleContinue = () => {
        router.push(`/camera?side=${side}`);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.step}>Step {state.step} of 3</Text>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80' }}
                            style={styles.idImage}
                        />
                        <Text style={styles.title}>Submit {side === 'front' ? 'Front' : 'Back'} of ID</Text>
                        <Text style={styles.subtitle}>
                            We'll use it to verify your identity.{'\n'}
                            Please follow the instructions below.
                        </Text>
                    </View>

                    <View style={styles.instructions}>
                        <View style={styles.instruction}>
                            <Sun size={32} color="#1a237e" style={styles.icon} />
                            <View style={styles.instructionText}>
                                <Text style={styles.instructionTitle}>Good Light</Text>
                                <Text style={styles.instructionDescription}>
                                    Make sure you are in a well-lit environment
                                </Text>
                            </View>
                        </View>

                        <View style={styles.instruction}>
                            <ScanLine size={32} color="#1a237e" style={styles.icon} />
                            <View style={styles.instructionText}>
                                <Text style={styles.instructionTitle}>Clear Image</Text>
                                <Text style={styles.instructionDescription}>
                                    Hold your phone steady and ensure all text is readable
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>Take Photo</Text>
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
    idImage: {
        width: 120,
        height: 80,
        marginBottom: 24,
        borderRadius: 8,
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