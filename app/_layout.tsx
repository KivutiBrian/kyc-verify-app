import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { VerificationProvider } from '@/context/VerificationContext';

export default function RootLayout() {
  // useFrameworkReady();

  return (
    <VerificationProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="country" />
          <Stack.Screen name="id-type" />
          <Stack.Screen name="instructions" />
          <Stack.Screen name="selfie-instructions" />
          <Stack.Screen name="selfie" />
          <Stack.Screen name="success" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </VerificationProvider>
  );
}