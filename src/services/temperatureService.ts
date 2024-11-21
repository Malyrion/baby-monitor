import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

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

  async getLatestReadings(limit: number = 10): Promise<TemperatureReading[]> {
    return this.getMockReadings(limit);
  }

  private getMockReadings(limit: number): TemperatureReading[] {
    const readings: TemperatureReading[] = [];
    const now = new Date();
    
    for (let i = 0; i < limit; i++) {
      readings.push({
        readingId: (Date.now() - i * 1000).toString(),
        temperature: this.generateTemperature(),
        timestamp: new Date(now.getTime() - i * 30000).toISOString()
      });
    }
    
    return readings;
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