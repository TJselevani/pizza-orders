import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, List, Switch } from "react-native-paper";
import { router } from "expo-router";
import { clearAuth, getStoredAuth } from "../../utils/auth";
import React from "react";

export default function Settings() {
  const [userEmail, setUserEmail] = useState("");

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
          left={(props) => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          title="Bluetooth"
          left={(props) => <List.Icon {...props} icon="bluetooth" />}
          onPress={() => router.push("/bluetooth")}
        />
        <List.Item
          title="Logout"
          left={(props) => <List.Icon {...props} icon="logout" />}
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
