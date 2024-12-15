import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BluetoothManager from "../../components/MyBluetoothManager";

const BluetoothSettings = () => {
  const {
    isBluetoothEnabled,
    toggleBluetooth,
    pairedDevices,
    availableDevices,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    isSearching,
    isConnected,
  } = BluetoothManager();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container}>
        {/* Bluetooth Switch Section */}
        <View style={styles.headerContainer}>
          <View style={styles.toggleContainer}>
            <Text style={styles.headerTitle}>Bluetooth</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isBluetoothEnabled ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleBluetooth}
              value={isBluetoothEnabled}
            />
          </View>
        </View>

        {/* Devices Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Paired Devices</Text>
          </View>
          <FlatList
            data={pairedDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.deviceCard}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceId}>{item.id}</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={disconnectDevice}
                >
                  <Icon
                    name="exit"
                    size={20}
                    color={isConnected() ? "green" : "gray"}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No paired devices found</Text>
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            {!isSearching && (
              <TouchableOpacity onPress={scanForDevices}>
                <Icon name="refresh" size={20} color="#555" />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={availableDevices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceCard}
                onPress={() => connectToDevice(item)}
              >
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceId}>{item.id}</Text>
                </View>
                <Icon name="add-circle-outline" size={20} color="#007BFF" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No available devices found</Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BluetoothSettings;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deviceId: {
    fontSize: 12,
    color: "#888",
  },
  actionButton: {
    // backgroundColor: "#007BFF",
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginVertical: 16,
  },
});
