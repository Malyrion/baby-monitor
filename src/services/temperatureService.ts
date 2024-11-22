import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from '../lib/dynamodb/config';

export interface TemperatureReading {
  readingId: string;
  temperature: string;
  timestamp: string;
}

class TemperatureService {
  private MIN_TEMP = 34;

  private MAX_TEMP = 38;

  private TEMP_INCREMENT = 0.4;

  private currentTemp = this.MIN_TEMP;

  private isIncreasing = true;

  async getLatestReadings(limit = 10): Promise<TemperatureReading[]> {
    try {
      const command = new ScanCommand({
        TableName: 'Temperature', // Changed to Temperatures table
        ProjectionExpression: 'temperatureId, temperature, #ts',
        ExpressionAttributeNames: {
          '#ts': 'timestamp',
        },
        Limit: limit,
      });

      const response = await dynamoDBClient.send(command);

      if (!response.Items || response.Items.length === 0) {
        return [];
      }

      const readings = response.Items.map(item => ({
        readingId: item.temperatureId.S || '',
        temperature: item.temperature.S || '',
        timestamp: item.timestamp.S || '',
      })).sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      return readings;
    } catch (error) {
      console.error('Error fetching from DynamoDB:', error);
      throw error;
    }
  }

  generateTemperature(): string {
    if (this.currentTemp >= this.MAX_TEMP) {
      this.isIncreasing = false;
    } else if (this.currentTemp <= this.MIN_TEMP) {
      this.isIncreasing = true;
    }

    this.currentTemp += this.isIncreasing ? this.TEMP_INCREMENT : -this.TEMP_INCREMENT;
    return this.currentTemp.toFixed(1);
  }
}

export const temperatureService = new TemperatureService();