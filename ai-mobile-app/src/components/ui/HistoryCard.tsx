import React from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Typography } from './Typography';
import { IconSymbol } from './icon-symbol';
import { GradientCard } from './GradientCard';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface HistoryCardProps {
  title: string;
  date: string;
  mode: string;
  score?: number;
  originalText?: string;
  improvedText?: string;
  onPress: () => void;
  onDelete: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  title,
  date,
  mode,
  score,
  originalText,
  improvedText,
  onPress,
  onDelete
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 8) return '#10B981'; // Success Green
    if (s >= 5) return '#F59E0B'; // Warning Amber
    return '#EF4444'; // Error Red
  };

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const scoreValue = score || 0;
  const scoreColor = getScoreColor(scoreValue);

  return (
    <Animated.View entering={FadeInRight} className="mb-6">
      <View className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm shadow-slate-200/50">
        <View className="p-6">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center gap-2 mb-1.5">
                <View className="px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                  <Typography variant="label" className="text-indigo-600 text-[10px] uppercase font-bold">{mode}</Typography>
                </View>
                <Typography variant="caption" className="text-slate-400 font-medium">{formattedDate}</Typography>
              </View>
              <TouchableOpacity onPress={onPress}>
                <Typography variant="h4" numberOfLines={1} className="text-slate-900 font-black tracking-tight text-lg">
                  {title}
                </Typography>
              </TouchableOpacity>
            </View>

            <View 
              className="w-12 h-12 rounded-2xl items-center justify-center border-2"
              style={{ borderColor: `${scoreColor}20`, backgroundColor: `${scoreColor}08` }}
            >
              <Typography variant="h3" style={{ color: scoreColor }} className="font-bold text-lg">{scoreValue}</Typography>
            </View>
          </View>

          {/* Transformation Preview */}
          {(originalText || improvedText) && (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="bg-slate-50/80 rounded-2xl p-4 mb-4 border border-slate-100/50">
              {originalText && (
                <View className="mb-3">
                  <Typography variant="label" className="text-slate-400 text-[9px] uppercase font-bold mb-1">Original Source</Typography>
                  <Typography variant="body" numberOfLines={2} className="text-slate-500 text-xs leading-5">
                    {originalText}
                  </Typography>
                </View>
              )}
              {improvedText && (
                <View className="pt-3 border-t border-slate-200/50">
                  <Typography variant="label" className="text-indigo-400 text-[9px] uppercase font-bold mb-1">Neural Refinement</Typography>
                  <Typography variant="body" numberOfLines={2} className="text-indigo-900/70 text-xs leading-5 font-medium">
                    {improvedText}
                  </Typography>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Footer Actions */}
          <View className="flex-row justify-between items-center pt-2">
             <TouchableOpacity 
              onPress={onPress}
              className="flex-row items-center gap-1.5"
            >
              <IconSymbol name="eye.fill" color="#6366F1" size={14} />
              <Typography variant="label" className="text-indigo-600 font-bold">VIEW DETAILS</Typography>
            </TouchableOpacity>

            <Pressable 
              onPress={onDelete}
              hitSlop={20}
              className="w-10 h-10 bg-rose-50 rounded-xl border border-rose-100 items-center justify-center"
            >
              <IconSymbol name="trash.fill" color="#EF4444" size={16} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
