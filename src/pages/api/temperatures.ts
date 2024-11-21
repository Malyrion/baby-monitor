import type { NextApiRequest, NextApiResponse } from 'next';
import { temperatureService } from '../../services/temperatureService';

export interface HistoricalReadingsResponse {
  readings: {
    temperature: string;
    timestamp: string;
    readingId: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HistoricalReadingsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const readings = await temperatureService.getLatestReadings(limit);
    
    return res.status(200).json({ readings });
  } catch (error) {
    console.error('Error fetching temperature history:', error);
    return res.status(500).json({ error: 'Failed to fetch temperature history' });
  }
}