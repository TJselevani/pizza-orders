import { BLEPrinter, IBLEPrinter } from "react-native-thermal-receipt-printer";

interface PrinterState extends Partial<IBLEPrinter> {
  connected: boolean;
  printerName?: string;
  printerType?: "ble";
}

class ThermalPrinter {
  private state: PrinterState = { connected: false };

  async initializePrinter(): Promise<void> {
    try {
      await BLEPrinter.init();
      console.log("Bluetooth printer initialized.");
    } catch (error) {
      console.error("Error initializing printer:", error);
      throw error;
    }
  }

  async getDeviceList(): Promise<IBLEPrinter[]> {
    try {
      const devices = await BLEPrinter.getDeviceList();
      console.log("Discovered devices:", devices);
      return devices;
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }

  async connectToPrinter(macAddress: string): Promise<void> {
    try {
      await BLEPrinter.connectPrinter(macAddress);
      this.state = {
        connected: true,
        printerName: macAddress,
        printerType: "ble",
      };
      console.log("Connected to printer:", macAddress);
    } catch (error) {
      console.error("Error connecting to printer:", error);
      throw error;
    }
  }

  async disconnectPrinter(): Promise<void> {
    try {
      await BLEPrinter.closeConn();
      this.state = {
        connected: false,
        printerName: undefined,
        printerType: undefined,
      };
      console.log("Printer disconnected.");
    } catch (error) {
      console.error("Error disconnecting printer:", error);
    }
  }

  async printText(data: string): Promise<void> {
    if (!this.state.connected) {
      throw new Error("No printer connected.");
    }
    try {
      await BLEPrinter.printText(data);
      console.log("Text sent to printer:", data);
    } catch (error) {
      console.error("Error printing text:", error);
      throw error;
    }
  }

  async printBill(data: string): Promise<void> {
    if (!this.state.connected) {
      throw new Error("No printer connected.");
    }
    try {
      await BLEPrinter.printBill(data);
      console.log("Bill sent to printer:", data);
    } catch (error) {
      console.error("Error printing Bill:", error);
      throw error;
    }
  }

  // async printImage(imageUrl: string, options: { imageWidth: number; paddingX: number }): Promise<void> {
  //   if (!this.state.connected) {
  //     throw new Error("No printer connected.");
  //   }
  //   try {
  //     await BLEPrinter.printImage(imageUrl, options);
  //     console.log("Image sent to printer:", imageUrl);
  //   } catch (error) {
  //     console.error("Error printing image:", error);
  //     throw error;
  //   }
  // }

  isPrinterConnected(): boolean {
    return this.state.connected;
  }

  getPrinterState(): PrinterState {
    return this.state;
  }
}

const thermalPrinter = new ThermalPrinter();
export default thermalPrinter;
