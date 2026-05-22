"use client";

import React, { useState } from 'react';
import { FileText, Upload, Send, Sparkles, CheckCircle2, History } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ResumeBuilderPage() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      if (content) formData.append('content', content);
      if (file) formData.append('file', file);

      const response = await api.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newResume = response.data.data;
      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/resume-builder/${newResume.id}/analysis`);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit resume', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in zoom-in duration-500">
        <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Resume Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            AI Resume Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Paste your resume text or upload your existing document to get started with AI optimization.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/resume-builder/history')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <History className="h-5 w-5" />
          View History
        </button>
      </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Paste Resume Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your current resume text here..."
              className="w-full h-64 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:text-white transition-all resize-none shadow-inner"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 dark:text-slate-400 font-bold">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Upload Document
            </label>
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-10 transition-all text-center ${
                file ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5'
              }`}
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {file ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Supported formats: PDF, DOC, DOCX (Max 2MB)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!content && !file)}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-[0.98] ${
              loading || (!content && !file)
                ? 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
            }`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Start AI Analysis
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
