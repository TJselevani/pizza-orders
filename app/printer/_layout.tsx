import { Stack } from "expo-router";
import React from "react";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ headerTitle: "Printer Screen" }} />
    </Stack>
  );
};

export default StackLayout;
