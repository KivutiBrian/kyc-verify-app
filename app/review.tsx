import { StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';

export default function ReviewScreen() {
    const { state, submitVerification } = useVerification();

    const handleSubmit = async () => {
        await submitVerification();
        if (!state.error) {
            router.push('/success');
        }
    };

    if (state.success) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.successContent}>
                        <View style={styles.successIcon}>
                            <Check size={48} color="#4CAF50" />
                        </View>
                        <Text style={styles.successTitle}>Verification Submitted</Text>
                        <Text style={styles.successMessage}>
                            Your verification request has been submitted successfully. We'll review your documents and get back to you shortly.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Review Your Photos</Text>
                    <Text style={styles.subtitle}>
                        Make sure all images are clear and readable
                    </Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ID Document</Text>
                        <View style={styles.imageContainer}>
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: state.frontImage! }} style={styles.idImage} />
                                <Text style={styles.imageLabel}>Front</Text>
                                <TouchableOpacity
                                    style={styles.retakeButton}
                                    onPress={() => router.push('/instructions?side=front')}
                                >
                                    <X size={16} color="#666" />
                                    <Text style={styles.retakeText}>Retake</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: state.backImage! }} style={styles.idImage} />
                                <Text style={styles.imageLabel}>Back</Text>
                                <TouchableOpacity
                                    style={styles.retakeButton}
                                    onPress={() => router.push('/instructions?side=back')}
                                >
                                    <X size={16} color="#666" />
                                    <Text style={styles.retakeText}>Retake</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Selfie</Text>
                        <View style={styles.selfieContainer}>
                            <Image source={{ uri: state.selfieImage! }} style={styles.selfieImage} />
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={() => router.push('/selfie-instructions')}
                            >
                                <X size={16} color="#666" />
                                <Text style={styles.retakeText}>Retake</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {state.error && (
                    <Text style={styles.error}>{state.error}</Text>
                )}

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={state.loading}
                >
                    {state.loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Check size={24} color="#fff" />
                            <Text style={styles.submitButtonText}>Submit Verification</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    imageContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    imageWrapper: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    idImage: {
        width: '100%',
        aspectRatio: 1.6,
    },
    selfieContainer: {
        alignItems: 'center',
    },
    selfieImage: {
        width: 160,
        height: 160,
        borderRadius: 80,
        marginBottom: 8,
    },
    imageLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        marginTop: 4,
        marginBottom: 8,
    },
    retakeText: {
        color: '#666',
        fontSize: 14,
        marginLeft: 4,
    },
    error: {
        color: '#dc2626',
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: '#1a237e',
        margin: 24,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    successContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});