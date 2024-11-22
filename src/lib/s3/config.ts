import { S3Client } from "@aws-sdk/client-s3";

// Add debug logging
console.log('S3 Config:', {
  region: process.env.REGION,
  hasAccessKey: !!process.env.ACCESS_KEY_ID,
  hasSecretKey: !!process.env.SECRET_ACCESS_KEY,
});

export const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});