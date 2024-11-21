import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the context type
interface WebSocketContextType {
  temperature: string | null;
  socket: Socket | null;
}

// Create the context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [temperature, setTemperature] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/temperatures'); // Ensures the WebSocket server is ready
      const newSocket = io();
  
      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
      });
  
      newSocket.on('temperature', (data: string) => {
        console.log(`Received temperature: ${data}`);
        setTemperature(data); // Update the temperature state
      });
  
      setSocket(newSocket);
    };
  
    socketInitializer();
  
    return () => {
      if (socket) {
        socket.disconnect(); // Clean up the socket on unmount
      }
    };
  }, []);
  

  return (
    <WebSocketContext.Provider value={{ temperature, socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
