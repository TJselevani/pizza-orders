import React, { useEffect, useState } from "react";
import BluetoothClassic, {
  BluetoothDevice,
} from "react-native-bluetooth-classic";
import BluetoothStateManager from "react-native-bluetooth-state-manager";

const BluetoothManager = () => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isTogglingBluetooth, setIsTogglingBluetooth] = useState(false);
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>(
    []
  );
  const [connectedDevice, setConnectedDevice] =
    useState<BluetoothDevice | null>(null);

  useEffect(() => {
    const initializeBluetoothState = async () => {
      const state = await BluetoothStateManager.getState();
      setIsBluetoothEnabled(state === "PoweredOn");
      if (state === "PoweredOn") {
        await fetchPairedDevices(); // Fetch paired devices if Bluetooth is on
      }
    };

    initializeBluetoothState();

    // Listen for changes in Bluetooth state
    const subscription = BluetoothStateManager.onStateChange((state) => {
      setIsBluetoothEnabled(state === "PoweredOn");
      if (state !== "PoweredOn") {
        // Clear devices and connection on Bluetooth disable
        setPairedDevices([]);
        setAvailableDevices([]);
        setConnectedDevice(null);
      }
    }, true);

    return () => {
      subscription.remove();
    };
  }, []);

  const toggleBluetooth = async () => {
    if (isTogglingBluetooth) return; // Prevent multiple toggles
    setIsTogglingBluetooth(true);

    try {
      if (isBluetoothEnabled) {
        await BluetoothStateManager.disable();
        console.log("Bluetooth Disabled");
        setPairedDevices([]);
        setAvailableDevices([]);
        setConnectedDevice(null);
      } else {
        await BluetoothStateManager.enable();
        console.log("Bluetooth Enabled");
        await fetchPairedDevices(); // Fetch paired devices when Bluetooth is enabled
      }
      setIsBluetoothEnabled(!isBluetoothEnabled);
    } catch (error) {
      console.error("Error toggling Bluetooth:", error);
    } finally {
      setIsTogglingBluetooth(false);
    }
  };

  const fetchPairedDevices = async () => {
    try {
      const devices = await BluetoothClassic.getBondedDevices();
      setPairedDevices(devices);
      console.log("Paired devices:", devices.length);
    } catch (error) {
      console.error(`Error fetching paired devices: ${error}`);
    }
  };

  const scanForDevices = async () => {
    try {
      setIsSearching(true);
      console.log("Starting discovery for available devices...");

      // Start a timer to cancel discovery after 30 seconds
      const timeout = setTimeout(async () => {
        console.log("Cancelling device discovery after timeout...");
        await BluetoothClassic.cancelDiscovery();
        setIsSearching(false);
      }, 30000); // 30 seconds

      const devices = await BluetoothClassic.startDiscovery();
      clearTimeout(timeout); // Clear the timeout if discovery completes early
      setAvailableDevices(devices);
      console.log("Available devices:", devices);
    } catch (error) {
      console.error(`Error scanning for devices: ${error}`);
    } finally {
      // Ensure discovery is canceled if it hasn't already been
      await BluetoothClassic.cancelDiscovery();
      setIsSearching(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      await BluetoothClassic.connectToDevice(device.id);
      setConnectedDevice(device);
      console.log(`Connected to ${device.name}`);
    } catch (error) {
      console.error(`Error connecting to device ${device.name}:`, error);
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) {
      console.log("No device connected");
      return;
    }

    try {
      await BluetoothClassic.disconnectFromDevice(connectedDevice.address);
      console.log(`Disconnected from ${connectedDevice.name}`);
      setConnectedDevice(null);
    } catch (error) {
      console.error(`Error disconnecting from device:`, error);
    }
  };

  const reconnectDevice = async () => {
    if (!connectedDevice) {
      console.log("No device to reconnect");
      return;
    }

    try {
      await BluetoothClassic.connectToDevice(connectedDevice.id);
      console.log(`Reconnected to ${connectedDevice.name}`);
    } catch (error) {
      console.error(`Error reconnecting to device:`, error);
    }
  };

  const isConnected = () => connectedDevice !== null;

  return {
    isBluetoothEnabled,
    isTogglingBluetooth,
    pairedDevices,
    availableDevices,
    connectedDevice,
    toggleBluetooth,
    fetchPairedDevices,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    reconnectDevice,
    isConnected,
    isSearching,
  };
};

export default BluetoothManager;

// import React, { useEffect, useState } from "react";
// import BluetoothClassic, {
//   BluetoothDevice,
// } from "react-native-bluetooth-classic";
// import BluetoothStateManager from "react-native-bluetooth-state-manager";

// const BluetoothManager = () => {
//   const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
//   const [isTogglingBluetooth, setIsTogglingBluetooth] = useState(false);
//   const [devices, setDevices] = useState<BluetoothDevice[]>([]);
//   const [connectedDevice, setConnectedDevice] =
//     useState<BluetoothDevice | null>(null);

//   useEffect(() => {
//     const initializeBluetoothState = async () => {
//       const state = await BluetoothStateManager.getState();
//       setIsBluetoothEnabled(state === "PoweredOn");
//     };

//     initializeBluetoothState();

//     // Listen for changes in Bluetooth state
//     const subscription = BluetoothStateManager.onStateChange((state) => {
//       setIsBluetoothEnabled(state === "PoweredOn");
//       if (state !== "PoweredOn") {
//         // Clear devices and connection on Bluetooth disable
//         setDevices([]);
//         setConnectedDevice(null);
//       }
//     }, true);

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const toggleBluetooth = async () => {
//     if (isTogglingBluetooth) return; // Prevent multiple toggles
//     setIsTogglingBluetooth(true);

//     try {
//       if (isBluetoothEnabled) {
//         await BluetoothStateManager.disable();
//         console.log("Bluetooth Disabled");
//         setDevices([]);
//         setConnectedDevice(null);
//       } else {
//         await BluetoothStateManager.enable();
//         console.log("Bluetooth Enabled");
//         await scanForDevices();
//       }
//       setIsBluetoothEnabled(!isBluetoothEnabled);
//     } catch (error) {
//       console.error("Error toggling Bluetooth:", error);
//     } finally {
//       setIsTogglingBluetooth(false);
//     }
//   };

//   const scanForDevices = async () => {
//     try {
//       const availableDevices = await BluetoothClassic.getBondedDevices();
//       setDevices(availableDevices);
//       console.log("Devices found:", availableDevices);
//     } catch (error) {
//       console.error(`Error scanning for devices: ${error}`);
//     }
//   };

//   const connectToDevice = async (device: BluetoothDevice) => {
//     try {
//       await BluetoothClassic.connectToDevice(device.id);
//       setConnectedDevice(device);
//       console.log(`Connected to ${device.name}`);
//     } catch (error) {
//       console.error(`Error connecting to device ${device.name}:`, error);
//     }
//   };

//   const disconnectDevice = async () => {
//     if (!connectedDevice) {
//       console.log("No device connected");
//       return;
//     }

//     try {
//       await BluetoothClassic.disconnectFromDevice(connectedDevice.address);
//       console.log(`Disconnected from ${connectedDevice.name}`);
//       setConnectedDevice(null);
//     } catch (error) {
//       console.error(`Error disconnecting from device:`, error);
//     }
//   };

//   const reconnectDevice = async () => {
//     if (!connectedDevice) {
//       console.log("No device to reconnect");
//       return;
//     }

//     try {
//       await BluetoothClassic.connectToDevice(connectedDevice.id);
//       console.log(`Reconnected to ${connectedDevice.name}`);
//     } catch (error) {
//       console.error(`Error reconnecting to device:`, error);
//     }
//   };

//   const isConnected = () => connectedDevice !== null;

//   return {
//     isBluetoothEnabled,
//     isTogglingBluetooth,
//     devices,
//     connectedDevice,
//     toggleBluetooth,
//     scanForDevices,
//     connectToDevice,
//     disconnectDevice,
//     reconnectDevice,
//     isConnected,
//   };
// };

// export default BluetoothManager;
