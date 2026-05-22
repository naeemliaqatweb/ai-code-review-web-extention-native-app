import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';

interface ErrorContextType {
  showError: (title: string, message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showError = useCallback((title: string, message: string) => {
    // For now using native Alert, can be swapped for a custom Toast component later
    Alert.alert(title, message, [{ text: 'OK' }]);
  }, []);

  const clearError = useCallback(() => {
    // No-op for Alert, but useful if we use a persistent toast
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

// Global reference for outside of React components
let errorCallback: ((title: string, message: string) => void) | null = null;
export const setErrorHandler = (callback: (title: string, message: string) => void) => {
  errorCallback = callback;
};

export const globalErrorHandler = (title: string, message: string) => {
  if (errorCallback) {
    errorCallback(title, message);
  } else {
    console.error(`[Global Error] ${title}: ${message}`);
  }
};
