import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import TemperatureManager from '../utils/TemperatureManager'; // Ensure correct path

const metadataStore = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fileName, image } = req.body;
      const imageID = uuidv4();
      const bucketName = 'your-mock-bucket';
      const region = 'your-region';

      // Generate a mock S3 URL
      const mockS3URL = `https://${bucketName}.s3.${region}.amazonaws.com/${imageID}.jpg`;

      // Fetch the latest temperature
      const latestTemperature = TemperatureManager.getInstance().getTemperature();
      console.log(`Temperature in Upload API: ${latestTemperature}`);

      // Create metadata
      const metadata = {
        ImageID: imageID,
        FileName: fileName || 'unknown-file',
        S3URL: mockS3URL,
        UploadTimestamp: new Date().toISOString(),
        Temperature: latestTemperature !== -1 ? latestTemperature : 'Unavailable (No updates received yet)',
      };

      // Store metadata
      metadataStore.push(metadata);
      console.log('Metadata stored:', metadata);

      res.status(200).json({ success: true, metadata });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ success: false, error: 'Failed to store metadata' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};