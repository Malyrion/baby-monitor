import { useTemperature } from '@/contexts/TemperatureContext';
import { useMemo, useEffect, useState } from 'react';
import { useAlert } from '@/contexts/AlertContext';

/**
 * Interface for the component's props 
 */
interface TemperatureDisplayProps {
  className?: string;
}

/**
 * TemperatureDisplay component that shows the current temperature reading
 * with loading state handling and animated gradient text.
 * If temperatur exceeds the limit it will prop an alert
 * 
 * @component
 * @returns {JSX.Element} Rendered temperature display
 */
const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ className }) => {
  const { currentTemperature, isLoading } = useTemperature();
  const { showAlert, alerts } = useAlert();

  // Constants
  const DISMISSAL_DURATION = 3000; // 3 seconds in milliseconds

  // Temperature alert logic
  useEffect(() => {
    if (!currentTemperature) return;

    const temp = parseFloat(currentTemperature);
    const hasTemperatureWarning = alerts.some(
      alert => alert.type === 'warning' && alert.message.includes('Temperature'),
    );
    
    // Check if temperature is within normal range
    const isTemperatureNormal = temp <= 37 && temp >= 35.5;

    if (isTemperatureNormal) {
      return;
    }

    // Check last dismissal time
    const lastDismissTime = parseInt(window.localStorage.getItem('lastTempAlertDismiss') || '0');
    const now = Date.now();
    const timeSinceDismiss = now - lastDismissTime;
    
    // Only show alert if it's been more than DISMISSAL_DURATION since last dismissal
    if (!hasTemperatureWarning && timeSinceDismiss > DISMISSAL_DURATION) {
      if (temp > 37) {
        showAlert(`Temperature is too high (${temp}°C). Please check on your baby.`, 'warning');
      } else if (temp < 35.5) {
        showAlert(`Temperature is too low (${temp}°C). Please check on your baby.`, 'warning');
      }
    }
  }, [currentTemperature, showAlert, alerts]);

  // Move color logic to separate useMemo
  const colorScheme = useMemo(() => {
    if (!currentTemperature) {
      return 'from-teal-500 via-purple-500 to-orange-500';
    }

    const temp = parseFloat(currentTemperature);
    if (temp > 37) {
      return 'from-red-500 via-yellow-500 to-red-500';
    }
    if (temp < 35.5) {
      return 'from-blue-700 via-blue-600 to-cyan-600';
    }

    return 'from-emerald-500 via-teal-500 to-green-500';
  }, [currentTemperature]);

  const temperatureClasses = `
    text-6xl text-center 
    animate-text 
    bg-gradient-to-r 
    ${colorScheme}
    bg-clip-text text-transparent 
    font-black md:text-7xl
    mb-4
    font-sans
  `.replace('font-sans', '');

  return (
    <div className={`w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm p-6 rounded-lg ${className || ''}`}>
      <div className="h-[180px] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-center mb-6">
          Current Temperature
        </h1>

        {!isLoading && currentTemperature ? (
          <p className={temperatureClasses}>
            {currentTemperature}°C
          </p>
        ) : (
          <p className="text-xl text-gray-600 text-center mb-4">
            Loading temperature...
          </p>
        )}
      </div>
    </div>
  );
};

export default TemperatureDisplay;