import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IBLEPrinter } from "react-native-thermal-receipt-printer";
import BluetoothManager from "../../components/MyBluetoothManager";
import thermalPrinter from "../../components/MyThermalPrinter";

const PrinterSettingsScreen: React.FC = () => {
  const { isBluetoothEnabled } = BluetoothManager();
  const [printers, setPrinters] = useState<IBLEPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        setIsLoading(true);
        await thermalPrinter.initializePrinter();
        const deviceList = await thermalPrinter.getDeviceList();
        setPrinters(deviceList);
      } catch (error) {
        handleError("Failed to fetch Bluetooth devices.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrinters();
  }, []);

  const handleError = (message: string) => {
    console.error(message);
    Alert.alert("Error", message);
  };

  const connectToPrinter = useCallback(async (address: string) => {
    try {
      await thermalPrinter.connectToPrinter(address);
      setSelectedPrinter(address);
      setIsPrinterConnected(true);
      Alert.alert(
        "Connected",
        `Successfully connected to printer at ${address}`
      );
    } catch (error) {
      handleError("Failed to connect to printer.");
      setIsPrinterConnected(false);
    }
  }, []);

  const disconnectPrinter = useCallback(async () => {
    try {
      await thermalPrinter.disconnectPrinter();
      setSelectedPrinter(null);
      setIsPrinterConnected(false);
      Alert.alert("Disconnected", "Printer has been disconnected.");
    } catch (error) {
      handleError("Failed to disconnect the printer.");
    }
  }, []);

  const printTestMessage = useCallback(async () => {
    if (!isPrinterConnected) {
      Alert.alert("No Printer Connected", "Please connect to a printer first.");
      return;
    }
    try {
      await thermalPrinter.printText("Test Print Message\n\n");
      Alert.alert("Success", "Test message sent to printer.");
    } catch (error) {
      handleError("Failed to print the test message.");
    }
  }, [isPrinterConnected]);

  const refreshDevices = async () => {
    if (!isBluetoothEnabled) {
      Alert.alert(
        "Bluetooth Disabled",
        "Please enable Bluetooth to scan for devices."
      );
      return;
    }

    try {
      setIsLoading(true);
      const deviceList = await thermalPrinter.getDeviceList();
      setPrinters(deviceList);
      Alert.alert(
        "Devices Refreshed",
        "Successfully refreshed the list of devices."
      );
    } catch (error) {
      handleError("Failed to refresh devices.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Available Printers</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <>
          <FlatList
            data={printers}
            keyExtractor={(item: IBLEPrinter) => item.inner_mac_address}
            renderItem={({ item }) => {
              const { device_name, inner_mac_address } = item;
              return (
                <TouchableOpacity
                  style={styles.printerItem}
                  onPress={() => connectToPrinter(inner_mac_address)}
                >
                  <View>
                    <Text style={styles.deviceName}>
                      {device_name || "Unknown Device"}
                    </Text>
                    <Text style={styles.macAddress}>{inner_mac_address}</Text>
                  </View>
                  {selectedPrinter === inner_mac_address && (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>No printers found</Text>
              </View>
            }
          />
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshDevices}
          >
            <Text style={styles.buttonText}>Refresh Devices</Text>
          </TouchableOpacity>
        </>
      )}

      {selectedPrinter && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={printTestMessage}
          >
            <Text style={styles.buttonText}>Print Test Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={disconnectPrinter}
          >
            <Text style={styles.buttonText}>Disconnect Printer</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isBluetoothEnabled && (
        <View style={styles.bluetoothWarning}>
          <Text style={styles.warningText}>
            Bluetooth is turned off. Please enable it to scan for devices.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: "800" },
  printerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  deviceName: { fontSize: 16, fontWeight: "600" },
  macAddress: { color: "#6b7280" },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: { marginTop: 16, textAlign: "center", color: "#6b7280" },
  actions: { marginTop: 24 },
  testButton: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  disconnectButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: { textAlign: "center", color: "#ffffff", fontWeight: "600" },

  // New styles for refresh button and bluetooth warning
  refreshButton: {
    backgroundColor: "#34D399",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  bluetoothWarning: {
    backgroundColor: "#FFCCCB",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  warningText: {
    color: "#D8000C",
    fontWeight: "600",
  },
});

export default PrinterSettingsScreen;
