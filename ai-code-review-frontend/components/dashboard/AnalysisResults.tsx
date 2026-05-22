"use client";

import React from 'react';
import { 
  Bug, 
  ShieldAlert, 
  Lightbulb,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface AnalysisResultsProps {
  bugs: string[];
  improvements: string[];
  securityIssues: string[];
  fixedCode?: string;
  fixedExplanation?: string;
  fixedImprovements?: string[];
}

export function AnalysisResults({ 
  bugs, 
  improvements, 
  securityIssues, 
  fixedCode,
  fixedExplanation,
  fixedImprovements
}: AnalysisResultsProps) {
  const categories = [
    {
      title: 'Bugs & Logic Errors',
      items: bugs,
      icon: Bug,
      color: 'text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-900/50',
      dotColor: 'bg-red-500'
    },
    {
      title: 'Security Vulnerabilities',
      items: securityIssues,
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-900/50',
      dotColor: 'bg-amber-500'
    },
    {
      title: 'Optimization & Clean Code',
      items: improvements,
      icon: Lightbulb,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-900/50',
      dotColor: 'bg-blue-500'
    }
  ];

  const totalFindings = bugs.length + securityIssues.length + improvements.length;

  if (totalFindings === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mb-6">
          <ChevronDown className="h-8 w-8 text-emerald-600 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Your code is looking great!</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          The AI analysis didn't find any critical bugs or security issues. Keep up the high standard!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        category.items.length > 0 && (
          <div 
            key={category.title}
            className={`bg-white dark:bg-slate-900 rounded-3xl border ${category.borderColor} shadow-sm overflow-hidden`}
          >
            <div className={`px-6 py-4 flex items-center justify-between ${category.color}`}>
              <div className="flex items-center gap-3">
                <category.icon className="h-5 w-5" />
                <h3 className="font-bold tracking-tight">{category.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/50 dark:bg-black/20 text-xs font-bold ring-1 ring-inset ring-black/5 dark:ring-white/5">
                {category.items.length} {category.items.length === 1 ? 'finding' : 'findings'}
              </span>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {category.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 group">
                    <div className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${category.dotColor}`} />
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      ))}

      {fixedCode && (
        <div className="bg-emerald-600 rounded-3xl p-6 shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Lightbulb className="h-20 w-20" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Suggested Fix Available
            </h3>
            
            {fixedExplanation && (
              <p className="text-emerald-50 text-sm mb-4 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/10">
                {fixedExplanation}
              </p>
            )}

            {fixedImprovements && fixedImprovements.length > 0 && (
              <div className="mb-6 space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 ml-1 mb-3">Applied Improvements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {fixedImprovements.map((imp, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-emerald-500/30 px-3 py-2 rounded-xl border border-white/5 text-[11px] font-medium transition-all hover:bg-emerald-500/40">
                      <div className="h-1 w-1 rounded-full bg-emerald-300" />
                      {imp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => {
                const element = document.getElementById('suggested-fix-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-50 transition-all active:scale-[0.98]"
            >
              View Corrected Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { CheckCircle2 } from 'lucide-react';
