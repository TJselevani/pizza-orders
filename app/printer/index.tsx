import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import MyPrinter from "../../components/MyThermalPrinter"; // Ensure the path is correct for the ThermalPrinter class
import Ionicons from "@expo/vector-icons/Ionicons";
import { IBLEPrinter } from "react-native-thermal-receipt-printer";

const PrinterSettingsScreen: React.FC = () => {
  const [printers, setPrinters] = useState<IBLEPrinter[] | any[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [isPrinterConnected, setIsPrinterConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        setIsLoading(true);
        await MyPrinter.initializePrinter();
        const deviceList = await MyPrinter.getDeviceList();
        setPrinters(deviceList);
      } catch (error) {
        console.error("Error fetching printers:", error);
        Alert.alert("Error", "Failed to fetch Bluetooth devices.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrinters();
  }, []);

  const connectToPrinter = async (address: string) => {
    try {
      await MyPrinter.connectToPrinter(address);
      setSelectedPrinter(address);
      setIsPrinterConnected(true);
      Alert.alert(
        "Connected",
        `Successfully connected to printer at ${address}`
      );
    } catch (error) {
      console.error("Connection error:", error);
      setIsPrinterConnected(false);
      Alert.alert("Connection Error", "Failed to connect to printer.");
    }
  };

  const disconnectPrinter = async () => {
    try {
      await MyPrinter.disconnectPrinter();
      setSelectedPrinter(null);
      setIsPrinterConnected(false);
      Alert.alert("Disconnected", "Printer has been disconnected.");
    } catch (error) {
      console.error("Disconnection error:", error);
      Alert.alert("Disconnection Error", "Failed to disconnect the printer.");
    }
  };

  const printTestMessage = async () => {
    if (!isPrinterConnected) {
      Alert.alert("No Printer Connected", "Please connect to a printer first.");
      return;
    }
    try {
      await MyPrinter.printText("Test Print Message\n\n");
      Alert.alert("Success", "Test message sent to printer.");
    } catch (error) {
      console.error("Printing error:", error);
      Alert.alert("Print Error", "Failed to print the test message.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Available Printers</Text>
      {isLoading ? (
        <Text>Loading Printers...</Text>
      ) : (
        <FlatList
          data={printers}
          keyExtractor={(item: IBLEPrinter) => item.inner_mac_address}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.printerItem}
              onPress={() => connectToPrinter(item.inner_mac_address)}
            >
              <View>
                <Text style={styles.deviceName}>
                  {item.device_name || "Unknown Device"}
                </Text>
                <Text style={styles.macAddress}>{item.inner_mac_address}</Text>
              </View>
              {selectedPrinter === item.inner_mac_address && (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>No printers found</Text>
            </View>
          }
        />
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
});

export default PrinterSettingsScreen;
