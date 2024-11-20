// Import necessary modules and types
import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';

// Extend Next.js's socket server to include the `io` property
interface ExtendedSocket extends Socket {
  server: HTTPServer & {
    io?: IOServer;
  };
}

// Extend Next.js's response to use the extended socket
interface ExtendedNextApiResponse extends NextApiResponse {
  socket: ExtendedSocket;
}

const SocketHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A client connected');

      // Emit random temperature data every second
      const interval = setInterval(() => {
        const temperature = (Math.random() * 30 + 10).toFixed(1); // Random temperature between 10°C and 40°C
        socket.emit('temperature', temperature);
      }, 1000);

      socket.on('disconnect', () => {
        console.log('A client disconnected');
        clearInterval(interval);
      });
    });
  }
  res.end();
};

export default SocketHandler;
