import { Server as IOServer } from 'socket.io';
import { temperatureService } from '../../services/temperatureService';

export function initializeTemperatureSocket(io: IOServer) {
  console.log('Setting up temperature socket');
  
  const interval = setInterval(() => {
    const temperature = temperatureService.generateTemperature();
    console.log('Emitting temperature:', temperature);
    io.emit('temperature', temperature);
  }, 5000); // Every 5 seconds

  io.on('connection', (socket) => {
    console.log('Client connected');
    
    // Send initial temperature
    const temperature = temperatureService.generateTemperature();
    socket.emit('temperature', temperature);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Cleanup on server shutdown
  io.on('close', () => {
    console.log('Cleaning up temperature socket');
    clearInterval(interval);
  });
}