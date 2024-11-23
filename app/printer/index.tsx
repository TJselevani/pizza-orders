// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import ThermalPrinter from 'react-native-thermal-printer';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { Link } from 'expo-router';
// import { BluetoothDevice } from 'react-native-bluetooth-classic';


// const PrinterSettingsScreen: React.FC = () => {
//   const [printers, setPrinters] = useState<BluetoothDevice[]>([]);
//   const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
//   const [isPrinterConnected, setIsPrinterConnected] = useState(false);

//   useEffect(() => {
//     // Fetch Bluetooth devices
//     const fetchPrinters = async () => {
//       try {
//         const deviceList = await ThermalPrinter.getBluetoothDeviceList();
//         setPrinters(deviceList);
//       } catch (error) {
//         console.error('Error fetching printers:', error);
//         Alert.alert('Error', 'Failed to fetch Bluetooth devices.');
//       }
//     };

//     fetchPrinters();
//   }, []);

//   // Connect to a specific printer
//   const connectToPrinter = async (macAddress: string) => {
//     try {
//       await ThermalPrinter.getBluetoothDeviceList();
//       setSelectedPrinter(macAddress);
//       setIsPrinterConnected(true);
//       Alert.alert('Connected', `Successfully connected to printer at ${macAddress}`);
//     } catch (error) {
//       console.error('Connection error:', error);
//       setIsPrinterConnected(false);
//       Alert.alert('Connection Error', 'Failed to connect to printer.');
//     }
//   };

//   // Disconnect from the current printer
//   const disconnectPrinter = async () => {
//     try {
//       await ThermalPrinter.disconnectPrinter();
//       setSelectedPrinter(null);
//       setIsPrinterConnected(false);
//       Alert.alert('Disconnected', 'Printer has been disconnected.');
//     } catch (error) {
//       console.error('Disconnection error:', error);
//       Alert.alert('Disconnection Error', 'Failed to disconnect the printer.');
//     }
//   };

//   // Print a test message
//   const printTestMessage = async () => {
//     if (!isPrinterConnected) {
//       Alert.alert('No Printer Connected', 'Please connect to a printer first.');
//       return;
//     }
//     try {
//       await ThermalPrinter.printText('Test Print Message\n\n', {
//         encoding: 'CP437',
//         codepage: 0,
//         widthtimes: 2,
//         heighthtimes: 2,
//         fonttype: 1,
//       });
//       Alert.alert('Success', 'Test message sent to printer.');
//     } catch (error) {
//       console.error('Printing error:', error);
//       Alert.alert('Print Error', 'Failed to print the test message.');
//     }
//   };

//   const themedTextStyle = theme === 'dark' ? styles.textDark : styles.textLight;

//   return (
//     <SafeAreaWithStatusBar>
//       <View style={styles.header}>
//         <Text></Text>
//         <Text style={[styles.headerTitle, themedTextStyle]}>Available Printers</Text>
//         <Link href="/" asChild>
//           <TouchableOpacity>
//             <Ionicons
//               name="receipt-outline"
//               size={28}
//               color={theme === 'dark' ? '#ffffff' : '#121212'}
//             />
//           </TouchableOpacity>
//         </Link>
//       </View>

//       <FlatList
//         data={printers}
//         keyExtractor={(item) => item.macAddress}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.printerItem}
//             onPress={() => connectToPrinter(item.macAddress)}
//           >
//             <View>
//               <Text style={styles.deviceName}>{item.deviceName || 'Unknown Device'}</Text>
//               <Text style={styles.macAddress}>{item.macAddress}</Text>
//             </View>
//             {selectedPrinter === item.macAddress && (
//               <Ionicons name="checkmark-circle" size={24} color="green" />
//             )}
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyListContainer}>
//             <Text style={styles.emptyListText}>No printers found</Text>
//           </View>
//         }
//       />

//       {selectedPrinter && (
//         <View style={styles.actions}>
//           <TouchableOpacity style={styles.testButton} onPress={printTestMessage}>
//             <Text style={styles.buttonText}>Print Test Message</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.disconnectButton} onPress={disconnectPrinter}>
//             <Text style={styles.buttonText}>Disconnect Printer</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaWithStatusBar>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 24,
//     marginBottom: 40,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//   },
//   textDark: {
//     color: '#ffffff',
//   },
//   textLight: {
//     color: '#000000',
//   },
//   printerItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     padding: 16,
//     marginBottom: 8,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//   },
//   deviceName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   macAddress: {
//     color: '#6b7280',
//   },
//   emptyListContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyListText: {
//     marginTop: 16,
//     textAlign: 'center',
//     color: '#6b7280',
//   },
//   actions: {
//     marginTop: 24,
//   },
//   testButton: {
//     backgroundColor: '#3b82f6',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   disconnectButton: {
//     backgroundColor: '#ef4444',
//     padding: 16,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     textAlign: 'center',
//     color: '#ffffff',
//     fontWeight: '600',
//   },
// });

// export default PrinterSettingsScreen;
