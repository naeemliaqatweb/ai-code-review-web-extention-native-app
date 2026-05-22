"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Hash,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  Zap,
  Info,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { TextSubmission } from '@/types/text-submission';
import { ScoreCard } from '@/components/dashboard/ScoreCard';
import { format } from 'date-fns';

export default function TextSubmissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<TextSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'original' | 'enhanced'>('enhanced');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/text-submissions/${id}`);
      setSubmission(response.data.data || response.data);
    } catch (err: any) {
      setError('Failed to load submission details. It might not exist or you might not have permission.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!submission?.analysis?.processed_text) return;
    navigator.clipboard.writeText(submission.analysis.processed_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  // Polling for processing status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const needsPolling = submission && (submission.status === 'pending' || submission.status === 'processing');
    
    if (needsPolling) {
      interval = setInterval(() => {
        api.get(`/text-submissions/${id}`).then(response => {
          const updated = response.data.data || response.data;
          setSubmission(updated);
        }).catch(err => console.error('Polling failed', err));
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [submission?.status, id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-8">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-6 text-red-600">
          <ArrowLeft className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{error || 'Submission not found'}</h2>
        <Link href="/dashboard/text-assistant" className="mt-6 text-emerald-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Assistant
        </Link>
      </div>
    );
  }

  const analysis = submission.analysis;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {submission.title}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50`}>
                {submission.mode}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {format(new Date(submission.created_at), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="h-4 w-4" /> ID: {submission.id}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={fetchDetails}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <RotateCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setActiveTab('original')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'original' 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500'
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setActiveTab('enhanced')}
                  disabled={!analysis}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'enhanced' 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'text-slate-500'
                  } disabled:opacity-50`}
                >
                  Enhanced
                </button>
              </div>

              {activeTab === 'enhanced' && analysis && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Enhanced Text'}
                </button>
              )}
            </div>

            <div className="p-8">
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {activeTab === 'original' 
                  ? submission.content 
                  : (analysis?.processed_text || submission.content)
                }
              </div>

              {!analysis && submission.status !== 'failed' && (
                <div className="mt-8 p-6 bg-emerald-50/50 dark:bg-emerald-900/5 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-4">
                  <RefreshCw className="h-5 w-5 text-emerald-600 animate-spin" />
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">Processing with AI...</p>
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs">Our linguistic engine is refining your text. Please wait.</p>
                  </div>
                </div>
              )}

              {submission.status === 'failed' && (
                <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 flex flex-col items-center text-center">
                  <ShieldAlert className="h-10 w-10 text-red-600 mb-3" />
                  <p className="font-bold text-red-900 dark:text-red-100">Analysis Failed</p>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-1">We couldn't process this text. You might want to try again with a shorter snippet.</p>
                </div>
              )}
            </div>
          </div>

          {analysis?.explanation && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-600" />
                AI Observations
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{analysis.explanation}"
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {analysis && (
            <>
              <ScoreCard score={analysis.score} label="Quality Score" />
              
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Errors Addressed
                  </h4>
                  <ul className="space-y-3">
                    {analysis.bugs.length > 0 ? analysis.bugs.map((bug, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {bug}
                      </li>
                    )) : (
                      <li className="text-sm text-slate-400 italic">No significant errors found.</li>
                    )}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Style Improvements
                  </h4>
                  <ul className="space-y-3">
                    {analysis.improvements.length > 0 ? analysis.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {imp}
                      </li>
                    )) : (
                      <li className="text-sm text-slate-400 italic">Excellent flow and tone detected.</li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}

          {!analysis && submission.status !== 'failed' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
               <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
               </div>
               <h3 className="font-bold text-slate-900 dark:text-white">AI Refining...</h3>
               <p className="text-xs text-slate-500 mt-2">Results will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
