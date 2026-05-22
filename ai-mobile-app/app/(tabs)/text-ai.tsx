import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { Container } from '@/src/components/ui/Container';
import { Typography } from '@/src/components/ui/Typography';
import { Button } from '@/src/components/ui/Button';
import { Select } from '@/src/components/ui/Select';
import { ProcessingState } from '@/src/components/ui/ProcessingState';
import { AIBubble } from '@/src/components/ui/AIBubble';
import { GradientCard } from '@/src/components/ui/GradientCard';
import { ScoreIndicator } from '@/src/components/ui/ScoreIndicator';
import { HistoryCard } from '@/src/components/ui/HistoryCard';
import { PurgeModal } from '@/src/components/ui/PurgeModal';
import { createTextSubmission, getTextHistory, deleteTextSubmission } from '@/src/services/textService';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import Animated, { FadeIn, SlideInRight, Layout } from 'react-native-reanimated';
import { useAuth } from '@/src/context/AuthContext';
import * as Clipboard from 'expo-clipboard';

export default function TextAiScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'history'>('audit');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('grammar');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    try {
      const data = await getTextHistory();
      setHistory(data.data || []);
    } catch (e) {
      console.error('History load failed', e);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHistory();
    setIsRefreshing(false);
  };

  const handleProcessText = async () => {
    if (!content.trim()) {
      setError('Neural pathways require input text to synthesize.');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);
    try {
      const response = await createTextSubmission({
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        content,
        mode: mode as any
      });
      setResult(response.data);
      refreshUser(); // Update counts
    } catch (err: any) {
      const msg = err.response?.data?.message || 'AI Assistant is currently busy. Please try again.';
      setError(msg);
      if (err.response?.status !== 403) {
          Alert.alert('Analysis Failed', msg);
      }
    } finally {
      setIsLoading(false);
    }
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
      await deleteTextSubmission(deletionId);
      await loadHistory();
      refreshUser();
      setDeletionId(null);
    } catch (e) {
      console.error('[NEURAL] Delete Failed:', e);
      Alert.alert('Error', 'Deconnection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ProcessingState message="Refining your text..." subMessage="Our AI is polishing your grammar and style." />;
  }

  return (
    <Container scrollable className="bg-[#F8FAFC]" refreshControl={
        activeTab === 'history' ? (
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
    }>
      <View className="py-6">
        {/* Header Section */}
        <Animated.View entering={FadeIn}>
            <View className="flex-row justify-between items-center mb-4">
                <Typography variant="h1" className="text-3xl font-black">Neural <Typography className="text-indigo-600">Text</Typography></Typography>
                <View className="bg-indigo-50 rounded-full px-4 py-1 border border-indigo-100">
                    <Typography variant="label" className="text-indigo-600 text-[10px]">PREMIUM AI</Typography>
                </View>
            </View>
            <Typography variant="body" className="text-slate-500 mb-12">Perfect grammar and professional rewriting in one tap.</Typography>
        </Animated.View>

        {/* Tab Switcher - More modern pill style */}
        <View className="flex-row bg-slate-200/50 p-1.5 rounded-[24px] mb-12 border border-slate-100">
            <TouchableOpacity 
                onPress={() => setActiveTab('audit')}
                activeOpacity={0.7}
                className={`flex-1 py-4 rounded-[20px] items-center ${activeTab === 'audit' ? 'bg-white' : ''}`}
            >
                <Typography variant="body" className={`font-bold ${activeTab === 'audit' ? 'text-indigo-600' : 'text-slate-400'}`}>New Audit</Typography>
            </TouchableOpacity><TouchableOpacity 
                onPress={() => setActiveTab('history')}
                activeOpacity={0.7}
                className={`flex-1 py-4 rounded-[20px] items-center ${activeTab === 'history' ? 'bg-white' : ''}`}
            >
                <Typography variant="body" className={`font-bold ${activeTab === 'history' ? 'text-indigo-600' : 'text-slate-400'}`}>History</Typography>
            </TouchableOpacity>
        </View>

        {activeTab === 'audit' ? (
            !result ? (
                <Animated.View entering={FadeIn} layout={Layout.springify()}>
                    <Select
                        label="Transformation Mode"
                        value={mode}
                        onSelect={setMode}
                        options={[
                            { label: 'Grammar & Punctuation', value: 'grammar' },
                            { label: 'Rewrite Professionally', value: 'rewrite' },
                            { label: 'Summarize Content', value: 'summarize' },
                            { label: 'Improve Style', value: 'improve' }
                        ]}
                    />

                    <View className={`bg-white rounded-[40px] p-8 min-h-[350] mb-12 border ${error ? 'border-rose-500 bg-rose-50/10' : 'border-slate-100'} mt-6 shadow-sm shadow-slate-100`}>
                        <TextInput
                            multiline
                            placeholder="Type or paste your text here..."
                            placeholderTextColor="#94A3B8"
                            value={content}
                            onChangeText={(text) => {
                                setContent(text);
                                if (error) setError('');
                            }}
                            textAlignVertical="top"
                            style={{ fontSize: 18, lineHeight: 28, color: '#1E293B', fontWeight: '500' }}
                            className="flex-1"
                        />
                        {error && (
                            <Typography variant="label" className="mt-4 text-rose-500 font-bold text-xs uppercase tracking-widest">{error}</Typography>
                        )}
                    </View>

                    <Button 
                        title="Process with Neural Engine ✨" 
                        onPress={handleProcessText}
                        className="h-20 rounded-[30px]"
                        style={{ backgroundColor: '#4f46e5' }}
                    />
                    <View className="h-10" />
                </Animated.View>
            ) : (
                <Animated.View entering={SlideInRight}>
                    <View className="flex-row justify-between items-center mb-10">
                        <Typography variant="h2">Results</Typography>
                        <TouchableOpacity onPress={() => setResult(null)} className="bg-slate-100 px-6 py-3 rounded-[20px]">
                            <Typography variant="body" className="text-slate-600 font-bold">New Audit</Typography>
                        </TouchableOpacity>
                    </View>

                    {result.analysis?.score && <ScoreIndicator score={result.analysis.score} />}

                    <View className="mt-12">
                        <Typography variant="label" className="text-slate-400 mb-4 ml-1">AI Explanation</Typography>
                        <AIBubble>
                            {result.analysis?.explanation || "Here is your improved text:"}
                        </AIBubble>
                    </View>

                    {/* Observations Section */}
                    {(result.analysis?.bugs?.length > 0 || result.analysis?.improvements?.length > 0) && (
                        <View className="mt-12 mb-12">
                            <Typography variant="label" className="text-slate-400 mb-4 ml-1">Observations</Typography>
                            <View className="bg-white border border-slate-100 rounded-[40px] p-8">
                                {result.analysis.bugs?.map((bug: string, idx: number) => (
                                    <View key={`bug-${idx}`} className="flex-row gap-4 items-start mb-5">
                                        <IconSymbol name="xmark.circle.fill" color="#EF4444" size={20} style={{ marginTop: 2 }} />
                                        <Typography variant="body" className="text-slate-700 flex-1">{bug}</Typography>
                                    </View>
                                ))}
                                {result.analysis.improvements?.map((imp: string, idx: number) => (
                                    <View key={`imp-${idx}`} className="flex-row gap-4 items-start mb-5 last:mb-0">
                                        <IconSymbol name="sparkles" color="#6366F1" size={20} style={{ marginTop: 2 }} />
                                        <Typography variant="body" className="text-slate-700 flex-1">{imp}</Typography>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <GradientCard colors={['#EEF2FF', '#EEF2FF']} className="mb-12 border border-indigo-100 p-8" style={{ borderRadius: 40 }}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Typography variant="h3" className="text-indigo-900">Improved Draft</Typography>
                            <TouchableOpacity 
                                className="bg-white px-4 py-2.5 rounded-2xl border border-indigo-50"
                                onPress={async () => {
                                    await Clipboard.setStringAsync(result.analysis?.processed_text || "");
                                    Alert.alert('Neural Synthesis Copied', 'The refined text has been stored in your clipboard.');
                                }}
                            >
                                <View className="flex-row items-center gap-2">
                                    <IconSymbol name="doc.on.doc.fill" color="#4F46E5" size={16} />
                                    <Typography variant="label" className="text-indigo-600">COPY</Typography>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Typography variant="body" className="text-indigo-900/80 leading-7 font-medium">
                            {result.analysis?.processed_text || "No improved text generated."}
                        </Typography>
                    </GradientCard>

                    <Button title="Analyze Again" onPress={() => setResult(null)} variant="outline" className="h-16 rounded-[24px] border-slate-200" />
                    <View className="h-10" />
                </Animated.View>
            )
        ) : (
            <Animated.View entering={FadeIn}>
                {history.length > 0 ? history.map((item: any) => (
                    <HistoryCard 
                        key={item.id} 
                        title={item.title} 
                        date={item.created_at} 
                        mode={item.mode} 
                        score={item.analysis?.score} 
                        originalText={item.content}
                        improvedText={item.analysis?.processed_text}
                        onPress={() => { 
                            setContent(item.content); 
                            setMode(item.mode); 
                            setResult(item); 
                            setActiveTab('audit'); 
                        }} 
                        onDelete={() => handleDeleteHistory(item.id)} 
                    />
                )) : (
                    <View className="items-center py-20">
                        <IconSymbol name="clock.arrow.circlepath" color="#E2E8F0" size={80} />
                        <Typography variant="h3" className="text-slate-300 mt-6">Records empty</Typography>
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
