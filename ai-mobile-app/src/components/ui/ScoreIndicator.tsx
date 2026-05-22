import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ScoreIndicatorProps {
  score: number;
  label?: string;
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score, label = "Quality Score" }) => {
  const getScoreColor = (s: number) => {
    if (s >= 8) return '#34C759'; // Green
    if (s >= 5) return '#FFCC00'; // Yellow
    return '#FF3B30'; // Red
  };

  const color = getScoreColor(score);

  return (
    <Animated.View 
        entering={FadeIn}
        className="flex-row items-center bg-gray-50 rounded-2xl p-4 border border-gray-100"
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${color}15`, borderWidth: 2, borderColor: color }}
      >
        <Typography variant="h3" style={{ color }} className="font-bold">{score}</Typography>
      </View>
      <View>
        <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">{label}</Typography>
        <Typography variant="body" className="text-gray-600 font-medium">
            {score >= 8 ? 'Excellent' : score >= 5 ? 'Good' : 'Needs Work'}
        </Typography>
      </View>
    </Animated.View>
  );
};
