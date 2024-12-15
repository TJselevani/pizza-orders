import { PermissionsAndroid, ToastAndroid } from "react-native";

const requestPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    );
    const scanGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    );
    const locationGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (
      granted === PermissionsAndroid.RESULTS.GRANTED &&
      scanGranted === PermissionsAndroid.RESULTS.GRANTED &&
      locationGranted === PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Bluetooth permissions granted");
    } else {
      console.log("Bluetooth or location permissions denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const requestBluetoothPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    if (
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Bluetooth Connect permission granted");
    } else {
      ToastAndroid.show(
        "Bluetooth Connect permission denied",
        ToastAndroid.LONG
      );
    }

    if (
      granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Bluetooth Scan permission granted");
    } else {
      ToastAndroid.show("Bluetooth Scan permission denied", ToastAndroid.LONG);
    }

    if (
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log("Location permission granted");
    } else {
      ToastAndroid.show("Location permission denied", ToastAndroid.LONG);
    }
  } catch (err) {
    console.warn(err);
  }
};

export { requestBluetoothPermissions, requestPermissions };
