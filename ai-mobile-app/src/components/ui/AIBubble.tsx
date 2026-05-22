import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

interface AIBubbleProps {
  children: React.ReactNode;
  isAI?: boolean;
}

export const AIBubble: React.FC<AIBubbleProps> = ({ children, isAI = true }) => {
  return (
    <Animated.View 
      layout={Layout.springify()}
      entering={FadeInUp}
      className={`mb-4 max-w-[85%] rounded-[24px] p-4 ${
        isAI 
          ? 'bg-white self-start border border-gray-100 shadow-sm' 
          : 'bg-primary self-end'
      }`}
    >
      {isAI && (
        <View className="flex-row items-center gap-2 mb-2">
            <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center">
                <IconSymbol name="sparkles" color="#007AFF" size={12} />
            </View>
            <Typography variant="caption" className="font-bold text-primary">Antigravity AI</Typography>
        </View>
      )}
      <Typography 
        variant="body" 
        className={isAI ? 'text-gray-800' : 'text-white'}
      >
        {children}
      </Typography>
    </Animated.View>
  );
};
