import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import type { HistoricalReadingsResponse } from '../pages/api/temperatures';

/**
 * Interface for individual temperature reading data
 */
interface TemperatureReading {
  temperature: string;
  timestamp: string;
  readingId: string;
}

/**
 * Interface defining the shape of the Temperature Context
 */
interface TemperatureContextType {
  currentTemperature: string | null;
  historicalReadings: TemperatureReading[];
  isLoading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
}

/**
 * Interface for the Temperature Provider Props
 */
interface TemperatureProviderProps {
  children: React.ReactNode;
}

// Create the context with undefined as initial value
const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

/**
 * Temperature Provider Component that manages temperature state and WebSocket connection
 * 
 * @component
 * @param {TemperatureProviderProps} props - The provider props
 * @returns {JSX.Element} Provider component with temperature context
 */
export const TemperatureProvider: React.FC<TemperatureProviderProps> = ({ children }) => {
  // State management
  const [currentTemperature, setCurrentTemperature] = useState<string | null>(null);
  const [historicalReadings, setHistoricalReadings] = useState<TemperatureReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for WebSocket and component mounting state
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(true);

  /**
   * Adds a new temperature reading to the historical data
   * @param {string} temp - The temperature reading to add
   */
  const addTemperatureReading = (temp: string): void => {
    setHistoricalReadings(prev => [...prev, {
      temperature: temp,
      timestamp: new Date().toISOString(),
      readingId: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }]);
  };

  /**
   * Effect hook to manage WebSocket connection lifecycle
   */
  useEffect(() => {
    mountedRef.current = true;

    if (!socketRef.current) {
      console.log('Initializing socket connection...');
      const socket = io({
        path: '/api/socket',
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        transports: ['polling'],
        timeout: 10000,
      });

      // Socket event handlers
      socket.on('connect', () => {
        if (mountedRef.current) {
          console.log('Socket connected successfully');
          setError(null);
        }
      });

      socket.on('temperature', (temp: string) => {
        if (mountedRef.current) {
          console.log('Received temperature:', temp);
          setCurrentTemperature(temp);
          addTemperatureReading(temp);
          setIsLoading(false);
        }
      });

      socketRef.current = socket;
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (socketRef.current) {
        console.log('Cleaning up socket connection...');
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  /**
   * Fetches historical temperature readings from the API
   * @returns {Promise<void>}
   */
  const refreshHistory = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/temperatures');
      if (!response.ok) {
        throw new Error('Failed to fetch temperature history');
      }
      const data: HistoricalReadingsResponse = await response.json();
      setHistoricalReadings(data.readings);
    } catch (error) {
      console.error('Error fetching temperature history:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value: TemperatureContextType = {
    currentTemperature,
    historicalReadings,
    isLoading,
    error,
    refreshHistory
  };

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};

/**
 * Custom hook to use the temperature context
 * @throws {Error} If used outside of TemperatureProvider
 * @returns {TemperatureContextType} The temperature context value
 */
export const useTemperature = (): TemperatureContextType => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};