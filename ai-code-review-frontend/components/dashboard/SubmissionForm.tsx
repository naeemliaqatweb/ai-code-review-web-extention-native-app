"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateSubmissionData, CodeSubmission } from '@/types/submission';
import api from '@/lib/api';
import { 
  Send, 
  X, 
  Code2, 
  Terminal,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  MessageSquareText,
  FileText,
  PenTool,
  Zap
} from 'lucide-react';

interface SubmissionFormProps {
  onSubmit: (data: CreateSubmissionData) => Promise<CodeSubmission>;
  onClose: () => void;
}

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'typescript', name: 'TypeScript', icon: 'TS' },
  { id: 'php', name: 'PHP', icon: 'PHP' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'go', name: 'Go', icon: 'GO' },
  { id: 'rust', name: 'Rust', icon: 'RS' },
  { id: 'java', name: 'Java', icon: 'JV' },
];

type SubmissionMode = 'review' | 'fix';

export function SubmissionForm(props: SubmissionFormProps) {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"><RefreshCw className="h-10 w-10 animate-spin text-white" /></div>}>
      <SubmissionFormInner {...props} />
    </Suspense>
  );
}

function SubmissionFormInner({ onSubmit, onClose }: SubmissionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<SubmissionMode>('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Monitoring state
  const [activeSubmission, setActiveSubmission] = useState<CodeSubmission | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Sync with URL parameters
  useEffect(() => {
    const queryMode = searchParams.get('mode') as SubmissionMode;
    if (queryMode && ['review', 'fix'].includes(queryMode)) {
      setMode(queryMode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submission = await onSubmit({ title, language, content, mode });
      setActiveSubmission(submission);
      setIsMonitoring(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Status Polling Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeSubmission && isMonitoring && (activeSubmission.status === 'pending' || activeSubmission.status === 'processing')) {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`/submissions/${activeSubmission.id}`);
          const updated = response.data.data || response.data;
          setActiveSubmission(updated);
        } catch (err) {
          console.error('Polling error', err);
        }
      }, 2500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSubmission?.status, isMonitoring]);

  const modeItems = [
    { id: 'review', name: 'Code Review', desc: 'Performance & security audit', color: 'indigo' },
    { id: 'fix', name: 'Code Fix', desc: 'Automated patch generation', color: 'emerald' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-900/5 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl text-white flex items-center justify-center shadow-lg transition-colors bg-indigo-600 shadow-indigo-500/20`}>
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                New Code Review
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Senior AI Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!isMonitoring ? (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 text-sm animate-in shake duration-500">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Website Fix"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:text-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:text-white transition-all cursor-pointer"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <Code2 className="h-4 w-4" />
                Engineering Tools
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modeItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as SubmissionMode)}
                    className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left group ${
                      mode === item.id 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className={`text-xs font-bold mb-1 ${mode === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.name}
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Content</label>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <Terminal className="h-3 w-3" />
                  Source Code
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your code here..."
                rows={8}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:text-white font-mono text-sm resize-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] py-4 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 text-white bg-indigo-600 hover:bg-indigo-700`}
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Process with AI
                    <Zap className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-12 flex flex-col items-center text-center">
            <div className={`h-24 w-24 rounded-3xl flex items-center justify-center mb-8 relative ${
              activeSubmission?.status === 'failed' 
                ? 'bg-red-50 dark:bg-red-900/10 text-red-600' 
                : 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600'
            }`}>
              {activeSubmission?.status === 'completed' ? (
                <CheckCircle2 className="h-12 w-12 animate-in zoom-in duration-300" />
              ) : activeSubmission?.status === 'failed' ? (
                <ShieldAlert className="h-12 w-12" />
              ) : (
                <RefreshCw className={`h-12 w-12 ${activeSubmission?.status === 'processing' ? 'animate-spin' : 'animate-pulse'}`} />
              )}
            </div>

            <div className="space-y-3 mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                {activeSubmission?.status === 'pending' && 'Queueing Analysis...'}
                {activeSubmission?.status === 'processing' && 'AI Thinking...'}
                {activeSubmission?.status === 'completed' && 'Done!'}
                {activeSubmission?.status === 'failed' && 'Error Occurred'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {activeSubmission?.status === 'completed' 
                   ? "Your results are ready. Click below to view the detailed breakdown."
                   : "Please wait while our Senior AI Assistant processes your request."}
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => router.push(`/dashboard/submissions/${activeSubmission?.id}`)}
                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  activeSubmission?.status === 'completed'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                View Results
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
