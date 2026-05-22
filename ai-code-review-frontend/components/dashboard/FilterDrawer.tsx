"use client";

import React from 'react';
import { X, Check } from 'lucide-react';

interface FilterState {
  status: string[];
  language: string;
  sortBy: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  languages: string[];
}

export function FilterDrawer({ isOpen, onClose, filters, onFilterChange, languages }: FilterDrawerProps) {
  const statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'failed', label: 'Failed' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'az', label: 'Title (A-Z)' },
  ];

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: newStatus });
  };

  const handleLanguageChange = (lang: string) => {
    onFilterChange({ ...filters, language: lang });
  };

  const handleSortChange = (sort: string) => {
    onFilterChange({ ...filters, sortBy: sort });
  };

  const clearAll = () => {
    onFilterChange({
      status: [],
      language: '',
      sortBy: 'newest'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 z-[60] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Filter Options</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Status Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Review Status</h3>
              <div className="space-y-3">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleStatus(opt.value)}
                    className="flex items-center justify-between w-full p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-500 transition-all text-left"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{opt.label}</span>
                    <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${filters.status.includes(opt.value) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}>
                      {filters.status.includes(opt.value) && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Programming Language</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleLanguageChange('')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${filters.language === '' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                >
                  All
                </button>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border capitalize ${filters.language === lang ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Section */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Sort By</h3>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-4">
              <button 
                onClick={clearAll}
                className="flex-1 py-4 px-4 rounded-2xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all shadow-sm"
              >
                Clear All
              </button>
              <button 
                onClick={onClose}
                className="flex-[2] py-4 px-4 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
