import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Shield } from 'lucide-react-native';

export default function VerificationScreen() {
    return (
        <View style={styles.container}>
            <Shield size={64} color="#007AFF" style={styles.icon} />
            <Text style={styles.title}>Get Verified</Text>
            <Text style={styles.subtitle}>
                Complete verification to access all features
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/country')}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Start Verification</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        width: '100%',
        maxWidth: 300,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});