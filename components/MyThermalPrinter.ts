// components/ThermalPrinter.ts
import { NativeModules, NativeEventEmitter, Platform } from "react-native";

type ThermalPrinterState = {
  connected: boolean;
  printerName?: string;
};

class ThermalPrinter {
  private state: ThermalPrinterState = { connected: false };
  private printerModule = NativeModules.ThermalPrinterModule;

  constructor() {
    if (!this.printerModule) {
      throw new Error(
        "ThermalPrinterModule not found. Make sure it is properly linked."
      );
    }

    // Listen for Bluetooth state changes (optional, platform-dependent)
    if (Platform.OS === "android") {
      const eventEmitter = new NativeEventEmitter(this.printerModule);
      eventEmitter.addListener("onPrinterStatusChanged", this.updateState);
    }
  }

  private updateState = (status: ThermalPrinterState) => {
    this.state = status;
  };

  /**
   * Connects to the thermal printer by address.
   * @param address Bluetooth address of the printer.
   */
  async connectToPrinter(address: string): Promise<void> {
    try {
      const result = await this.printerModule.connectToPrinter(address);
      if (result.connected) {
        this.state = { connected: true, printerName: result.printerName };
        console.log("Printer connected:", result.printerName);
      } else {
        throw new Error("Failed to connect to printer.");
      }
    } catch (error) {
      console.error("Error connecting to printer:", error);
      throw error;
    }
  }

  /**
   * Disconnects from the currently connected printer.
   */
  async disconnectPrinter(): Promise<void> {
    try {
      await this.printerModule.disconnectPrinter();
      this.state = { connected: false, printerName: undefined };
      console.log("Printer disconnected.");
    } catch (error) {
      console.error("Error disconnecting from printer:", error);
    }
  }

  /**
   * Checks if the printer is currently connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isPrinterConnected(): boolean {
    return this.state.connected;
  }

  /**
   * Prints the provided data to the connected printer.
   * @param data Data to print (text or image).
   */
  async printData(data: string): Promise<void> {
    if (!this.state.connected) {
      throw new Error("No printer connected.");
    }
    try {
      await this.printerModule.printData(data);
      console.log("Data sent to printer:", data);
    } catch (error) {
      console.error("Error printing data:", error);
      throw error;
    }
  }

  /**
   * Returns the current printer state.
   */
  getPrinterState(): ThermalPrinterState {
    return this.state;
  }
}

const thermalPrinter = new ThermalPrinter();
export default thermalPrinter;
