import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import 'react-native-reanimated';


import { SmileID, SmileIDEnhancedDocumentVerificationView, SmileIDSmartSelfieAuthenticationEnhancedView } from "@smile_identity/react-native"

import { useEffect, useState, Suspense } from 'react'

import { Camera } from 'expo-camera'



export default function Smile() {

    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            console.log("camera permission:", status)
            setHasPermission(true);
        })().then(() => {
            SmileID.initialize(false, true).then(() => {
                console.log('initialized')

            }).catch(err => console.log('error', err))

            SmileID.setAllowOfflineMode(false).catch((e) => {
                console.log('Error setting offline mode', e);
            });
        }).catch(e => {
            console.log('error on', e)
        })
    }, []);

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        // console.log("SmileIDEnhancedDocumentVerificationView:ss", SmileIDEnhancedDocumentVerificationView)

        <SafeAreaView style={styles.safeContainer} >
            <View style={styles.container}>
                {hasPermission ? (
                    <Suspense fallback={<Text>Loading Smile ID...</Text>}>
                        <SmileIDEnhancedDocumentVerificationView
                            allowAgentMode={true}
                            showInstructions={true}
                            countryCode={'KE'}
                            documentType={'IDENTITY_CARD'}
                            captureBothSides={true}
                            allowGalleryUpload={true}
                            useStrictMode={true}
                            consentInformation={{
                                consentGrantedDate: new Date().toISOString(),
                                personalDetailsConsentGranted: true,
                                contactInfoConsentGranted: true,
                                documentInfoConsentGranted: true,
                            }}
                            style={styles.smileView}
                            onResult={(event) => {
                                console.log('event', event);
                            }}
                        />
                    </Suspense>
                ) : (
                    <Text style={{ color: 'white' }}>Initializing Smile ID</Text>
                )}
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        // backgroundColor: "white",
    },
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center", // Ensures it's centered
        alignItems: "center",
        // backgroundColor: "rgba(0, 255, 0, 0.3)"
        // backgroundColor: "red", // Debug color
    },
    smileView: {
        flex: 1, // Ensures it takes up available space
        width: "100%", // Set to a reasonable width
        height: "100%", // Adjust height
        backgroundColor: "transparent", // Debug visibility
        borderWidth: 4,
        borderColor: "red",
    },
});

