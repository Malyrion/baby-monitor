import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

console.log('Loading environment variables...');
console.log({
  bucket: process.env.S3_BUCKET_NAME,
  region: process.env.REGION,
  hasAccessKey: !!process.env.ACCESS_KEY_ID,
  hasSecretKey: !!process.env.SECRET_ACCESS_KEY,
});

const bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
  throw new Error('S3_BUCKET_NAME must be defined in environment variables');
}

const s3Client = new S3Client({
  region: process.env.REGION || 'eu-west-2',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: string,
  fileName: string,
  contentType: string,
): Promise<string> {
  console.log('Upload parameters:', {
    bucket: bucketName,
    fileName,
    contentType,
  });

  const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  };

  try {
    console.log('Attempting S3 upload with params:', { ...params, Body: '[Buffer]' });
    await s3Client.send(new PutObjectCommand(params));
    const url = `https://${bucketName}.s3.${process.env.REGION}.amazonaws.com/${fileName}`;
    console.log('Upload successful, generated URL:', url);
    return url;
  } catch (error) {
    console.error('Detailed upload error:', error);
    throw error;
  }
}