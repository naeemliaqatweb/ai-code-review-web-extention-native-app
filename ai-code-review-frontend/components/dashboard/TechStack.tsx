"use client";

import React from 'react';
import { CodeSubmission } from '@/types/submission';
import { TextSubmission } from '@/types/text-submission';
import { 
  FileCode, 
  Cpu, 
  Globe, 
  Layers,
  Database,
  Terminal,
  Hash,
  Braces,
  MessageSquareText,
  FileText,
  MousePointer2
} from 'lucide-react';

interface TechStackProps {
  codeSubmissions: CodeSubmission[];
  textSubmissions: TextSubmission[];
  resumes: any[];
}

const getLanguageIcon = (lang: string) => {
  const l = lang.toLowerCase();
  if (l.includes('java') || l.includes('script') || l.includes('js') || l.includes('ts')) return Globe;
  if (l.includes('py') || l.includes('python')) return Terminal;
  if (l.includes('php')) return Cpu;
  if (l.includes('sql') || l.includes('data')) return Database;
  if (l.includes('c#') || l.includes('c++')) return Hash;
  return FileCode;
};

export function TechStack({ codeSubmissions, textSubmissions, resumes }: TechStackProps) {
  // 1. Language Count (Code)
  const langCounts: Record<string, number> = {};
  codeSubmissions.forEach(s => {
    const lang = s.language || 'Unknown';
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  });

  const topLangs = Object.entries(langCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // 2. Mode Count (Text)
  const modeCounts: Record<string, number> = {};
  textSubmissions.forEach(s => {
    const mode = s.mode || 'general';
    modeCounts[mode] = (modeCounts[mode] || 0) + 1;
  });

  const topModes = Object.entries(modeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const hasData = codeSubmissions.length > 0 || textSubmissions.length > 0 || resumes.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Layers className="h-24 w-24" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 mb-4 relative z-10">Expertise Stack</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium relative z-10 leading-relaxed">
          As you use our AI modules, we'll build a profile of your most frequent tech stacks and writing styles here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 group-hover:scale-125 transition-transform duration-700">
        <Braces className="h-40 w-40" />
      </div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">System Breakdown</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Multi-module expertise</p>
          </div>
        </div>

        {/* Code Languages Section */}
        {topLangs.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <span className="w-4 h-0.5 bg-indigo-500 rounded-full" />
               Development Stack
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {topLangs.map(([lang, count]) => {
                const Icon = getLanguageIcon(lang);
                return (
                  <div key={lang} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-indigo-100 transition-all group/item">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-600 shadow-sm group-hover/item:scale-110 transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 dark:text-slate-50 truncate w-full text-center">{lang}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Text Assistant Modes Section */}
        {topModes.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <span className="w-4 h-0.5 bg-emerald-500 rounded-full" />
               Writing Focus
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {topModes.map(([mode, count]) => (
                <div key={mode} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-emerald-100 transition-all group/item">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover/item:text-emerald-600 shadow-sm group-hover/item:scale-110 transition-all">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 dark:text-slate-50 capitalize truncate w-full text-center">{mode}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Volume Section */}
        {resumes.length > 0 && (
          <div className="pt-2">
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-between group/resume">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-amber-600 shadow-sm group-hover/resume:scale-110 transition-transform">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900 dark:text-slate-50">Resumes Optimized</h5>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Career Impact Module</p>
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-600">{resumes.length}</div>
            </div>
          </div>
        )}

        <button className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2">
           <MousePointer2 className="h-4 w-4" />
           Explore Insights
        </button>
      </div>
    </div>
  );
}
