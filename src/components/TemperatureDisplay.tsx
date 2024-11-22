import { useTemperature } from '@/contexts/TemperatureContext';

/**
 * Interface for the component's props 
 */
interface TemperatureDisplayProps {
  className?: string;
}

/**
 * TemperatureDisplay component that shows the current temperature reading
 * with loading state handling and animated gradient text.
 * 
 * @component
 * @returns {JSX.Element} Rendered temperature display
 */
const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ className }) => {
  const { currentTemperature, isLoading } = useTemperature();

  return (
    <div className={`p-4 rounded-lg ${className || ''}`}>
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-4">
        Current Temperature
      </h1>

      {/* Temperature Display */}
      {!isLoading && currentTemperature ? (
        <p className="
          text-5xl text-center 
          animate-text 
          bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 
          bg-clip-text text-transparent 
          font-black md:text-6xl
        ">
          {currentTemperature}°C
        </p>
      ) : (
        <p className="text-xl text-gray-600 text-center">
          Loading temperature...
        </p>
      )}
    </div>
  );
};

export default TemperatureDisplay;