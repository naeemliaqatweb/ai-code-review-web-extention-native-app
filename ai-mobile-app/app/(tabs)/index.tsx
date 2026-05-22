import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { GradientCard } from '@/src/components/ui/GradientCard';
import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import Animated, { 
    FadeInUp, 
    FadeInDown, 
    useAnimatedStyle, 
    useSharedValue, 
    withRepeat, 
    withTiming, 
    Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'User';
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 0.6,
  }));

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* Neural Depth Layer */}
      <View className="absolute top-[-50] right-[-50] w-[300] h-[300] rounded-full bg-indigo-500/10 blur-3xl" />
      <View className="absolute top-[300] left-[-100] w-[400] h-[400] rounded-full bg-emerald-500/5 blur-3xl" />
      <View className="absolute bottom-[-100] right-[-50] w-[350] h-[350] rounded-full bg-indigo-600/5 blur-3xl" />
      
      <Container scrollable className="bg-transparent">
        {/* Modern Header - Refined */}
        <Animated.View 
          entering={FadeInUp.duration(600)}
          className="flex-row justify-between items-center py-6 mb-12"
        ><View><View className="flex-row items-center gap-2.5 mb-2"><View className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500" /><Typography variant="label" className="text-emerald-600/90 tracking-[0.2em]">NEURAL CORE: ONLINE</Typography></View><Typography variant="h1" className="text-4xl tracking-tighter">Hi, {firstName}</Typography></View><TouchableOpacity 
            onPress={signOut}
            activeOpacity={0.7}
            className="w-14 h-14 rounded-[22px] bg-white border border-slate-200 items-center justify-center p-1 shadow-sm overflow-hidden"
          ><LinearGradient
                colors={['#6366f1', '#4338ca']}
                className="w-full h-full items-center justify-center rounded-[18px]"
             ><Typography variant="h3" className="text-white font-black">{firstName[0]}</Typography></LinearGradient></TouchableOpacity></Animated.View>

        {/* Neural Hub - Light & Attractive Premium Design */}
        <Animated.View entering={FadeInDown.delay(100).duration(800)}>
          <View className="relative">
            {/* Pulsating background light - softer */}
            <Animated.View 
                style={pulseStyle}
                className="absolute inset-0 bg-indigo-400/10 rounded-[44px] blur-2xl" 
            />
            
            <GradientCard 
                colors={['#4F46E5', '#7C3AED']} // Vibrant Indigo to Violet
                className="mb-12 p-8 relative overflow-hidden border border-white/20"
                style={{ borderRadius: 44 }}
            >
                {/* Glossy Overlay */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0)']}
                    className="absolute top-0 left-0 right-0 h-32"
                />
                
                {/* Neural Pattern Simulation - Lightened */}
                <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <View className="flex-row justify-between items-start mb-10">
                    <View className="flex-row items-center gap-4">
                        <View className="bg-white/20 p-3.5 rounded-2xl border border-white/30">
                            <IconSymbol name="sparkles" color="#FFFFFF" size={24} />
                        </View>
                        <View>
                            <Typography variant="label" className="text-indigo-100 mb-1 tracking-widest font-black">NEURAL HUB V2.0</Typography>
                            <Typography variant="h2" className="text-white text-3xl font-black tracking-tighter">AI Core Active</Typography>
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center justify-between mb-10 px-2">
                    <View className="flex-1">
                        <Typography variant="h1" className="text-white text-4xl font-black">92<Typography variant="h3" className="text-white/60 font-bold">%</Typography></Typography>
                        <Typography variant="label" className="text-indigo-50 mt-1 font-bold">SYNERGY</Typography>
                    </View>
                    <View className="w-[1] h-14 bg-white/20 mx-6" />
                    <View className="flex-1">
                        <Typography variant="h1" className="text-white text-4xl font-black">1.4<Typography variant="h3" className="text-white/60 font-bold">k</Typography></Typography>
                        <Typography variant="label" className="text-indigo-50 mt-1 font-bold">CAPACITY</Typography>
                    </View>
                </View>
                
                <TouchableOpacity 
                    onPress={() => router.push('/(tabs)/code-ai')}
                    activeOpacity={0.9}
                    className="h-18"
                >
                    <View className="flex-1 bg-white rounded-[24px] items-center justify-center border border-white/40">
                        <Typography variant="body" className="text-[#4F46E5] font-black text-lg tracking-tight">INITIALIZE NEURAL PROBE</Typography>
                    </View>
                </TouchableOpacity>
            </GradientCard>
          </View>
        </Animated.View>

        {/* Modules Section - Refined Unique Style */}
        <View className="flex-row justify-between items-end mb-6 px-1"><Typography variant="label" className="tracking-[0.2em] text-slate-400">SERVICES</Typography></View><View className="flex-row gap-6 mb-12"><TouchableOpacity 
                className="flex-1"
                onPress={() => router.push('/(tabs)/code-ai')}
                activeOpacity={0.7}
            ><View className="bg-white p-8 rounded-[44px] border border-slate-100 items-start overflow-hidden"><View className="absolute top-[-20] right-[-20] w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" /><View className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl items-center justify-center mb-6"><IconSymbol name="terminal.fill" color="#4f46e5" size={28} /></View><Typography variant="h4" className="text-[#0F172A] mb-1 font-black">Code AI</Typography><View className="flex-row items-center gap-1.5"><Typography variant="muted" className="text-[10px] font-bold text-slate-400">USAGE:</Typography><Typography variant="label" className="text-indigo-600 font-bold text-[11px]">{user?.counts?.code || 0}<Typography className="text-slate-300 font-medium">/20</Typography></Typography></View></View></TouchableOpacity><TouchableOpacity 
                className="flex-1"
                onPress={() => router.push('/(tabs)/text-ai')}
                activeOpacity={0.7}
            ><View className="bg-white p-8 rounded-[44px] border border-slate-100 items-start overflow-hidden"><View className="absolute top-[-20] right-[-20] w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" /><View className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl items-center justify-center mb-6"><IconSymbol name="text.bubble.fill" color="#10b981" size={28} /></View><Typography variant="h4" className="text-[#0F172A] mb-1 font-black">Text AI</Typography><View className="flex-row items-center gap-1.5"><Typography variant="muted" className="text-[10px] font-bold text-slate-400">USAGE:</Typography><Typography variant="label" className="text-emerald-600 font-bold text-[11px]">{user?.counts?.text || 0}<Typography className="text-slate-300 font-medium">/20</Typography></Typography></View></View></TouchableOpacity></View>

        {/* Global Tools - Unique Glass Variant */}
        <Typography variant="label" className="mb-6 ml-1 tracking-[0.2em] text-slate-400">RESOURCES</Typography>
        <TouchableOpacity 
            onPress={() => router.push('/(tabs)/resume-ai' as any)}
            activeOpacity={0.7}
            className="mb-12"
        >
            <View className="bg-white p-2 rounded-[44px] border border-slate-100">
                <View className="flex-row items-center p-6 gap-8">
                    <LinearGradient
                        colors={['#F8FAFC', '#F1F5F9']}
                        className="w-24 h-24 border border-slate-200 rounded-[30px] items-center justify-center"
                    >
                        <IconSymbol name="person.text.rectangle.fill" color="#334155" size={40} />
                    </LinearGradient>
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                            <Typography variant="h3" className="font-black text-xl">Resume Pro</Typography>
                            <Typography variant="label" className="text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-[10px]">{user?.counts?.resume || 0}/20</Typography>
                        </View>
                        <Typography variant="muted" className="text-sm font-medium">Build ATS-optimized resumes with AI Neural drafting.</Typography>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

        {/* Next.js Inspired Explanation Section - The Neural Advantage */}
        <Animated.View 
            entering={FadeInUp.delay(400).duration(1000)}
            className="mb-16"
        >
            <View className="bg-[#0F172A] rounded-[50px] p-10 overflow-hidden border border-slate-800">
                {/* Background Accent */}
                <View className="absolute bottom-[-100] left-[-100] w-[300] h-[300] bg-indigo-500/10 rounded-full blur-3xl" />
                
                <Typography variant="label" className="text-indigo-400 tracking-[0.3em] font-black mb-4">ENGINEERED FOR EXCELLENCE</Typography>
                <Typography variant="h2" className="text-white text-4xl font-black mb-6 tracking-tighter">The Neural Advantage</Typography>
                <Typography variant="body" className="text-slate-400 mb-10 leading-6 font-medium">
                    Our Neural Core doesn't just process text; it synthesizes professional perfection through recursive optimization loops.
                </Typography>

                {/* Bento Grid Features */}
                <View className="gap-4">
                    {/* Feature 1 */}
                    <View className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex-row items-center gap-5">
                        <View className="w-12 h-12 bg-indigo-500/20 rounded-2xl items-center justify-center">
                            <IconSymbol name="bolt.fill" color="#818CF8" size={20} />
                        </View>
                        <View className="flex-1">
                            <Typography variant="h4" className="text-white mb-1">Adaptive Syntax</Typography>
                            <Typography variant="caption" className="text-slate-500 leading-5">Autocorrection tuned for professional clarity and professional impact.</Typography>
                        </View>
                    </View>

                    {/* Feature 2 */}
                    <View className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex-row items-center gap-5">
                        <View className="w-12 h-12 bg-emerald-500/20 rounded-2xl items-center justify-center">
                            <IconSymbol name="brain.head.profile" color="#34D399" size={20} />
                        </View>
                        <View className="flex-1">
                            <Typography variant="h4" className="text-white mb-1">Contextual IQ</Typography>
                            <Typography variant="caption" className="text-slate-500 leading-5">Deep understanding of project scope, tone, and professional requirements.</Typography>
                        </View>
                    </View>

                    {/* Feature 3 */}
                    <View className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex-row items-center gap-5">
                        <View className="w-12 h-12 bg-violet-500/20 rounded-2xl items-center justify-center">
                            <IconSymbol name="gauge.with.dots.needle.50percent" color="#A78BFA" size={20} />
                        </View>
                        <View className="flex-1">
                            <Typography variant="h4" className="text-white mb-1">Quantum Efficiency</Typography>
                            <Typography variant="caption" className="text-slate-500 leading-5">Sub-second processing for instantaneous professional synthesis.</Typography>
                        </View>
                    </View>
                </View>

                {/* Footer Link */}
                <TouchableOpacity className="mt-10 flex-row items-center border-t border-white/5 pt-8">
                    <Typography variant="body" className="text-indigo-400 font-bold mr-2">Learn more about our core protocols</Typography>
                    <IconSymbol name="arrow.right" color="#818CF8" size={16} />
                </TouchableOpacity>
            </View>
        </Animated.View>

        <View className="h-10" />
      </Container>
    </View>
  );
}
