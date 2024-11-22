import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDBClient } from '../lib/dynamodb/config';
import { s3Client } from '../lib/s3/config';
import { uploadToS3 } from './s3Service';

interface ImageMetadata {
  ImageID: string;
  FileName: string;
  S3URL: string;
  UploadTimestamp: string;
  Temperature?: string;
  ChildID: string;
  FamilyID: string;
  UserID: string;
}

interface ImageResponse {
  imageUrl: string;
  temperature: string;
  timestamp: string;
}

interface ContentTypes {
  [key: string]: string;
}

class ImageService {
  private readonly dynamoDb: DynamoDBClient;

  private readonly contentTypes: ContentTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
  };

  constructor() {
    this.dynamoDb = dynamoDBClient;
  }

  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return this.contentTypes[extension] || 'application/octet-stream';
  }

  private async saveMetadata(metadata: ImageMetadata): Promise<void> {
    const dbItem = {
      TableName: 'Image',
      Item: {
        imageId: { S: metadata.ImageID },
        fileName: { S: metadata.FileName },
        s3Url: { S: metadata.S3URL },
        uploadTimestamp: { S: metadata.UploadTimestamp },
        temperature: { S: metadata.Temperature?.toString() || 'N/A' },
        childId: { S: metadata.ChildID },
        familyId: { S: metadata.FamilyID },
        userId: { S: metadata.UserID },
      },
    };

    await this.dynamoDb.send(new PutItemCommand(dbItem));
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: any[] = [];
      
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async uploadImage(
    fileName: string, 
    image: string, 
    temperature?: string,
  ): Promise<ImageMetadata> {
    const imageID = uuidv4();
    const fileExtension = fileName.split('.').pop() || '';
    const s3FileName = `${imageID}.${fileExtension}`;

    const s3Url = await uploadToS3(
      image,
      s3FileName,
      this.getContentType(fileName),
    );

    const metadata: ImageMetadata = {
      ImageID: imageID,
      FileName: fileName,
      S3URL: s3Url,
      UploadTimestamp: new Date().toISOString(),
      Temperature: temperature,
      ChildID: 'child123', // Mock data
      FamilyID: 'family123',
      UserID: 'user123',
    };

    await this.saveMetadata(metadata);
    return metadata;
  }

  async getRecentImages(limit = 3): Promise<ImageResponse[]> {
    try {
      const command = new ScanCommand({
        TableName: 'Image',
        ProjectionExpression: 'imageId, s3Url, temperature, uploadTimestamp',
        Limit: limit,
      });

      const response = await dynamoDBClient.send(command);

      if (!response.Items?.length) {
        return [];
      }

      const images = await Promise.all(
        response.Items.map(async (item) => {
          const s3Url = item.s3Url?.S;
          if (!s3Url) return null;

          const s3Key = s3Url.split('/').pop();
          if (!s3Key) return null;

          try {
            const getObjectCommand = new GetObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: s3Key,
            });

            const response = await s3Client.send(getObjectCommand);
            
            if (!response.Body || !response.ContentType) {
              throw new Error('Invalid S3 response');
            }

            const buffer = await this.streamToBuffer(response.Body as Readable);
            const base64Image = `data:${response.ContentType};base64,${buffer.toString('base64')}`;

            return {
              imageUrl: base64Image,
              temperature: item.temperature?.S || 'N/A',
              timestamp: item.uploadTimestamp?.S || new Date().toISOString(),
            };
          } catch (error) {
            console.error(`Error fetching image ${s3Key}:`, error);
            return null;
          }
        }),
      );

      return images
        .filter((image): image is ImageResponse => image !== null)
        .sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

    } catch (error) {
      console.error('Error fetching recent images:', error);
      throw error;
    }
  }
}

export const imageService = new ImageService();
