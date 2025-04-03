import { router } from 'expo-router';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { ChevronDown, MapPin } from 'lucide-react-native';
import { useVerification } from '@/context/VerificationContext';

export default function CountrySelectionScreen() {
    const { state, dispatch } = useVerification();
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleContinue = async () => {
        if (!selectedCountry) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            dispatch({ type: 'SET_COUNTRY', payload: selectedCountry });
            router.push('/id-type');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to save country selection' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.step}>Step {state.step} of 3</Text>
                    <Text style={styles.title}>Select Your Country</Text>
                </View>

                <Pressable
                    style={[styles.dropdown, isDropdownOpen && styles.dropdownOpen]}
                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <View style={styles.dropdownContent}>
                        <MapPin size={24} color="#666" />
                        <Text style={styles.dropdownText}>
                            {selectedCountry || 'Select a country'}
                        </Text>
                        <ChevronDown size={24} color="#666" />
                    </View>
                </Pressable>

                {isDropdownOpen && (
                    <View style={styles.optionsContainer}>
                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                setSelectedCountry('Kenya');
                                setIsDropdownOpen(false);
                            }}
                        >
                            <Text style={styles.optionText}>Kenya</Text>
                        </Pressable>
                    </View>
                )}

                {state.error && (
                    <Text style={styles.error}>{state.error}</Text>
                )}

                <TouchableOpacity
                    style={[styles.button, !selectedCountry && styles.buttonDisabled]}
                    disabled={!selectedCountry || state.loading}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                >
                    {state.loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={[styles.buttonText, !selectedCountry && styles.buttonTextDisabled]}>
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
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },
    dropdownOpen: {
        borderColor: '#007AFF',
    },
    dropdownContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    optionsContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 20,
    },
    option: {
        padding: 16,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
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