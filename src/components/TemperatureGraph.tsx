import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface TemperatureReading {
  temperature: string;
  timestamp: string;
  readingId: string;
}

const TemperatureGraph = () => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemperatures = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/temperatures?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch temperature data');
        }
        const data = await response.json();
        setReadings(data.readings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemperatures();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Temperature History</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer>
          <LineChart 
            data={readings}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[35, 38]} 
              tickCount={7}
              tickFormatter={(value) => `${value}°C`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              formatter={(value: string) => [`${value}°C`, 'Temperature']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: 'none',
                borderRadius: '4px',
                padding: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8884d8"
              name="Temperature"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureGraph;