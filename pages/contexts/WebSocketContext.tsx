import React, { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  currentTemperature: string | null
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  currentTemperature: null
})

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentTemperature, setCurrentTemperature] = useState<string | null>(null)

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/temperature')
      const newSocket = io()

      newSocket.on('connect', () => {
        console.log('WebSocket connected')
        setIsConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
      })

      newSocket.on('temperature', (data: string) => {
        setCurrentTemperature(data)
      })

      setSocket(newSocket)
    }

    socketInitializer()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, currentTemperature }}>
      {children}
    </WebSocketContext.Provider>
  )
}