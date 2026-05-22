"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter as FilterIcon, History, LayoutGrid, List as ListIcon } from 'lucide-react';
import { SubmissionList } from '@/components/dashboard/SubmissionList';
import { FilterDrawer } from '@/components/dashboard/FilterDrawer';
import { SubmissionForm } from '@/components/dashboard/SubmissionForm';
import { CodeSubmission, CreateSubmissionData } from '@/types/submission';
import api from '@/lib/api';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: [] as string[],
    language: '',
    sortBy: 'newest'
  });

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/submissions');
      setSubmissions(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmission = async (data: CreateSubmissionData) => {
    const response = await api.post('/submissions', data);
    const newSubmission = response.data.data || response.data;
    fetchSubmissions();
    return newSubmission;
  };

  // Extract unique languages for filter options
  const uniqueLanguages = Array.from(new Set(submissions.map(s => s.language.toLowerCase()))).sort();

  const filteredSubmissions = submissions
    .filter(sub => {
      // Search matches
      const searchMatch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.language.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status matches
      const statusMatch = activeFilters.status.length === 0 || activeFilters.status.includes(sub.status || 'pending');
      
      // Language matches
      const languageMatch = activeFilters.language === '' || sub.language.toLowerCase() === activeFilters.language;
      
      return searchMatch && statusMatch && languageMatch;
    })
    .sort((a, b) => {
      if (activeFilters.sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (activeFilters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (activeFilters.sortBy === 'az') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const isLimitReached = submissions.length >= 20;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            <History className="h-8 w-8 text-indigo-600" />
            AI Code Review
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage all your historical code reviews.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => !isLimitReached && setIsFormOpen(true)}
            disabled={isLimitReached}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${
              isLimitReached 
                ? 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            <Plus className="h-5 w-5" />
            {isLimitReached ? 'Limit Reached' : 'New Submission'}
          </button>

          <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-400'}`}
            >
              <ListIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-400'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:text-white transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-sm border ${activeFilters.status.length > 0 || activeFilters.language !== '' ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <FilterIcon className="h-5 w-5" />
          Filter
          {(activeFilters.status.length > 0 || activeFilters.language !== '') && (
             <span className="bg-white text-indigo-600 h-5 w-5 rounded-full flex items-center justify-center text-[10px] ml-1">
               {activeFilters.status.length + (activeFilters.language !== '' ? 1 : 0)}
             </span>
          )}
        </button>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-1 shadow-inner min-h-[400px]">
        {loading ? (
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="p-4">
            <SubmissionList 
              submissions={filteredSubmissions} 
              viewMode={viewMode}
            />
          </div>
        )}
      </div>

      <FilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={activeFilters}
        onFilterChange={setActiveFilters}
        languages={uniqueLanguages}
      />

      {isFormOpen && (
        <SubmissionForm 
          onSubmit={handleSubmission} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

