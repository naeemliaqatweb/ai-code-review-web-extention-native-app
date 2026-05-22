"use client";

import React from 'react';

interface ScoreCardProps {
  score: number;
  label?: string;
}

export function ScoreCard({ score, label = "Code Quality Score" }: ScoreCardProps) {
  const percentage = (score / 10) * 100;
  
  // Color logic based on score
  const getColor = (s: number) => {
    if (s >= 8) return 'text-emerald-500';
    if (s >= 6) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStrokeColor = (s: number) => {
    if (s >= 8) return 'stroke-emerald-500';
    if (s >= 6) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const getLabel = (s: number) => {
    if (s >= 8) return 'Excellent';
    if (s >= 6) return 'Good';
    if (s >= 4) return 'Needs Work';
    return 'Critical';
  };

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
        {label}
      </h3>
      
      <div className="relative h-40 w-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Progress Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            className={`${getStrokeColor(score)}`}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-4xl font-extrabold ${getColor(score)} mt-1`}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mt-0.5">
            out of 10
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className={`text-lg font-bold ${getColor(score)} uppercase tracking-tight`}>
          {getLabel(score)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Based on 4 AI analysis parameters
        </p>
      </div>
    </div>
  );
}
