import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { initializeTemperatureSocket } from '../../lib/websocket/temperatureSocket';

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    res.socket.server.io = io;
    initializeTemperatureSocket(io);
  }

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).end();
}