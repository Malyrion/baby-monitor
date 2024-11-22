import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type AlertType = 'success' | 'error' | 'warning';

export interface Alert {
  id: number;
  message: string;
  type: AlertType;
  timeoutId?: NodeJS.Timeout;
  dismiss?: (id: number) => void;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (message: string, type: AlertType) => void;
  dismissAlert: (id: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const dismissAlert = useCallback((id: number) => {
    setAlerts(prev => {
      const alertToRemove = prev.find(alert => alert.id === id);
      if (alertToRemove?.timeoutId) {
        clearTimeout(alertToRemove.timeoutId);
      }
      return prev.filter(alert => alert.id !== id);
    });
  }, []);

  const showAlert = useCallback((message: string, type: AlertType) => {
    // For temperature warnings, remove any existing temperature warnings first
    if (type === 'warning' && message.includes('Temperature')) {
      setAlerts(prev => prev.filter(alert => 
        !(alert.type === 'warning' && alert.message.includes('Temperature'))
      ));
    }

    // For other alerts, check for exact duplicates
    const existingAlert = alerts.find(
      alert => alert.message === message && alert.type === type
    );

    if (existingAlert) {
      return;
    }

    const id = Date.now();
    const timeoutId = type !== 'warning' ? setTimeout(() => {
      dismissAlert(id);
    }, 5000) : undefined; // Temperature warnings don't auto-dismiss

    setAlerts(prev => [...prev, { id, message, type, timeoutId }]);
  }, [alerts, dismissAlert]);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, dismissAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};