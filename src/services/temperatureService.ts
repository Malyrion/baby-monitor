import { DynamoDBClient, BatchWriteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Server as IOServer } from 'socket.io';

export interface TemperatureReading {
  readingId: string;
  temperature: string;
  timestamp: string;
}

class TemperatureService {
  private dynamoDb: DynamoDBClient;
  private MIN_TEMP = 34;
  private MAX_TEMP = 38;
  private TEMP_INCREMENT = 0.4;
  private currentTemp = this.MIN_TEMP;
  private isIncreasing = true;

  constructor() {
    this.dynamoDb = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  generateTemperature(): string {
    if (this.currentTemp >= this.MAX_TEMP) {
      this.isIncreasing = false;
    } else if (this.currentTemp <= this.MIN_TEMP) {
      this.isIncreasing = true;
    }

    this.currentTemp += this.isIncreasing ? this.TEMP_INCREMENT : -this.TEMP_INCREMENT;
    this.currentTemp = Math.max(this.MIN_TEMP, Math.min(this.MAX_TEMP, this.currentTemp));
    
    return this.currentTemp.toFixed(1);
  }

  async getLatestReadings(limit: number = 100): Promise<TemperatureReading[]> {
    const command = new QueryCommand({
      TableName: "Temperature",
      IndexName: "ByTimestamp",
      Limit: limit,
      ScanIndexForward: false // descending order
    });

    const response = await this.dynamoDb.send(command);
    return response.Items?.map(item => ({
      readingId: item.readingId.S!,
      temperature: item.temperature.S!,
      timestamp: item.timestamp.S!
    })) || [];
  }

  async saveBatch(readings: TemperatureReading[]): Promise<void> {
    const putRequests = readings.map(reading => ({
      PutRequest: {
        Item: {
          readingId: { S: reading.readingId },
          temperature: { S: reading.temperature },
          timestamp: { S: reading.timestamp }
        }
      }
    }));

    await this.dynamoDb.send(new BatchWriteItemCommand({
      RequestItems: {
        "Temperature": putRequests
      }
    }));
  }

  initializeWebSocket(io: IOServer) {
    io.on('connection', (socket) => {
      // Handle temperature-related socket events here
    });
  }
}

export const temperatureService = new TemperatureService();