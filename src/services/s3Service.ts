import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Debug logging for AWS S3 configuration
 * Helps diagnose environment variable issues during deployment
 */
console.log('Loading environment variables...');
console.log({
  bucket: process.env.S3_BUCKET_NAME,
  region: process.env.REGION,
  hasAccessKey: !!process.env.ACCESS_KEY_ID,
  hasSecretKey: !!process.env.SECRET_ACCESS_KEY,
});

/**
 * Validate required environment variables
 * @throws {Error} If S3_BUCKET_NAME is not defined
 */
const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
  throw new Error('S3_BUCKET_NAME must be defined in environment variables');
}

/**
 * Initialize S3 client with AWS credentials
 * @constant
 * @type {S3Client}
 */
const s3Client = new S3Client({
  region: process.env.REGION || 'eu-west-2', // Default to eu-west-2 if not specified
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

/**
 * Uploads a file to AWS S3 bucket
 * @async
 * @param {string} file - Base64 encoded file data
 * @param {string} fileName - Name to be used for the file in S3
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>} URL of the uploaded file
 * @throws {Error} If upload fails
 * 
 * @example
 * const url = await uploadToS3(
 *   'base64EncodedData',
 *   'example.jpg',
 *   'image/jpeg'
 * );
 */
export async function uploadToS3(
  file: string,
  fileName: string,
  contentType: string,
): Promise<string> {
  // Log upload parameters for debugging
  console.log('Upload parameters:', {
    bucket: bucketName,
    fileName,
    contentType,
  });

  // Remove base64 image header and convert to buffer
  const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Prepare S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  };

  try {
    // Log upload attempt (excluding file data for security)
    console.log('Attempting S3 upload with params:', { ...params, Body: '[Buffer]' });
    
    // Execute upload
    await s3Client.send(new PutObjectCommand(params));
    
    // Generate and return public URL for the uploaded file
    const url = `https://${bucketName}.s3.${process.env.REGION}.amazonaws.com/${fileName}`;
    console.log('Upload successful, generated URL:', url);
    return url;
  } catch (error) {
    // Log detailed error for debugging
    console.error('Detailed upload error:', error);
    throw error;
  }
}