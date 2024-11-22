import type { NextApiRequest, NextApiResponse } from 'next';
import { temperatureService } from '../../services/temperatureService';

/**
 * Interface for historical temperature readings response
 * @interface HistoricalReadingsResponse
 * @property {Array<Object>} readings - Array of temperature readings
 * @property {string} readings[].temperature - Temperature value
 * @property {string} readings[].timestamp - ISO timestamp of reading
 * @property {string} readings[].readingId - Unique identifier for the reading
 */
export interface HistoricalReadingsResponse {
  readings: {
    temperature: string;
    timestamp: string;
    readingId: string;
  }[];
}

/**
 * API handler for historical temperature readings
 * Returns a list of recent temperature readings
 * 
 * @endpoint GET /api/temperatures
 * @param {NextApiRequest} req - The incoming HTTP request
 * @param {NextApiResponse} res - The outgoing HTTP response
 * @returns {Promise<void>} Resolves when response is sent
 * 
 * @queryParams
 * - limit (optional): number - Maximum number of readings to return (default: 10)
 * 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HistoricalReadingsResponse | { error: string }>,
) {
  // Ensure endpoint only accepts GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse limit from query params, default to 10 if not provided
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Fetch temperature readings from service
    const readings = await temperatureService.getLatestReadings(limit);
    
    // Return successful response with readings
    return res.status(200).json({ readings });
  } catch (error) {
    // Log error for debugging and return user-friendly error message
    console.error('Error fetching temperature history:', error);
    return res.status(500).json({ error: 'Failed to fetch temperature history' });
  }
}