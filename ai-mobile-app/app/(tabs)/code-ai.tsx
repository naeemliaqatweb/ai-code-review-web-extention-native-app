import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, Alert, TouchableOpacity, Pressable } from 'react-native';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Select } from '@/src/components/ui/Select';
import { ProcessingState } from '@/src/components/ui/ProcessingState';
import { GradientCard } from '@/src/components/ui/GradientCard';
import { AIBubble } from '@/src/components/ui/AIBubble';
import { ScoreIndicator } from '@/src/components/ui/ScoreIndicator';
import { createSubmission, analyzeCode, getSubmissions, deleteCodeSubmission } from '@/src/services/codeService';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { HistoryCard } from '@/src/components/ui/HistoryCard';
import { PurgeModal } from '@/src/components/ui/PurgeModal';
import Animated, { FadeIn, SlideInRight, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/src/context/AuthContext';
import { RefreshControl } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function CodeAiScreen() {
  const [activeTab, setActiveTab] = useState<'audit' | 'history'>('audit');
  const [history, setHistory] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('review');
  const [result, setResult] = useState<any>(null);
  const { refreshUser } = useAuth();

  const loadHistory = async () => {
    try {
      const data = await getSubmissions();
      setHistory(data.data || []);
    } catch (e) {
      console.error('Code history load failed', e);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHistory();
    setIsRefreshing(false);
  };

  const [deletionId, setDeletionId] = useState<number | null>(null);

  const handleDeleteHistory = async (id: number) => {
    console.log('[NEURAL] handleDeleteHistory called for ID:', id);
    setDeletionId(id);
  };

  const confirmDelete = async () => {
    if (!deletionId) return;
    try {
      setIsLoading(true);
      await deleteCodeSubmission(deletionId);
      await loadHistory();
      refreshUser();
      setDeletionId(null);
    } catch (e) {
      console.error('[NEURAL] API Delete Failed:', e);
      Alert.alert('Error', 'Purge failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    let hasError = false;
    if (!title.trim()) {
      setTitleError('Session title is required for Neural Tracking.');
      hasError = true;
    }
    if (!code.trim()) {
      setCodeError('Source code missing. Neural pathways require input.');
      hasError = true;
    }
    
    if (hasError) return;

    setTitleError('');
    setCodeError('');
    setIsLoading(true);
    try {
      const submission = await createSubmission({
        title,
        language,
        content: code,
        mode: mode as any
      });

      const analysis = await analyzeCode(submission.data.id);
      setResult(analysis.data);
      setStep(3);
      refreshUser(); // Update counts
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Code analysis flow failed';
      if (err.response?.status === 403) {
          setCodeError(msg);
      } else {
          Alert.alert('System Error', msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const reset = () => {
    setStep(1);
    setResult(null);
    setCode('');
    setTitle('');
  };

  if (isLoading) {
    return <ProcessingState message="Computing Insights..." subMessage="Scanning pathways for optimization and security..." />;
  }

  return (
    <Container 
        scrollable 
        className="bg-[#F8FAFC]"
        refreshControl={
            activeTab === 'history' ? (
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            ) : undefined
        }
    >
      <View className="py-6">
        {/* Modern Header */}
        <Animated.View entering={FadeIn}>
            <View className="flex-row justify-between items-center mb-4">
                <Typography variant="h1" className="text-3xl font-black">Neural <Typography className="text-indigo-600">Audit</Typography></Typography>
                <View className="bg-indigo-50 rounded-full px-4 py-1 border border-indigo-100">
                    <Typography variant="label" className="text-indigo-600 text-[10px]">ULTIMATE</Typography>
                </View>
            </View>
            <Typography variant="body" className="text-slate-500 mb-12">Quantum-level code analysis and automated fixes.</Typography>
        </Animated.View>

        {/* Tab Switcher */}
        <View className="flex-row bg-slate-200/50 p-1.5 rounded-[24px] mb-12 border border-slate-100">
            <TouchableOpacity 
                onPress={() => setActiveTab('audit')}
                activeOpacity={0.7}
                className={`flex-1 py-4 rounded-[20px] items-center ${activeTab === 'audit' ? 'bg-white shadow-sm' : ''}`}
            >
                <Typography variant="body" className={`font-bold ${activeTab === 'audit' ? 'text-indigo-600' : 'text-slate-400'}`}>New Audit</Typography>
            </TouchableOpacity><TouchableOpacity 
                onPress={() => setActiveTab('history')}
                activeOpacity={0.7}
                className={`flex-1 py-4 rounded-[20px] items-center ${activeTab === 'history' ? 'bg-white shadow-sm' : ''}`}
            >
                <Typography variant="body" className={`font-bold ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}>History</Typography>
            </TouchableOpacity>
        </View>

        {activeTab === 'audit' ? (
          <>
            {step === 1 && (
              <Animated.View entering={FadeIn} layout={Layout.springify()}>
                <Input
                  label="Session Title"
                  placeholder="e.g., Auth Engine V2"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (titleError) setTitleError('');
                  }}
                  error={titleError}
                  className="mb-8"
                />
                
                <View className="gap-6 mb-12">
                    <Select
                        label="Programming Language"
                        value={language}
                        onSelect={setLanguage}
                        options={[
                            { label: 'JavaScript', value: 'javascript' },
                            { label: 'TypeScript', value: 'typescript' },
                            { label: 'PHP', value: 'php' },
                            { label: 'Python', value: 'python' }
                        ]}
                    />
                    <Select
                        label="Analysis Strategy"
                        value={mode}
                        onSelect={setMode}
                        options={[
                            { label: 'Deep Security Review', value: 'review' },
                            { label: 'Automated Fix & Refactor', value: 'fix' },
                            { label: 'Logic Explanation', value: 'explain' }
                        ]}
                    />
                </View>

                <Button 
                  title="Configure Source" 
                  onPress={() => setStep(2)} 
                  className="h-16 rounded-[24px]"
                  style={{ backgroundColor: '#4f46e5' }}
                />
              </Animated.View>
            )}

            {step === 2 && (
              <Animated.View entering={SlideInRight} className="flex-1">
                <View className="flex-row justify-between items-center mb-8">
                   <Typography variant="h3">Source Code</Typography>
                   <TouchableOpacity onPress={() => setStep(1)} className="bg-slate-100 px-6 py-3 rounded-2xl">
                      <Typography variant="body" className="text-slate-600 font-bold">Settings</Typography>
                   </TouchableOpacity>
                </View>
                
                <View className={`bg-white rounded-[40px] p-8 min-h-[400] mb-12 border ${codeError ? 'border-rose-500 bg-rose-50/10' : 'border-slate-100'} overflow-hidden shadow-sm shadow-slate-100`}>
                    <TextInput
                      multiline
                      placeholder="Paste your source code here..."
                      placeholderTextColor="#94A3B8"
                      value={code}
                      onChangeText={(text) => {
                        setCode(text);
                        if (codeError) setCodeError('');
                      }}
                      textAlignVertical="top"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ 
                        fontFamily: 'monospace', 
                        fontSize: 14, 
                        color: '#1E293B',
                        minHeight: 350,
                        lineHeight: 22
                      }}
                      className="flex-1"
                    />
                    {codeError && (
                        <Typography variant="label" className="mt-4 text-rose-500 font-bold text-xs uppercase tracking-widest">{codeError}</Typography>
                    )}
                </View>

                <Button 
                  title="Analyze with AI" 
                  onPress={handleStartAnalysis} 
                  variant="primary"
                  className="h-16 rounded-[24px]"
                />
              </Animated.View>
            )}

            {step === 3 && result && (
              <Animated.View entering={FadeIn}>
                <View className="flex-row justify-between items-center mb-8">
                    <Typography variant="h2" className="text-3xl">Neural <Typography className="text-emerald-500">Report</Typography></Typography>
                    <TouchableOpacity onPress={reset} className="bg-slate-100 px-6 py-3 rounded-2xl">
                        <Typography variant="body" className="text-slate-600 font-bold">New Audit</Typography>
                    </TouchableOpacity>
                </View>

                <AIBubble>
                    {result.summary || result.analysis_results}
                </AIBubble>

                <View className="mt-12">
                   <Typography variant="label" className="text-slate-400 mb-4 ml-1">Performance Matrix</Typography>
                   {result.analysis_results && <ScoreIndicator score={8} label="Stability Index" />}
                </View>

                {result.improved_code && (
                    <View className="mt-12 mb-12">
                        <Typography variant="label" className="text-slate-400 mb-4 ml-1">Refined Architecture</Typography>
                        <View className="bg-[#0F172A] rounded-[44px] p-1 overflow-hidden border-2 border-slate-800 shadow-2xl">
                            <LinearGradient
                                colors={['#1e293b', '#0f172a']}
                                className="rounded-[42px] p-8"
                            >
                                <View className="flex-row justify-between items-center mb-8">
                                    <View>
                                        <Typography variant="h3" className="text-white font-black">Neural Terminal</Typography>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500" />
                                            <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Verified Efficiency</Typography>
                                        </View>
                                    </View>
                                    <TouchableOpacity 
                                        className="bg-white/5 border border-white/10 p-3.5 rounded-[20px]"
                                        onPress={async () => {
                                            await Clipboard.setStringAsync(result.improved_code || "");
                                            Alert.alert('Neural Script Copied', 'The refined architecture has been stored in your clipboard.');
                                        }}
                                    >
                                        <IconSymbol name="doc.on.doc.fill" color="#FFFFFF" size={18} />
                                    </TouchableOpacity>
                                </View>
                                
                                <View className="bg-black/40 rounded-3xl p-6 border-l-4 border-indigo-500/50">
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <Typography variant="body" style={{ fontFamily: 'monospace', color: '#10B981', fontSize: 13, lineHeight: 22 }}>
                                            {result.improved_code}
                                        </Typography>
                                    </ScrollView>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                )}

                <Button title="Analyze Another Snippet" onPress={reset} variant="outline" className="border-slate-200 h-16 rounded-[24px]" />
                <View className="h-10" />
              </Animated.View>
            )}
          </>
        ) : (
          <Animated.View entering={FadeIn}>
            {history.length > 0 ? history.map((item: any) => (
                <HistoryCard key={item.id} title={item.title} date={item.created_at} mode={item.mode || 'review'} score={8} onDelete={() => handleDeleteHistory(item.id)} onPress={() => { setTitle(item.title); setCode(item.content); setResult(item.analysis?.[0] || { improved_code: item.content, summary: 'Recalling previous audit details...' }); setStep(3); setActiveTab('audit'); }} />
            )) : (
                <View className="items-center py-20 opacity-30">
                    <IconSymbol name="brain.head.profile" color="#6366F1" size={80} />
                    <Typography variant="h3" className="mt-8 font-black">Archive Empty</Typography>
                </View>
            )}
          </Animated.View>
        )}
      </View>
      <PurgeModal 
        isVisible={!!deletionId} 
        onConfirm={confirmDelete} 
        onCancel={() => setDeletionId(null)} 
        title="Neural Purge"
      />
    </Container>
  );
}
