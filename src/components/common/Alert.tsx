import React from 'react';
import { useAlert } from '@/contexts/AlertContext';
import type { Alert } from '@/contexts/AlertContext';

/**
 * Interface for alert styling configuration
 */
interface AlertStyleConfig {
  success: string;
  error: string;
  warning: string;
}

/**
 * Alert style configurations based on alert type
 */
const alertStyles: AlertStyleConfig = {
  success: 'bg-green-50 text-green-800 border-green-300 dark:bg-gray-800 dark:text-green-300 dark:border-green-800',
  error: 'bg-red-50 text-red-800 border-red-300 dark:bg-gray-800 dark:text-red-300 dark:border-red-800',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800'
};

/**
 * AlertContainer Component
 * 
 * Renders a stack of alert messages that can be dismissed by clicking.
 * Alerts are positioned at the top of the viewport and are responsive.
 * Each alert includes an icon, message, and close button.
 * 
 * @component
 * @example
 * ```tsx
 * <AlertContainer />
 * ```
 */
export const AlertContainer = () => {
  const { alerts, dismissAlert } = useAlert();

  /**
   * Handles the dismissal of an alert
   * For temperature warnings, stores the dismissal timestamp in localStorage
   * 
   * @param {Alert} alert - The alert to be dismissed
   */
  const handleDismiss = (alert: Alert): void => {
    if (alert.type === 'warning' && alert.message.includes('Temperature')) {
      window.localStorage.setItem('lastTempAlertDismiss', Date.now().toString());
    }
    dismissAlert(alert.id);
  };

  /**
   * Generates the alert type label
   * 
   * @param {Alert['type']} type - The type of alert
   * @returns {string} The formatted label for the alert type
   */
  const getAlertTypeLabel = (type: Alert['type']): string => {
    const labels: Record<Alert['type'], string> = {
      success: 'Success!',
      error: 'Error!',
      warning: 'Warning!'
    };
    return labels[type];
  };

  return (
    <div className="fixed top-2 sm:top-4 left-0 right-0 z-[200] mx-auto flex flex-col items-center gap-2 px-3 sm:px-0">
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          style={{
            marginTop: `${index * 0.5}rem`,
          }}
          className={`
            w-full sm:max-w-md transition-all duration-300 ease-in-out
            ${alertStyles[alert.type]}
          `}
        >
          <div 
            onClick={() => handleDismiss(alert)}
            className="w-full text-left relative group cursor-pointer"
            role="alert"
          >
            <div className="flex items-center p-4 text-sm sm:text-base border rounded-lg shadow-lg hover:bg-opacity-80 transition-colors duration-200">
              <AlertIcon className="flex-shrink-0 inline w-4 h-4 sm:w-5 sm:h-5 me-3" />
              <div className="flex-grow pr-8">
                <span className="font-medium">
                  {getAlertTypeLabel(alert.type)}
                </span>{' '}
                {alert.message}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Alert Icon SVG Component
 */
const AlertIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    aria-hidden="true" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
);

