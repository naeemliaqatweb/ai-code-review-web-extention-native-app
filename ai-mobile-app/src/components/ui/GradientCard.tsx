import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: string[];
  className?: string;
  style?: ViewStyle;
  isGlass?: boolean;
}

export const GradientCard: React.FC<GradientCardProps> = ({ 
  children, 
  colors = ['#007AFF', '#5856D6'], 
  className = "",
  style,
  isGlass = false
}) => {
  return (
    <View 
      className={`rounded-[32px] overflow-hidden shadow-xl ${className}`}
      style={style}
    >
      {isGlass ? (
        <BlurView intensity={80} tint="light" className="flex-1 p-6">
          <LinearGradient
            colors={[`${colors[0]}15`, `${colors[1] || colors[0]}10`] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {children}
        </BlurView>
      ) : (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 p-6"
        >
          {children}
        </LinearGradient>
      )}
    </View>
  );
};
