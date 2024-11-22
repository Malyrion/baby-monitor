import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDBClient } from '../lib/dynamodb/config';
import { uploadToS3 } from './s3Service';

/**
 * Interface defining the structure of image metadata
 * @interface ImageMetadata
 * @property {string} ImageID - Unique identifier for the image
 * @property {string} FileName - Original name of the uploaded file
 * @property {string} S3URL - URL where the image is stored in S3
 * @property {string} UploadTimestamp - ISO timestamp of upload
 * @property {string} [Temperature] - Optional temperature reading at time of upload
 * @property {string} ChildID - Identifier for associated child
 * @property {string} FamilyID - Identifier for associated family
 * @property {string} UserID - Identifier for uploading user
 */
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

/**
 * Mapping of file extensions to MIME types
 */
interface ContentTypes {
  [key: string]: string;
}

/**
 * Service class handling image upload and metadata management
 */
class ImageService {
  private readonly dynamoDb: DynamoDBClient;

  /**
   * Supported image formats and their MIME types
   */
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

  /**
   * Determines the content type based on file extension
   */
  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return this.contentTypes[extension] || 'application/octet-stream';
  }

  /**
   * Saves image metadata to DynamoDB
   */
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

  /**
   * Handles the complete image upload process
   * @param {string} fileName - Original name of the file
   * @param {string} image - Base64 encoded image data
   * @param {string} [temperature] - Optional temperature reading
   * @returns {Promise<ImageMetadata>} Uploaded image metadata
   */
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
}

// Export singleton instance
export const imageService = new ImageService();