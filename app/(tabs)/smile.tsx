import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { SmileID, SmileIDEnhancedDocumentVerificationView, SmileIDSmartSelfieEnrollmentView } from "@smile_identity/react-native"

import { useEffect } from 'react'


export default function Smile() {

    useEffect(() => {
        SmileID.initialize(true)
    }, [])

    return (
        <SafeAreaView>
            <View style={{ flex: 1 }}>
                <Text>Smile</Text>
                {/* <SmileIDEnhancedDocumentVerificationView
                    allowAgentMode={false} // true if you need to use the secondary camera
                    showInstructions={true} // show instructions before capture
                    countryCode={'KE'}
                    documentType={'NATIONAL_ID'}
                    captureBothSides={true}
                    allowGalleryUpload={false}
                    useStrictMode={true} // set to true for enhanced SmartSelfie™ capture
                    consentInformation={{ //required for enhanced document verification
                        consentGrantedDate: new Date().toISOString(),  // date in iso string format for when user granted consent
                        personalDetailsConsentGranted: true,  // set true if user has agreed to personal details, will default to false
                        contactInfoConsentGranted: true, // set true if user has agreed to contact information, will default to false
                        documentInfoConsentGranted: true, // set true if user has agreed to document information, will default to false
                    }}
                    style={{ width: '100%', height: '100%' }} //fill the entire view
                    onResult={(event) => {
                    }}
                /> */}

                <SmileIDSmartSelfieEnrollmentView
                    allowAgentMode={true} // true if you need to use the secondary camera
                    userId="random-user-id/generated-user-id"
                    style={{ width: '100%', height: '100%' }} //fill the entire view
                    onResult={(event) => {
                        console.log("event", event)
                    }}
                />


            </View>
        </SafeAreaView >
    );
}