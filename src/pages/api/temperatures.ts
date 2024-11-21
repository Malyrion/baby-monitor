import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { temperatureService } from '../../services/temperatureService';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: any;
};

// At the top level of your file, outside the handler
let globalInterval: NodeJS.Timeout | null = null;
let connectedClients = 0;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      connectedClients++;
      
      // Start global interval only when first client connects
      if (connectedClients === 1) {
        globalInterval = setInterval(() => {
          const temp = temperatureService.generateTemperature();
          io.emit('temperature', temp); // Broadcast to all clients
        }, 5000);
      }

      socket.on('disconnect', () => {
        connectedClients--;
        // Clear interval when last client disconnects
        if (connectedClients === 0 && globalInterval) {
          clearInterval(globalInterval);
          globalInterval = null;
        }
      });
    });

    res.socket.server.io = io;
  }
  
  res.end();
}