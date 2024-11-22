import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as IOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { initializeTemperatureSocket } from '../../lib/websocket/temperatureSocket';

/**
 * API Configuration
 * Disables body parsing as it's not needed for WebSocket connections
 * and can interfere with the WebSocket handshake
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Extended NextApiResponse type that includes Socket.IO server
 * @typedef {NextApiResponse} NextApiResponseWithSocket
 * @property {object} socket - Socket information
 * @property {NetServer & { io?: IOServer }} socket.server - Server instance with optional Socket.IO
 */
type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

/**
 * WebSocket initialization handler
 * Sets up Socket.IO server if it hasn't been initialized
 * 
 * @endpoint GET /api/socket
 * @param {NextApiRequest} req - The incoming HTTP request
 * @param {NextApiResponseWithSocket} res - The outgoing HTTP response with socket server
 * @returns {void}
 * 
 * @description
 * This handler:
 * 1. Checks if Socket.IO server exists
 * 2. If not, creates new Socket.IO server
 * 3. Initializes temperature monitoring
 * 4. Responds with 200 OK
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket,
) {
  // Initialize Socket.IO server if it doesn't exist
  if (!res.socket.server.io) {
    // Create new Socket.IO server with configuration
    const io = new IOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    // Attach Socket.IO server to response
    res.socket.server.io = io;
    
    // Initialize temperature monitoring
    initializeTemperatureSocket(io);
  }

  // Send success response
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).end();
}