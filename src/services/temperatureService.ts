import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from '../lib/dynamodb/config';

/**
 * Interface for temperature reading data structure
 * @interface TemperatureReading
 * @property {string} readingId - Unique identifier for the reading
 * @property {string} temperature - Temperature value
 * @property {string} timestamp - ISO timestamp of the reading
 */
export interface TemperatureReading {
  readingId: string;
  temperature: string;
  timestamp: string;
}

/**
 * Service class for managing temperature readings
 * Handles temperature generation and retrieval
 */
class TemperatureService {
  // Temperature range constants in Celsius
  private MIN_TEMP = 34;   // Minimum temperature threshold
  private MAX_TEMP = 38;   // Maximum temperature threshold
  private TEMP_INCREMENT = 0.4;  // Temperature change increment

  // Current temperature state
  private currentTemp = this.MIN_TEMP;
  private isIncreasing = true;  // Direction of temperature change

  /**
   * Retrieves recent temperature readings from DynamoDB
   * @param {number} limit - Maximum number of readings to return (default: 10)
   * @returns {Promise<TemperatureReading[]>} Array of temperature readings
   * @throws {Error} If database query fails
   */
  async getLatestReadings(limit = 10): Promise<TemperatureReading[]> {
    try {
      // Configure DynamoDB scan operation
      const command = new ScanCommand({
        TableName: 'Temperature',
        ProjectionExpression: 'temperatureId, temperature, #ts',
        ExpressionAttributeNames: {
          '#ts': 'timestamp',  // Using alias for reserved keyword
        },
        Limit: limit,
      });

      // Execute query
      const response = await dynamoDBClient.send(command);

      // Handle empty response
      if (!response.Items || response.Items.length === 0) {
        return [];
      }

      // Transform and sort readings by timestamp (newest first)
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

  /**
   * Generates a new temperature reading
   * Simulates temperature changes within defined range
   * @returns {string} Generated temperature value fixed to 1 decimal place
   */
  generateTemperature(): string {
    // Toggle direction at temperature thresholds
    if (this.currentTemp >= this.MAX_TEMP) {
      this.isIncreasing = false;
    } else if (this.currentTemp <= this.MIN_TEMP) {
      this.isIncreasing = true;
    }

    // Update temperature based on direction
    this.currentTemp += this.isIncreasing ? this.TEMP_INCREMENT : -this.TEMP_INCREMENT;
    return this.currentTemp.toFixed(1);
  }
}

// Export singleton instance
export const temperatureService = new TemperatureService();