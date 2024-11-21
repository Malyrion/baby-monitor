import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';

interface ExtendedSocket extends Socket {
  server: HTTPServer & {
    io?: IOServer;
  };
}

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: ExtendedSocket;
}

let sharedTemperature = (Math.random() * 30 + 10).toFixed(1); // Initial random temperature
let interval: NodeJS.Timeout | null = null; // Shared timer for temperature updates

const SocketHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Send the current shared temperature to the newly connected client
      socket.emit('temperature', sharedTemperature);

      // Start the temperature update interval if it isn't already running
      if (!interval) {
        interval = setInterval(() => {
          sharedTemperature = (Math.random() * 30 + 10).toFixed(1); // Update temperature every 3 seconds
          console.log(`Updated shared temperature: ${sharedTemperature}`);
          io.emit('temperature', sharedTemperature); // Broadcast to all clients
        }, 6000); // Update every 3 seconds
      }

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Stop the interval if no clients are connected
        if (io.sockets.sockets.size === 0 && interval) {
          clearInterval(interval);
          interval = null;
          console.log('No clients connected. Stopped temperature updates.');
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
