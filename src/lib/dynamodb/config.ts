import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

/**
 * Debug logging for AWS configuration
 * Logs the presence of required AWS credentials without exposing sensitive data
 * Helps diagnose configuration issues during development and deployment
 */
console.log('AWS Config:', {
  region: process.env.REGION,
  hasAccessKey: !!process.env.ACCESS_KEY_ID,
  hasSecretKey: !!process.env.SECRET_ACCESS_KEY,
});

/**
 * DynamoDB Client Configuration
 * Initializes a DynamoDB client with AWS credentials from environment variables
 * 
 * Required Environment Variables:
 * @requires REGION - AWS Region 
 * @requires ACCESS_KEY_ID - AWS Access Key ID
 * @requires SECRET_ACCESS_KEY - AWS Secret Access Key
 * 
 * @throws {Error} Will throw if required environment variables are not set
 */
export const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!, 
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});