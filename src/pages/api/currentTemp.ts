import type { NextApiRequest, NextApiResponse } from 'next';
import { temperatureService } from '../../services/temperatureService';

/**
 * Interface for the temperature response object
 * @interface CurrentTemperatureResponse
 * @property {string} temperature - The current temperature reading
 * @property {string} timestamp - ISO timestamp of when the reading was taken
 */
export interface CurrentTemperatureResponse {
  temperature: string;
  timestamp: string;
}

/**
 * API handler for current temperature endpoint
 * Returns the current temperature reading with timestamp
 * 
 * @endpoint GET /api/currentTemp
 * @param {NextApiRequest} req - The incoming HTTP request
 * @param {NextApiResponse} res - The outgoing HTTP response
 * @returns {Promise<void>} Resolves when response is sent
 * 
 * @example
 * // Successful response
 * {
 *   "temperature": "36.5",
 *   "timestamp": "2024-01-01T12:00:00.000Z"
 * }
 * 
 * // Error response
 * {
 *   "error": "Failed to get current temperature"
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CurrentTemperatureResponse | { error: string }>,
) {
  // Ensure endpoint only accepts GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate new temperature reading
    const temperature = temperatureService.generateTemperature();
    
    // Return successful response with current timestamp
    return res.status(200).json({
      temperature,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log error for debugging and return user-friendly error message
    console.error('Error generating temperature:', error);
    return res.status(500).json({ error: 'Failed to get current temperature' });
  }
}