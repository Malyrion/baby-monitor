import { Server as IOServer } from 'socket.io';
import { temperatureService } from '../../services/temperatureService';

/**
 * Initializes WebSocket connection for temperature monitoring
 * Sets up event listeners and periodic temperature updates
 * 
 * @param {IOServer} io - Socket.IO server instance
 * @returns {void}
 */
export function initializeTemperatureSocket(io: IOServer): void {
  console.log('Setting up temperature socket');
  
  /** Stores the last emitted temperature to prevent duplicate emissions */
  let lastTemperature: string | null = null;
  
  /**
   * Periodic temperature check interval
   * Generates and emits new temperature readings every 5 seconds
   * Only emits if the temperature has changed from the last reading
   */
  const interval = setInterval(() => {
    const temperature = temperatureService.generateTemperature();
    
    // Emit only if temperature has changed to reduce unnecessary updates
    if (temperature !== lastTemperature) {
      lastTemperature = temperature;
      io.emit('temperature', temperature);
    }
  }, 5000); // 5 second interval

  /**
   * Handle new client connections
   * Sends initial temperature reading to newly connected clients
   */
  io.on('connection', (socket) => {
    console.log('Client connected');
    
    // Send immediate temperature reading to new clients
    const temperature = temperatureService.generateTemperature();
    socket.emit('temperature', temperature);

    /**
     * Handle client disconnection
     * Logs when clients disconnect for monitoring purposes
     */
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  /**
   * Cleanup handler for server shutdown
   * Ensures interval is cleared to prevent memory leaks
   */
  io.on('close', () => {
    console.log('Cleaning up temperature socket');
    clearInterval(interval);
  });
}