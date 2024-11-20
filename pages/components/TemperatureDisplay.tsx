import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import styles from '../../styles/Home.module.css'

export default function TemperatureDisplay() {
  const [temperature, setTemperature] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/temperatures')
      const newSocket = io()

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket')
      })

      newSocket.on('temperature', (data: string) => {
        setTemperature(data)
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
   
      <div className="p-8 rounded-lg shadow-md">
        <h1 className={styles.containers}>Current Temperature</h1>
        {temperature ? (
          <p className={styles.heading}>{temperature}°C</p>
        ) : (
          <p className="text-xl text-gray-600">Loading temperature...</p>
        )}
      </div>
  )
}