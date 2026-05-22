import React from 'react';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { Button } from '@/src/components/ui/Button';
import { View } from 'react-native';

export default function TestUIScreen() {
  return (
    <Container className="justify-center items-center gap-6">
      <View className="bg-white p-8 rounded-3xl shadow-lg items-center w-full">
        <Typography variant="h1" className="mb-2 text-primary">
          NativeWind Works!
        </Typography>
        <Typography variant="body" className="text-center mb-6">
          This is a test of the utility-first styling system and the new design system.
        </Typography>
        
        <View className="w-full gap-4">
          <Button 
            label="Primary Action" 
            onPress={() => alert('Primary Pressed')} 
            variant="primary"
          />
          <Button 
            label="Secondary Action" 
            onPress={() => alert('Secondary Pressed')} 
            variant="secondary"
          />
          <Button 
            label="Outline Action" 
            onPress={() => alert('Outline Pressed')} 
            variant="outline"
          />
        </View>
      </View>
      
      <Typography variant="caption" className="mt-4">
        Scalable Design System Phase 1 Complete
      </Typography>
    </Container>
  );
}
