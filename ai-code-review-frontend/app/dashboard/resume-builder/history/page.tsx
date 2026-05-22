"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  History, 
  ChevronRight, 
  Calendar, 
  Download, 
  Eye, 
  Search,
  ArrowLeft,
  Filter,
  MoreVertical,
  Brain
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function ResumeHistoryPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        setResumes(response.data.data);
      } catch (error) {
        console.error('Failed to fetch resume history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const filteredResumes = resumes.filter(resume => {
    const fileName = resume.file_path ? resume.file_path.split('/').pop() : 'Text Submission';
    const searchString = fileName.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Retrieving your resume history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={() => router.push('/dashboard/resume-builder')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            <History className="h-8 w-8 text-indigo-600" />
            Resume History
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            View, manage, and download all your AI-optimized resumes.
          </p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {filteredResumes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 mx-auto">
                <FileText className="h-10 w-10" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">No resumes found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">You haven't optimized any resumes yet. Start now to see your history here.</p>
            </div>
            <button 
                onClick={() => router.push('/dashboard/resume-builder')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
            >
                Start AI Analysis
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResumes.map((resume) => {
            const fileName = resume.file_path ? resume.file_path.split('/').pop() : 'Text Submission';
            const date = format(new Date(resume.created_at), 'MMM dd, yyyy');
            const score = resume.analysis?.score || 0;

            return (
              <div 
                key={resume.id}
                className="group bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className={`h-16 w-16 min-w-[64px] rounded-2xl flex items-center justify-center text-indigo-600 ${resume.file_path ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-slate-50 dark:bg-slate-800'}`}>
                  <FileText className="h-8 w-8" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-slate-50 truncate max-w-xs">{fileName}</h3>
                    {resume.status === 'completed' ? (
                       <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-black uppercase tracking-wider">Completed</span>
                    ) : (
                       <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-[10px] font-black uppercase tracking-wider">Processing</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {date}</span>
                    <span className="flex items-center gap-1.5"><Brain className="h-3.5 w-3.5" /> Impact Score: <span className="text-indigo-600">{score}/10</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => router.push(`/dashboard/resume-builder/${resume.id}/analysis`)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-900 dark:text-slate-50 rounded-xl text-sm font-bold border border-slate-100 dark:border-slate-800 transition-all"
                  >
                    <Eye className="h-4 w-4" />
                    View Analysis
                  </button>
                  <button 
                    onClick={() => router.push(`/dashboard/resume-builder/${resume.id}/preview`)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    Get PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats/Tip Footer */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
            <Brain className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-black">Ready for a new application?</h3>
                <p className="text-indigo-100 font-medium">Create a tailored version of your resume for specific job descriptions.</p>
            </div>
            <button 
                onClick={() => router.push('/dashboard/resume-builder')}
                className="px-10 py-5 bg-white text-indigo-600 rounded-[24px] font-black shadow-2xl hover:bg-indigo-50 transition-all active:scale-[0.95] flex items-center gap-2"
            >
                Start New Analysis
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
}
