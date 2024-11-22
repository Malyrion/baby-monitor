import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Add debug logging
console.log('AWS Config:', {
  region: process.env.REGION,
  hasAccessKey: !!process.env.ACCESS_KEY_ID,
  hasSecretKey: !!process.env.SECRET_ACCESS_KEY,
});

export const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});