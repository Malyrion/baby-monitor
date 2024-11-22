import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

/**
 * Temperature Context Type Definition
 * @interface TemperatureContextType
 * @property {string | null} currentTemperature - The current temperature reading
 * @property {boolean} isLoading - Loading state indicator
 * @property {string | null} error - Error message if any
 */
interface TemperatureContextType {
  /** Current temperature reading, null if not available */
  currentTemperature: string | null;
  /** Indicates if temperature data is being loaded */
  isLoading: boolean;
  /** Error message if something goes wrong, null otherwise */
  error: string | null;
}

/**
 * Interface for TemperatureContextType object structure
 * @interface TemperatureContext
 */
const TemperatureContext = createContext<TemperatureContextType>({
  currentTemperature: null,
  isLoading: true,
  error: null,
});

export const useTemperature = () => useContext(TemperatureContext);

export const TemperatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTemperature, setCurrentTemperature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      try {
        // First ensure the socket endpoint is initialized
        await fetch('/api/socket');
        
        if (!socketRef.current) {
          socketRef.current = io({
            path: '/api/socket',
            addTrailingSlash: false,
            transports: ['polling', 'websocket'], // Start with polling, then upgrade
            timeout: 60000,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });

          socketRef.current.on('connect', () => {
            console.log('Socket connected successfully');
            setIsLoading(false);
            setError(null);
          });

          socketRef.current.on('temperature', (newTemperature: string) => {
            console.log('Received temperature:', newTemperature);
            setCurrentTemperature(newTemperature);
          });

          socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setError('Connection error');
            setIsLoading(false);
          });

          socketRef.current.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
              // Server disconnected, try reconnecting
              socketRef.current?.connect();
            }
          });
        }
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError('Failed to initialize socket connection');
        setIsLoading(false);
      }
    };

    initSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection');
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run on mount

  const value = {
    currentTemperature,
    isLoading,
    error,
  };

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};