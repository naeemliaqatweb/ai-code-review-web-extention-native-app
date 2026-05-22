"use client";

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CodeSubmission } from '@/types/submission';
import { TextSubmission } from '@/types/text-submission';

interface OverviewChartsProps {
  codeSubmissions: CodeSubmission[];
  textSubmissions: TextSubmission[];
  resumes: any[];
}

export function OverviewCharts({ codeSubmissions, textSubmissions, resumes }: OverviewChartsProps) {
  // Data for Bar Chart: Module Distribution
  const barData = [
    { name: 'Code Review', count: codeSubmissions.length, color: '#6366f1' },
    { name: 'Text Assistant', count: textSubmissions.length, color: '#10b981' },
    { name: 'Resume Builder', count: resumes.length, color: '#f59e0b' }
  ].filter(d => d.count > 0);

  // Unified data for Square Chart (Heatmap)
  // Combine all activities and sort by date
  const allSubmissions = [
    ...codeSubmissions.map(s => ({ ...s, type: 'code', typeLabel: 'Code Review' })),
    ...textSubmissions.map(s => ({ ...s, type: 'text', typeLabel: 'Text Assistant' })),
    ...resumes.map(s => ({ ...s, type: 'resume', typeLabel: 'Resume Builder', title: s.file_path ? s.file_path.split('/').pop() : 'Resume' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
   .slice(0, 40);

  const getModuleColorClass = (type: string, score: number | undefined) => {
    if (score === undefined) return 'bg-slate-100 dark:bg-slate-800';
    
    // Scale opacity/depth based on score? Or just module color?
    // Let's go with Module color but different intensity based on score
    const intensity = score >= 80 ? '100' : score >= 50 ? '70' : '40';
    
    if (type === 'code') {
      if (score >= 80) return 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]';
      if (score >= 50) return 'bg-indigo-400';
      return 'bg-indigo-200';
    }
    if (type === 'text') {
      if (score >= 80) return 'bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
      if (score >= 50) return 'bg-emerald-400';
      return 'bg-emerald-200';
    }
    if (type === 'resume') {
      if (score >= 80) return 'bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.4)]';
      if (score >= 50) return 'bg-amber-400';
      return 'bg-amber-200';
    }
    return 'bg-slate-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Module Distribution Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Active Modules</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Volume distribution across services</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600">
             <div className="flex gap-0.5">
                {[1, 2, 3].map(i => <div key={i} className="h-3 w-1 bg-indigo-500 rounded-full" />)}
             </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  backgroundColor: '#ffffff',
                  padding: '12px 16px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={50}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unified Quality Map (Square Chart) */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Global Workflow</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Universal performance heatmap</p>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {allSubmissions.length > 0 ? (
            allSubmissions.map((sub: any, i) => (
              <div 
                key={`${sub.type}-${sub.id}`}
                className={`h-9 w-9 rounded-xl ${getModuleColorClass(sub.type, sub.analysis?.score)} transition-all hover:scale-125 cursor-help group/square relative shadow-sm hover:z-20`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover/square:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl transition-all scale-75 group-hover/square:scale-100">
                  <p className="font-black border-b border-white/10 pb-1 mb-1">{sub.typeLabel}</p>
                  <p className="font-bold opacity-80 mb-1">{sub.title}</p>
                  <p className="font-black text-indigo-400">Score: {sub.analysis?.score || 'N/A'}%</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-40 text-slate-400 gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-slate-300 rounded-md border-dashed" />
              </div>
              <p className="text-sm font-bold italic opacity-60">No activity logged across modules.</p>
            </div>
          )}
          {/* Filler squares */}
          {allSubmissions.length > 0 && allSubmissions.length < 40 && Array.from({ length: 40 - allSubmissions.length }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 opacity-40 hover:opacity-100 transition-opacity" />
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>Code</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Text</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Resume</span>
            </div>
          </div>
          <p className="opacity-60">Last 40 integrated actions</p>
        </div>
      </div>
    </div>
  );
}
