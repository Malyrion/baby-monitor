import { useTemperature } from '@/contexts/TemperatureContext';
import styles from '../styles/Home.module.css';

export default function TemperatureDisplay() {
  const { currentTemperature, isLoading } = useTemperature();

  return (
    <div className="p-8 rounded-lg shadow-md">
      <h1 className={styles.containers}>Current Temperature</h1>
      {!isLoading && currentTemperature ? (
        <p className={styles.heading}>{currentTemperature}°C</p>
      ) : (
        <p className="text-xl text-gray-600">Loading temperature...</p>
      )}
    </div>
  );
}