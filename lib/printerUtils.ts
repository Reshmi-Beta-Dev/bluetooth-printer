// printerUtils.ts

// Define the printer name prefix (for MUNBYN IMP002 devices)
export const PRINTER_NAME_PREFIX = 'P502A-'; // MUNBYN printer name format

// ESC/POS Commands for various print actions
export const ESC_POS_CUT_PAPER_CMD = [0x1D, 0x56, 0x42, 0x00]; // Paper cutting command

// Formatting commands for ESC/POS (Bold, Center alignment, etc.)
export const FORMAT_COMMANDS = {
  BOLD_ON: [0x1B, 0x45, 0x01],
  BOLD_OFF: [0x1B, 0x45, 0x00],
  CENTER: [0x1B, 0x61, 0x01],
  LEFT: [0x1B, 0x61, 0x00],
  RIGHT: [0x1B, 0x61, 0x02],
  DOUBLE_WIDTH: [0x1B, 0x21, 0x10],
  NORMAL_WIDTH: [0x1B, 0x21, 0x00],
};

// Interface for defining receipt structure
export interface ReceiptTemplate {
  header: {
    logo?: string;
    businessName: string;
    address: string;
    phone: string;
  };
  orderInfo: {
    orderNumber: string;
    date: string;
    employee: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  footer: {
    message: string;
    barcode?: string;
  };
}

// Converts text to byte array for ESC/POS printing
export const textToBytes = (text: string): number[] => {
  return Array.from(new TextEncoder().encode(text));
};

// Function to connect to the printer via Web Bluetooth
export const connectToPrinter = async (): Promise<BluetoothRemoteGATTServer | null> => {
  try {
    // Request device using name prefix
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: PRINTER_NAME_PREFIX }],
      optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'], // Bluetooth Printer Service UUID
    });

    // Ensure that the device has a GATT server
    if (!device.gatt) {
      throw new Error('No GATT server available on this device');
    }

    // Connect to the GATT server (BluetoothRemoteGATTServer)
    const server = await device.gatt.connect();
    console.log('Connected to printer:', device.name);

    return server;
  } catch (error) {
    console.error('Error connecting to printer:', error);
    return null;
  }
};

// Function to send commands to the printer
export const sendToPrinter = async (server: BluetoothRemoteGATTServer, commands: number[]): Promise<void> => {
  try {
    // Get the Bluetooth service and characteristic (replace with correct UUID)
    const serviceUUID = '00001101-0000-1000-8000-00805f9b34fb'; // Standard printer service
    const characteristicUUID = '0000XXXX-0000-1000-8000-00805f9b34fb'; // Replace with the characteristic UUID of your printer

    const service = await server.getPrimaryService(serviceUUID);
    const characteristic = await service.getCharacteristic(characteristicUUID);

    // Send the command data to the printer via the Bluetooth characteristic
    await characteristic.writeValue(new Uint8Array(commands));
    console.log('Commands sent to printer:', commands);
  } catch (error) {
    console.error('Error sending commands to the printer:', error);
  }
};

// Function to print a receipt
export const printReceipt = async (template: ReceiptTemplate): Promise<void> => {
  try {
    const commands: number[] = [];

    // Header
    commands.push(...FORMAT_COMMANDS.CENTER);
    commands.push(...FORMAT_COMMANDS.BOLD_ON);
    commands.push(...textToBytes(template.header.businessName));
    commands.push(...FORMAT_COMMANDS.BOLD_OFF);

    // Address
    commands.push(...textToBytes(template.header.address));
    commands.push(...textToBytes(template.header.phone));

    // Order Info
    commands.push(...FORMAT_COMMANDS.LEFT);
    commands.push(...textToBytes(`Order: ${template.orderInfo.orderNumber}`));
    commands.push(...textToBytes(`Date: ${template.orderInfo.date}`));

    // Items
    template.items.forEach(item => {
      commands.push(...FORMAT_COMMANDS.LEFT);
      commands.push(...textToBytes(`${item.name} x${item.quantity} @ $${item.price}`));
    });

    // Totals
    commands.push(...FORMAT_COMMANDS.RIGHT);
    commands.push(...textToBytes(`Subtotal: ${template.totals.subtotal}`));
    commands.push(...textToBytes(`Tax: ${template.totals.tax}`));
    commands.push(...textToBytes(`Total: ${template.totals.total}`));

    // Footer
    commands.push(...FORMAT_COMMANDS.CENTER);
    commands.push(...textToBytes(template.footer.message));

    // Send to printer
    const server = await connectToPrinter();
    if (server) {
      await sendToPrinter(server, commands);
    }
  } catch (error) {
    console.error('Error printing receipt:', error);
  }
};
