// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import { Server } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('A client connected')

      const interval = setInterval(() => {
        const temperature = (Math.random() * 30 + 10).toFixed(1) // Random temperature between 10°C and 40°C
        socket.emit('temperature', temperature)
      }, 1000)

      socket.on('disconnect', () => {
        console.log('A client disconnected')
        clearInterval(interval)
      })
    })
  }
  res.end()
}

export default SocketHandler