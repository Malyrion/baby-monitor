import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Socket, io } from 'socket.io-client';

interface TemperatureContextType {
  currentTemperature: string | null;
  isLoading: boolean;
  getLatestTemperature: () => string | null;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const TemperatureProvider = ({ children }: { children: ReactNode }) => {
  const [currentTemperature, setCurrentTemperature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/temperatures');
        if (!response.ok) {
          console.error('Temperature API error:', response.status);
          setIsLoading(false);
          return;
        }
        
        const newSocket = io({
          path: '/api/socket',
          addTrailingSlash: false
        });
    
        newSocket.on('connect', () => {
          console.log('Connected to WebSocket');
          newSocket.emit('getTemperature');
        });
    
        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setIsLoading(false);
        });
    
        newSocket.on('temperature', (data: string) => {
          console.log(`Received temperature: ${data}`);
          setCurrentTemperature(data);
          setIsLoading(false);
        });
    
        setSocket(newSocket);
      } catch (error) {
        console.error('Socket initialization error:', error);
        setIsLoading(false);
      }
    };
    
    socketInitializer();
  
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const getLatestTemperature = () => currentTemperature;

  const value = {
    currentTemperature,
    isLoading,
    getLatestTemperature
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
