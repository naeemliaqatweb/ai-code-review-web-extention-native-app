import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  label?: string;
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  title,
  onPress, 
  variant = 'primary', 
  className = '',
  style
}) => {
  const baseStyles = "py-4 px-6 rounded-[20px] items-center justify-center";
  const variants = {
    primary: "bg-primary shadow-lg shadow-primary/30",
    secondary: "bg-secondary shadow-lg shadow-secondary/30",
    outline: "border-2 border-gray-200 bg-transparent",
  };

  const textVariants = {
    primary: "text-white font-bold text-lg",
    secondary: "text-white font-bold text-lg",
    outline: "text-gray-600 font-bold text-lg",
  };

  const buttonText = title || label;

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    >
      <Text className={`${textVariants[variant]}`}>{buttonText}</Text>
    </TouchableOpacity>
  );
};
