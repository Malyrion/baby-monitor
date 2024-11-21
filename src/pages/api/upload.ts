import { NextApiRequest, NextApiResponse } from 'next';
import { imageService } from '../../services/imageService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fileName, image, temperature } = req.body;
    const metadata = await imageService.uploadImage(fileName, image, temperature);
    res.status(200).json({ success: true, metadata });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}