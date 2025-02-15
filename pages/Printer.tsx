// src/components/Printer.tsx
import { useState, useEffect } from 'react';
import { printReceipt } from '../lib/printerUtils';  // Import the printReceipt function from printerUtils

const PrinterComponent = () => {
  const [isPrinting, setIsPrinting] = useState(false);  // State to track printing status
  const [isConnected, setIsConnected] = useState(false);  // State to track Bluetooth connection status

  useEffect(() => {
    // Code to check Bluetooth connection status on initial load if needed
    // (You could implement additional logic to check the connection status here)
  }, []);

  const handlePrint = async () => {
    setIsPrinting(true);  // Set printing status to true when the print action starts

    // Sample receipt template
    const receiptTemplate = {
      header: {
        businessName: 'My Shop',
        address: '123 Main St',
        phone: '555-555-5555',
      },
      orderInfo: {
        orderNumber: '001',
        date: '2025-02-15',
        employee: 'Jane Doe',
      },
      items: [
        { name: 'Item 1', quantity: 2, price: 10.99 },
        { name: 'Item 2', quantity: 1, price: 5.49 },
      ],
      totals: {
        subtotal: 27.47,
        tax: 2.75,
        total: 30.22,
      },
      footer: {
        message: 'Thank you for shopping with us!',
      },
    };

    try {
      // Attempt to send the print job to the printer
      await printReceipt(receiptTemplate);
      alert('Receipt printed successfully!');
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Failed to print receipt!');
    } finally {
      setIsPrinting(false);  // Set printing status back to false after printing attempt
    }
  };

  const handleConnect = async () => {
    // Logic for connecting to the printer via Bluetooth
    setIsConnected(true);
    // Optionally, implement connection code to check printer status, Bluetooth connection, etc.
    alert('Connected to the printer!');
  };

  const handleDisconnect = async () => {
    // Logic for disconnecting from the printer
    setIsConnected(false);
    alert('Disconnected from the printer!');
  };

  return (
    <div>
      <h1>Printer Setup</h1>

      {/* Connection button */}
      <button onClick={handleConnect} disabled={isConnected || isPrinting}>
        {isConnected ? 'Printer Connected' : 'Connect to Printer'}
      </button>
      <button onClick={handleDisconnect} disabled={!isConnected || isPrinting}>
        {isConnected ? 'Disconnect from Printer' : 'Printer Not Connected'}
      </button>

      {/* Print button */}
      <div>
        <button onClick={handlePrint} disabled={isPrinting || !isConnected}>
          {isPrinting ? 'Printing...' : 'Print Receipt'}
        </button>
      </div>
    </div>
  );
};

export default PrinterComponent;
