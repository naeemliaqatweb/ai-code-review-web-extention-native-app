import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="code-ai"
        options={{
          title: 'Code AI',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="terminal.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="text-ai"
        options={{
          title: 'Text AI',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="text.bubble.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="resume-ai"
        options={{
          title: 'Resume AI',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.text.rectangle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
