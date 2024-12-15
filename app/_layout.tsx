import { Stack, Tabs } from "expo-router";
import { PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { getStoredAuth } from "../utils/auth";
import React from "react";
import { LogBox } from "react-native";
import {
  requestBluetoothPermissions,
  requestPermissions,
} from "../utils/permissions";

LogBox.ignoreLogs([
  "`new NativeEventEmitter()` was called with a non-null argument",
]);

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    requestPermissions();
    requestBluetoothPermissions();
    checkAuth();
  }, [segments]);

  const checkAuth = async () => {
    const auth = await getStoredAuth();
    const isAuthGroup = segments[0] === "(auth)";

    if (!auth && !isAuthGroup) {
      router.replace("/");
    } else if (auth && isAuthGroup) {
      router.replace("/orders");
    }
  };

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}
