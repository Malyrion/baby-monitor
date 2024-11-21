import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import type { HistoricalReadingsResponse } from '../pages/api/temperatures';
import type { CurrentTemperatureResponse } from '../pages/api/currentTemp';

interface TemperatureContextType {
  currentTemperature: string | null;
  historicalReadings: HistoricalReadingsResponse['readings'];
  isLoading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const TemperatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTemperature, setCurrentTemperature] = useState<string | null>(null);
  const [historicalReadings, setHistoricalReadings] = useState<HistoricalReadingsResponse['readings']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!socketRef.current) {
      console.log('Initializing socket connection...');
      const socket = io({
        path: '/api/socket',
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

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
          setIsLoading(false);
        }
      });

      socket.on('connect_error', (err) => {
        if (mountedRef.current) {
          console.error('Socket connection error:', err);
          setError('Connection error');
        }
      });

      socketRef.current = socket;
    }

    return () => {
      mountedRef.current = false;
      if (socketRef.current) {
        console.log('Cleaning up socket connection...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const value = {
    currentTemperature,
    historicalReadings,
    isLoading,
    error,
    refreshHistory: async () => {} // Temporarily disabled
  };

  return (
    <TemperatureContext.Provider value={value}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};