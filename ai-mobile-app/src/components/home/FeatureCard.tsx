import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Typography } from '../ui/Typography';
import { IconSymbol } from '../ui/icon-symbol';
import Animated, { FadeInUp, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  index: number;
  className?: string;
  isHero?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  onPress, 
  index,
  className = "",
  isHero = false
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const content = (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={animatedStyle}
      className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ${isHero ? 'bg-primary/5' : ''} ${className}`}
    >
      <View 
        className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <IconSymbol name={icon as any} color={color} size={24} />
      </View>
      
      <Typography variant={isHero ? "h2" : "h3"} className="mb-1">{title}</Typography>
      <Typography variant="caption" className="text-gray-500 mb-4">{description}</Typography>
      
      <TouchableOpacity 
        className="flex-row items-center gap-1 mt-auto"
        onPress={onPress}
      >
        <Typography variant="body" className="font-bold" style={{ color }}>Learn More</Typography>
        <IconSymbol name="chevron.right" color={color} size={14} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPressIn={() => (scale.value = 0.98)}
      onPressOut={() => (scale.value = 1)}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
};
