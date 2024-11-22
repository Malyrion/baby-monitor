import type { NextApiRequest, NextApiResponse } from 'next';
import { temperatureService } from '../../services/temperatureService';

export interface CurrentTemperatureResponse {
  temperature: string;
  timestamp: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CurrentTemperatureResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const temperature = temperatureService.generateTemperature();
    
    return res.status(200).json({
      temperature,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating temperature:', error);
    return res.status(500).json({ error: 'Failed to get current temperature' });
  }
}