"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Code2, 
  FileText, 
  MessageSquareText, 
  ShieldAlert,
  Zap,
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react';
import { OverviewCharts } from '@/components/dashboard/OverviewCharts';
import { TechStack } from '@/components/dashboard/TechStack';
import { CodeSubmission } from '@/types/submission';
import { TextSubmission } from '@/types/text-submission';
import api from '@/lib/api';

export default function DashboardPage() {
  const [codeData, setCodeData] = useState<CodeSubmission[]>([]);
  const [textData, setTextData] = useState<TextSubmission[]>([]);
  const [resumeData, setResumeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [codeRes, textRes, resumeRes] = await Promise.all([
        api.get('/submissions'),
        api.get('/text-submissions'),
        api.get('/resumes')
      ]);

      setCodeData(codeRes.data.data || codeRes.data);
      setTextData(textRes.data.data || textRes.data);
      setResumeData(resumeRes.data.data || resumeRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const totalAudits = codeData.length + textData.length + resumeData.length;
  
  const calculateAverage = (data: any[]) => {
    if (data.length === 0) return 0;
    const scores = data.map(item => item.analysis?.score || 0).filter(s => s > 0);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const globalAverageScore = Math.round(
    (calculateAverage(codeData) + calculateAverage(textData) + calculateAverage(resumeData)) / 
    ([codeData, textData, resumeData].filter(d => d.length > 0).length || 1)
  );

  const completedReviews = 
    codeData.filter(s => s.status === 'completed' || s.status === 'reviewed').length +
    textData.filter(s => s.status === 'completed').length +
    resumeData.filter(s => s.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold tracking-tight">Consolidating your AI insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
            Unified view of your AI activities across all modules.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 px-6 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
          <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          <span className="text-sm font-black text-indigo-700 dark:text-indigo-300">AI Engine: Gemini Pro</span>
        </div>
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
            <TrendingUp className="h-24 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-600">All Modules</span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total AI Audits</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-50">{totalAudits}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
            <Award className="h-24 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black bg-purple-100 dark:bg-purple-500/20 px-3 py-1 rounded-full text-purple-600">Average Score</span>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">System Excellence</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-50">{globalAverageScore}%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
            <ShieldAlert className="h-24 w-24" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Completed Works</p>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-50">{completedReviews}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Audit Usage</p>
          <div className="mt-2">
            <div className="flex justify-between text-[10px] mb-1 font-black">
              <span>{codeData.length + textData.length + resumeData.length} / 60</span>
              <span>{Math.round(((codeData.length + textData.length + resumeData.length) / 60) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                style={{ width: `${((codeData.length + textData.length + resumeData.length) / 60) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Consolidated Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <OverviewCharts 
            codeSubmissions={codeData}
            textSubmissions={textData}
            resumes={resumeData}
          />
          
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <span className="px-4 py-1.5 bg-indigo-500/20 rounded-full text-indigo-400 text-xs font-black tracking-widest uppercase border border-indigo-500/30">Quick Action</span>
                <h2 className="text-4xl font-extrabold tracking-tight">Need a professional audit?</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                  Select a module below to start your next AI-enhanced analysis. Our engine is ready to process your request.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link 
                    href="/dashboard/submissions"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                  >
                    <Code2 className="h-5 w-5" />
                    Code Review
                  </Link>
                  <Link 
                    href="/dashboard/text-assistant"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20"
                  >
                    <MessageSquareText className="h-5 w-5" />
                    Text Assistant
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 animate-bounce duration-[3000ms]">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                    <div className="h-48 w-48 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center relative z-10">
                        <Zap className="h-20 w-20 text-indigo-500" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <TechStack 
            codeSubmissions={codeData}
            textSubmissions={textData}
            resumes={resumeData}
          />
          
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/5 rounded-full -mr-10 -mt-10" />
             <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 mb-6">Service Spotlight</h3>
             <div className="space-y-5">
                <Link 
                  href="/dashboard/resume-builder"
                  className="group flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-100 dark:hover:border-amber-500/20"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-amber-600 group-hover:scale-110 transition-transform">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 dark:text-slate-50 text-base">Resume Builder</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">PDF Optimized by AI</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-amber-600 transition-all group-hover:translate-x-1" />
                </Link>

                <div className="p-6 rounded-[24px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xl">
                    <h4 className="font-black text-lg mb-2">Pro Tip</h4>
                    <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                        Using 'Summarize' mode in Text Assistant can help you condense long code documentation before review.
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
