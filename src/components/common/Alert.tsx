import React from 'react';
import { useAlert } from '@/contexts/AlertContext';
import type { Alert } from '@/contexts/AlertContext';

export const AlertContainer = () => {
  const { alerts, dismissAlert } = useAlert();

  const handleDismiss = (alert: Alert) => {
    if (alert.type === 'warning' && alert.message.includes('Temperature')) {
      window.localStorage.setItem('lastTempAlertDismiss', Date.now().toString());
    }
    dismissAlert(alert.id);
  };

  return (
    <div className="fixed top-2 sm:top-4 left-0 right-0 z-[200] mx-auto flex flex-col items-center gap-2 px-3 sm:px-0">
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          style={{
            marginTop: `${index * 0.5}rem`
          }}
          className={`
            w-full sm:max-w-md transition-all duration-300 ease-in-out
            ${alert.type === 'success' ? 'bg-green-50 text-green-800 border-green-300 dark:bg-gray-800 dark:text-green-300 dark:border-green-800' : ''}
            ${alert.type === 'error' ? 'bg-red-50 text-red-800 border-red-300 dark:bg-gray-800 dark:text-red-300 dark:border-red-800' : ''}
            ${alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800' : ''}
          `}
        >
          <div 
            onClick={() => handleDismiss(alert)}
            className="w-full text-left relative group cursor-pointer"
            role="alert"
          >
            <div 
              className="flex items-center p-4 text-sm sm:text-base border rounded-lg shadow-lg hover:bg-opacity-80 transition-colors duration-200" 
            >
              <svg className="flex-shrink-0 inline w-4 h-4 sm:w-5 sm:h-5 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <div className="flex-grow pr-8">
                <span className="font-medium">
                  {alert.type === 'success' && 'Success!'}
                  {alert.type === 'error' && 'Error!'}
                  {alert.type === 'warning' && 'Warning!'}
                </span>{' '}
                {alert.message}
              </div>
              <span className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};