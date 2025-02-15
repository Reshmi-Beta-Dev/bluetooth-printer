// pages/index.tsx
import { useState, useEffect } from 'react';
import PrinterComponent from './Printer';

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading process (e.g., fetching or waiting for printer connection)
  useEffect(() => {
    const loadPrinter = async () => {
      // Here you could add logic to check if the printer is available, etc.
      // For now, let's just simulate a loading process and set isLoaded to true.
      setTimeout(() => {
        setIsLoaded(true);
      }, 2000); // Simulate a 2-second load time
    };

    loadPrinter();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Printer Integration Page</h1>
      {isLoaded ? (
        <PrinterComponent />
      ) : (
        <p>Loading printer connection...</p>
      )}
    </div>
  );
};

export default HomePage;
