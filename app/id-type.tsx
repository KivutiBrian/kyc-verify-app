import { router } from 'expo-router';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { CreditCard, Import as Passport } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';

type IDType = 'national' | 'passport' | null;

export default function IDTypeSelectionScreen() {
    const { state, dispatch } = useVerification();
    const [selectedType, setSelectedType] = useState<IDType>(null);

    const handleContinue = async () => {
        if (!selectedType) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch({ type: 'SET_ID_TYPE', payload: selectedType });
            router.push('/instructions');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to save ID type selection' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.step}>Step {state.step} of 3</Text>
                    <Text style={styles.title}>Select ID Type</Text>
                </View>

                <TouchableOpacity
                    style={[styles.option, selectedType === 'national' && styles.optionSelected]}
                    onPress={() => setSelectedType('national')}
                    activeOpacity={0.7}
                >
                    <CreditCard size={24} color={selectedType === 'national' ? '#007AFF' : '#666'} />
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionTitle, selectedType === 'national' && styles.optionTitleSelected]}>
                            National ID
                        </Text>
                        <Text style={styles.optionDescription}>
                            Kenya National Identity Card
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, selectedType === 'passport' && styles.optionSelected]}
                    onPress={() => setSelectedType('passport')}
                    activeOpacity={0.7}
                >
                    <Passport size={24} color={selectedType === 'passport' ? '#007AFF' : '#666'} />
                    <View style={styles.optionContent}>
                        <Text style={[styles.optionTitle, selectedType === 'passport' && styles.optionTitleSelected]}>
                            Passport
                        </Text>
                        <Text style={styles.optionDescription}>
                            International Passport
                        </Text>
                    </View>
                </TouchableOpacity>

                {state.error && (
                    <Text style={styles.error}>{state.error}</Text>
                )}

                <TouchableOpacity
                    style={[styles.button, !selectedType && styles.buttonDisabled]}
                    disabled={!selectedType || state.loading}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    {state.loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={[styles.buttonText, !selectedType && styles.buttonTextDisabled]}>
                            Continue
                        </Text>
                    )}
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
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    step: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 16,
    },
    optionSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF10',
    },
    optionContent: {
        marginLeft: 16,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    optionTitleSelected: {
        color: '#007AFF',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
    error: {
        color: '#dc2626',
        marginTop: 8,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 'auto',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonTextDisabled: {
        color: '#fff8',
    },
});