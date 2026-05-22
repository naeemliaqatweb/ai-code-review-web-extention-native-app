import React from 'react';
import { View, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface PurgeModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const PurgeModal: React.FC<PurgeModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  title = "Termination Protocol",
  description = "This action will permanently erase the neural record from the core. This is irreversible."
}) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-end">
        {/* Deep Backdrop */}
        <Animated.View 
          entering={FadeIn.duration(200)}
          className="absolute inset-0 bg-slate-900/60"
        >
          <Pressable 
            className="flex-1" 
            onPress={onCancel}
          />
        </Animated.View>

        {/* Content Card - Solid & Crisp */}
        <Animated.View 
          entering={SlideInDown.springify().damping(28).stiffness(150)}
          style={{ backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20 }}
          className="rounded-t-[32px] p-5 pb-8 border-t border-slate-200"
        >
          <View className="w-10 h-1 bg-slate-100 rounded-full self-center mb-6" />
          
          <View className="items-center mb-6">
            <View className="w-12 h-12 bg-rose-50 rounded-2xl items-center justify-center mb-4 border border-rose-100">
               <View className="w-6 h-6 bg-rose-500 rounded-lg items-center justify-center">
                  <Typography variant="label" className="text-white font-black text-center text-[10px]">!</Typography>
               </View>
            </View>
            <Typography variant="h4" className="text-lg mb-1.5 text-slate-900 font-black">{title}</Typography>
            <Typography variant="caption" className="text-center text-slate-500 px-8 text-[12px] leading-4">
              {description}
            </Typography>
          </View>

          <View className="flex-row gap-2.5 px-2">
            <TouchableOpacity 
              onPress={onCancel}
              activeOpacity={0.7}
              className="flex-1 h-12 bg-slate-50 rounded-2xl items-center justify-center border border-slate-100"
            >
              <Typography variant="label" className="font-bold text-slate-400 text-[11px]">ABORT</Typography>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onConfirm}
              activeOpacity={0.8}
              className="flex-[1.2] h-12 bg-rose-500 rounded-2xl items-center justify-center"
            >
              <Typography variant="label" style={{ color: '#FFFFFF' }} className="font-bold text-white text-[11px]">CONFIRM PURGE</Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
