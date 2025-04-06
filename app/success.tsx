import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';

export default function SuccessScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <CheckCircle2 size={64} color="#4CAF50" />
                    </View>

                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1635237335491-731c3b1e5f9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' }}
                        style={styles.image}
                    />

                    <Text style={styles.title}>Verification Submitted!</Text>

                    <Text style={styles.message}>
                        Your identity verification request has been submitted successfully. Our team will review your documents and update you shortly.
                    </Text>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>What's Next?</Text>
                        <Text style={styles.infoText}>
                            • We'll review your submitted documents{'\n'}
                            • This usually takes 24-48 hours{'\n'}
                            • You'll receive an email notification{'\n'}
                            • Check your verification status in the app
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('/')}
                >
                    <Text style={styles.buttonText}>Return to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 24,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 12,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a237e',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    infoContainer: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 12,
        width: '100%',
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#1a237e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});