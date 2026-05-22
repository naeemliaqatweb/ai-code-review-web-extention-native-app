"use client";

import React, { useState, useEffect } from 'react';
import { Search, MessageSquareText, Plus } from 'lucide-react';
import { TextSubmissionList } from '@/components/dashboard/TextSubmissionList';
import { TextAssistantForm } from '@/components/dashboard/TextAssistantForm';
import { TextSubmission, CreateTextSubmissionData } from '@/types/text-submission';
import api from '@/lib/api';

export default function TextAssistantPage() {
  const [submissions, setSubmissions] = useState<TextSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/text-submissions');
      setSubmissions(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch text submissions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleCreateSubmission = async (data: CreateTextSubmissionData) => {
    const response = await api.post('/text-submissions', data);
    const newSubmission = response.data.data || response.data;
    setSubmissions([newSubmission, ...submissions]);
    return newSubmission;
  };

  const isLimitReached = submissions.length >= 20;

  const handleDeleteSubmission = async (id: number) => {
    try {
      if (!window.confirm('Are you sure you want to delete this audit?')) return;
      await api.delete(`/text-submissions/${id}`);
      setSubmissions(submissions.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete submission', error);
      alert('Failed to delete submission. Please try again.');
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.mode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            <MessageSquareText className="h-8 w-8 text-emerald-600" />
            AI Text Assistant
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Professional linguistic processing, grammar correction, and style refinement.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
           <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className={`${isLimitReached ? 'text-red-500' : 'text-emerald-500'}`}>
                {submissions.length} / 20
              </span>
              <span>Audits Used</span>
              <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ml-2">
                <div 
                  className={`h-full transition-all duration-500 ${isLimitReached ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min((submissions.length / 20) * 100, 100)}%` }}
                />
              </div>
           </div>
           
           <button 
             onClick={() => !isLimitReached && setIsFormOpen(true)}
             disabled={isLimitReached}
             className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
               isLimitReached 
                 ? 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed' 
                 : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
             }`}
           >
             <Plus className="h-5 w-5" />
             {isLimitReached ? 'Limit Reached' : 'New Text Audit'}
           </button>
        </div>
      </div>

      <div className="relative flex-1 w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search audits by title or mode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:text-white transition-all shadow-sm"
        />
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-1 shadow-inner min-h-[400px]">
        {loading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="p-4">
            <TextSubmissionList 
              submissions={filteredSubmissions} 
              onDelete={handleDeleteSubmission}
            />
          </div>
        )}
      </div>

      {isFormOpen && (
        <TextAssistantForm 
          onSubmit={handleCreateSubmission}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
