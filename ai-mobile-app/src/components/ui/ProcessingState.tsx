import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate
} from 'react-native-reanimated';

interface ProcessingStateProps {
  message?: string;
  subMessage?: string;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ 
  message = "Initializing Neural Synthesis...", 
  subMessage = "Synchronizing with AI core architecture..." 
}) => {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const rotation3 = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotation1.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1);
    rotation2.value = withRepeat(withTiming(-360, { duration: 2500, easing: Easing.linear }), -1);
    rotation3.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1);
    pulse.value = withRepeat(withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation1.value}deg` }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation2.value}deg` }],
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation3.value}deg` }],
  }));
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.8, 1]),
  }));

  return (
    <Animated.View 
      entering={FadeIn}
      className="flex-1 items-center justify-center p-8 bg-[#F8FAFC]"
    >
      <View className="relative w-40 h-40 items-center justify-center mb-16">
        {/* Animated Rings */}
        <Animated.View 
          style={ring1Style}
          className="absolute w-full h-full rounded-full border-2 border-indigo-500/20 border-t-indigo-500" 
        />
        <Animated.View 
          style={ring2Style}
          className="absolute w-32 h-32 rounded-full border-2 border-emerald-500/10 border-r-emerald-500" 
        />
        <Animated.View 
          style={ring3Style}
          className="absolute w-24 h-24 rounded-full border-2 border-blue-500/10 border-b-blue-500" 
        />
        
        {/* Core Pulsating Node */}
        <Animated.View 
            style={coreStyle}
            className="w-12 h-12 rounded-full bg-indigo-600 shadow-xl shadow-indigo-500/50 items-center justify-center" 
        >
            <View className="w-4 h-4 bg-white rounded-full opacity-40 animate-ping" />
        </Animated.View>
      </View>
      
      <Typography variant="h2" className="text-center mb-4 px-4 tracking-tighter">{message}</Typography>
      <Typography variant="body" className="text-center text-slate-400 px-8 leading-6">{subMessage}</Typography>
      
      {/* Dynamic Pulse Progress */}
      <View className="absolute bottom-20 w-full px-16">
        <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <Animated.View 
                className="h-full bg-indigo-500"
                entering={FadeIn.delay(300)}
                style={{ width: '65%' }} 
            />
        </View>
        <Typography variant="label" className="text-center mt-3 text-indigo-400/60 font-bold uppercase tracking-widest">Neural Pathway Active</Typography>
      </View>
    </Animated.View>
  );
};
