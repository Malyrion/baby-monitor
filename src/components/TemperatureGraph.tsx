import { useEffect, useState, useCallback, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Interface for temperature reading data structure
 * @interface TemperatureReading
 */
interface TemperatureReading {
  temperature: string;
  timestamp: string;
  readingId: string;
}

/**
 * Interface for chart margin configuration
 * @interface ChartMargin
 */
interface ChartMargin {
  top: number;
  right: number;
  left: number;
  bottom: number;
}

/**
 * Interface for chart tick style configuration
 * @interface TickStyle
 */
interface TickStyle {
  fontSize: number;
  fill: string;
}

/**
 * TemperatureGraph Component
 * Displays a line chart of temperature readings over time
 * with responsive design and mobile optimization
 * 
 * @component
 * @returns {JSX.Element} Rendered temperature graph
 */
const TemperatureGraph: React.FC = () => {
  // State management for temperature readings and loading states
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Move TICK_STYLE to state
  const [tickStyle, setTickStyle] = useState<TickStyle>({
    fontSize: 12,
    fill: '#9CA3AF'
  });

  // Handle window resize and initial mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setTickStyle({
        fontSize: mobile ? 10 : 12,
        fill: '#9CA3AF'
      });
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Formats timestamp for X-axis based on screen size
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted time string
   */
  const formatXAxisTick = useCallback((timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      ...(isMobile ? {} : { second: '2-digit' })
    });
  }, [isMobile]);

  // Add AbortController ref
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetches temperature readings from the API
   */
  useEffect(() => {
    const fetchTemperatures = async (): Promise<void> => {
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        const response = await fetch('/api/temperatures?limit=100', {
          signal: abortControllerRef.current.signal // Add abort signal to fetch
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch temperature data');
        }
        
        const data: { readings: TemperatureReading[] } = await response.json();
        setReadings(data.readings);
      } catch (err) {
        // Only set error if it's not an abort error
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemperatures();

    // Cleanup function
    return () => {
      // Abort any in-flight requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Chart configuration constants
  const CHART_MARGIN: ChartMargin = {
    top: 10,
    right: 10,
    left: 0,
    bottom: 0
  };

  /**
   * Loading state render
   */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  /**
   * Error state render
   */
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm p-3 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
        Temperature History
      </h2>
      <div className="h-[300px] sm:h-[400px] w-full">
        <ResponsiveContainer>
          <LineChart 
            data={readings}
            margin={CHART_MARGIN}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              opacity={0.2} 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxisTick}
              tick={tickStyle}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              domain={[35, 38]} 
              tickCount={5}
              tickFormatter={(value: number): string => `${value}°`}
              tick={tickStyle}
              width={35}
            />
            <Tooltip
              labelFormatter={(timestamp: string): string => 
                new Date(timestamp).toLocaleString()
              }
              formatter={(value: string): [string, string] => 
                [`${value}°C`, 'Temperature']
              }
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              wrapperStyle={{
                outline: 'none'
              }}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8884d8"
              name="Temperature"
              dot={false}
              strokeWidth={2}
              activeDot={{ 
                r: 6, 
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureGraph;