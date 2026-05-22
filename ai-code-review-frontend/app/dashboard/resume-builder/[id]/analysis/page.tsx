"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  Target,
  FileText,
  BrainCircuit
} from 'lucide-react';
import api from '@/lib/api';

export default function ResumeAnalysisPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/resumes/${id}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analysis', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Analyzing your resume content...</p>
      </div>
    );
  }

  const analysis = data?.analysis;
  const score = analysis?.score || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-indigo-600" />
            AI Analysis Results
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            We've identified several ways to improve your resume for better ATS performance.
          </p>
        </div>
        <button
          onClick={() => router.push(`/dashboard/resume-builder/${id}/templates`)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          Pick a Template
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Score Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Impact Score</h3>
          <div className="relative h-40 w-40 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-indigo-600 fill-none transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 10}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-5xl font-black text-slate-900 dark:text-slate-50">{score}<span className="text-xl text-slate-400">/10</span></span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Your resume is stronger than <span className="text-indigo-600 font-bold">75%</span> of applicants in our database.
          </p>
        </div>

        {/* Detailed Findings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Grammar & Tone</h3>
            </div>
            <ul className="space-y-4">
              {analysis?.grammar_corrections?.map((item: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  <span className="h-5 w-5 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm flex-shrink-0">{i+1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-amber-500">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Missing Sections</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {analysis?.missing_sections?.map((item: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold border border-amber-100 dark:border-amber-500/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8">
          <Sparkles className="h-16 w-16 text-white/10 group-hover:scale-125 transition-transform duration-700" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Suggested Skills</h3>
            <p className="text-indigo-100 text-sm">Our AI recommends adding these skills to match high-paying job descriptions.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {analysis?.skill_suggestions?.map((item: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-sm font-medium transition-colors border border-white/10">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
