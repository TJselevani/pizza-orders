import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, List, Switch } from "react-native-paper";
import { router } from "expo-router";
import { clearAuth, getStoredAuth } from "../../utils/auth";
import React from "react";
import BluetoothManager from "../../components/MyBluetoothManager";
import MyPrinter from "../../components/MyThermalPrinter";

export default function Settings() {
  const [userEmail, setUserEmail] = useState("");
  const { isBluetoothEnabled } = BluetoothManager();
  const isPrinterConnected = MyPrinter.isPrinterConnected();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const auth = await getStoredAuth();
    if (auth?.email) {
      setUserEmail(auth.email);
    }
  };

  const handleLogout = async () => {
    await clearAuth();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Email"
          description={userEmail}
          left={(props) => <List.Icon {...props} icon="email" color="gray" />}
        />
        <List.Item
          title="Bluetooth"
          left={(props) => (
            <List.Icon
              {...props}
              icon="bluetooth"
              color={isBluetoothEnabled ? "green" : "gray"}
            />
          )}
          onPress={() => router.push("/bluetooth")}
        />
        <List.Item
          title="Printer"
          left={(props) => (
            <List.Icon
              {...props}
              icon="printer"
              color={isPrinterConnected ? "green" : "gray"}
            />
          )}
          onPress={() => router.push("/printer")}
        />
        <List.Item
          title="Logout"
          left={(props) => <List.Icon {...props} icon="logout" color="gray" />}
          onPress={handleLogout}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
