import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { uploadToS3 } from './s3Service';
import { v4 as uuidv4 } from 'uuid';

export interface ImageMetadata {
  ImageID: string;
  FileName: string;
  S3URL: string;
  UploadTimestamp: string;
  Temperature?: string;
  ChildID: string;
  FamilyID: string;
  UserID: string;
}

class ImageService {
  private dynamoDb: DynamoDBClient;

  constructor() {
    this.dynamoDb = new DynamoDBClient({
      region: process.env.REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
      },
    });
  }

  getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'bmp': 'image/bmp'
    };
    
    return contentTypes[extension] || 'application/octet-stream';
  }

  async uploadImage(fileName: string, image: string, temperature?: string): Promise<ImageMetadata> {
    const imageID = uuidv4();
    const fileExtension = fileName.split('.').pop();
    const s3FileName = `${imageID}.${fileExtension}`;

    const s3Url = await uploadToS3(
      image,
      s3FileName,
      this.getContentType(fileName)
    );

    const metadata: ImageMetadata = {
      ImageID: imageID,
      FileName: fileName,
      S3URL: s3Url,
      UploadTimestamp: new Date().toISOString(),
      Temperature: temperature,
      ChildID: 'child123', // Mock data
      FamilyID: 'family123',
      UserID: 'user123'
    };

    await this.saveMetadata(metadata);
    return metadata;
  }

  private async saveMetadata(metadata: ImageMetadata): Promise<void> {
    const dbItem = {
      TableName: "Image",
      Item: {
        imageId: { S: metadata.ImageID },
        fileName: { S: metadata.FileName },
        s3Url: { S: metadata.S3URL },
        uploadTimestamp: { S: metadata.UploadTimestamp },
        temperature: { S: metadata.Temperature?.toString() || 'N/A' },
        childId: { S: metadata.ChildID },
        familyId: { S: metadata.FamilyID },
        userId: { S: metadata.UserID }
      }
    };

    await this.dynamoDb.send(new PutItemCommand(dbItem));
  }
}

export const imageService = new ImageService();