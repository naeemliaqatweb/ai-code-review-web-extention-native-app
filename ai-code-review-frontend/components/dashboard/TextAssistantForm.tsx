"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateTextSubmissionData, TextSubmission } from '@/types/text-submission';
import api from '@/lib/api';
import { 
  Send, 
  X, 
  MessageSquareText, 
  Terminal,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  FileText,
  PenTool,
  Zap,
  Sparkles
} from 'lucide-react';

interface TextAssistantFormProps {
  onSubmit: (data: CreateTextSubmissionData) => Promise<TextSubmission>;
  onClose: () => void;
}

const modes = [
  { id: 'grammar', name: 'Grammar', icon: <CheckCircle2 className="h-4 w-4" />, desc: 'Fix spelling & punctuation' },
  { id: 'rewrite', name: 'Rewrite', icon: <PenTool className="h-4 w-4" />, desc: 'Improve clarity & impact' },
  { id: 'summarize', name: 'Summarize', icon: <FileText className="h-4 w-4" />, desc: 'Concise key points' },
  { id: 'improve', name: 'Improve Tone', icon: <Zap className="h-4 w-4" />, desc: 'Enhance professional flow' },
];

export function TextAssistantForm(props: TextAssistantFormProps) {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"><RefreshCw className="h-10 w-10 animate-spin text-white" /></div>}>
      <TextAssistantFormInner {...props} />
    </Suspense>
  );
}

function TextAssistantFormInner({ onSubmit, onClose }: TextAssistantFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<CreateTextSubmissionData['mode']>('grammar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeSubmission, setActiveSubmission] = useState<TextSubmission | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submission = await onSubmit({ title, content, mode });
      setActiveSubmission(submission);
      setIsMonitoring(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeSubmission && isMonitoring && (activeSubmission.status === 'pending' || activeSubmission.status === 'processing')) {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/text-submissions/${activeSubmission.id}`);
          const updated = response.data.data;
          setActiveSubmission(updated);
        } catch (err) {
          console.error('Polling error', err);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSubmission?.status, isMonitoring]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">AI Text Assistant</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Professional Linguistic Audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {!isMonitoring ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 text-sm">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Submission Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Email to CEO"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 dark:text-white transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tool Selection</label>
              <div className="grid grid-cols-2 gap-3">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id as any)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      mode === m.id 
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${mode === m.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {m.icon}
                    </div>
                    <div>
                      <span className={`text-[11px] font-black uppercase tracking-wider block ${mode === m.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {m.name}
                      </span>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Text Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text here..."
                rows={6}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500 dark:text-white text-sm resize-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50">
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <>Enhance with AI <Sparkles className="h-4 w-4" /></>}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-12 flex flex-col items-center text-center">
            <div className={`h-24 w-24 rounded-3xl flex items-center justify-center mb-8 relative ${activeSubmission?.status === 'failed' ? 'bg-red-50 dark:bg-red-900/10 text-red-600' : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600'}`}>
              {activeSubmission?.status === 'completed' ? <CheckCircle2 className="h-12 w-12" /> : activeSubmission?.status === 'failed' ? <ShieldAlert className="h-12 w-12" /> : <RefreshCw className="h-12 w-12 animate-spin" />}
            </div>
            <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-slate-50">
              {activeSubmission?.status === 'completed' ? 'Refinement Complete!' : activeSubmission?.status === 'processing' ? 'AI Refining...' : 'Queueing...'}
            </h3>
            <p className="text-slate-500 mb-8 max-w-xs">{activeSubmission?.status === 'completed' ? 'Your enhanced text is ready for review.' : 'Our linguistic engine is processing your text.'}</p>
            <button
                onClick={() => router.push(`/dashboard/text-assistant/${activeSubmission?.id}`)}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${activeSubmission?.status === 'completed' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
              >
                View Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
