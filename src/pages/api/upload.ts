import { NextApiRequest, NextApiResponse } from 'next';
import { imageService } from '../../services/imageService';

/**
 * API Configuration
 * Sets maximum file size limit for image uploads
 * Prevents large file uploads that could overwhelm the server
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Maximum file size allowed
    },
  },
};

/**
 * Image upload handler
 * Processes image uploads and stores them with associated temperature data
 * 
 * @endpoint POST /api/upload
 * @param {NextApiRequest} req - The incoming HTTP request
 * @param {NextApiResponse} res - The outgoing HTTP response
 * @returns {Promise<void>} Resolves when upload is complete
 * 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure endpoint only accepts POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log request details for debugging
    console.log('API received request:', {
      method: req.method,
      contentLength: req.headers['content-length'],
      contentType: req.headers['content-type'],
    });

    // Extract upload data from request body
    const { fileName, image, temperature } = req.body;

    // Upload image and get metadata
    const metadata = await imageService.uploadImage(fileName, image, temperature);

    // Return successful response with metadata
    res.status(200).json({ success: true, metadata });
  } catch (error) {
    // Log error for debugging
    console.error('Upload error:', error);

    // Return user-friendly error response
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}