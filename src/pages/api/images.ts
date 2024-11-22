import type { NextApiRequest, NextApiResponse } from 'next';
import { imageService } from '../../services/imageService';

interface RecentImagesResponse {
  images: {
    imageUrl: string;
    temperature: string;
    timestamp: string;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecentImagesResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit as string) || 3;
    const images = await imageService.getRecentImages(limit);
    return res.status(200).json({ images });
  } catch (error) {
    console.error('Error fetching recent images:', error);
    return res.status(500).json({ error: 'Failed to fetch recent images' });
  }
}