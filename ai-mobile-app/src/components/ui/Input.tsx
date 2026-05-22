import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = "", 
  ...props 
}) => {
  return (
    <View className={`w-full gap-3 ${className}`}>
      {label && (
        <Typography variant="label" className="ml-1 text-slate-500">
          {label}
        </Typography>
      )}
      <TextInput
        className={`bg-gray-50 border ${error ? 'border-error' : 'border-gray-200'} p-4 rounded-xl text-base text-black`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Typography variant="caption" className="ml-1 text-error">
          {error}
        </Typography>
      )}
    </View>
  );
};
