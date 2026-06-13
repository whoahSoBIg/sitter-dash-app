import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { userType } = useApp();

  // Auth guard: whenever userType is cleared (sign out), navigate to landing
  // at the root Stack level — not from within the tabs navigator.
  useEffect(() => {
    if (userType === null) {
      router.replace("/auth");
    }
  }, [userType]);

  return (
    <S<Stack.Screen name="auth" options={{ headerShown: false }} /> }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sitter/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="sitter/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="booking/step1" options={{ headerShown: false }} />
      <Stack.Screen name="booking/step2" options={{ headerShown: false }} />
      <Stack.Screen name="booking/step3" options={{ headerShown: false }} />
      <Stack.Screen name="booking/step4" options={{ headerShown: false }} />
      <Stack.Screen name="session/live" options={{ headerShown: false }} />
      <Stack.Screen name="session/chat" options={{ headerShown: false }} />
      <Stack.Screen name="session/tip" options={{ headerShown: false }} />
      <Stack.Screen name="session/enroute" options={{ headerShown: false }} />
      <Stack.Screen name="session/receipt" options={{ headerShown: false }} />
      <Stack.Screen name="emergency" options={{ headerShown: false }} />
      <Stack.Screen name="ratings" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
