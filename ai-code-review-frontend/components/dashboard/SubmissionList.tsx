"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CodeSubmission } from '@/types/submission';
import { 
  Code2, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  ShieldAlert,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

interface SubmissionListProps {
  submissions: CodeSubmission[];
  viewMode?: 'grid' | 'list';
}

const statusConfig = {
  pending: {
    color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50',
    icon: Clock,
    label: 'Pending'
  },
  processing: {
    color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50',
    icon: RefreshCw,
    label: 'Analyzing'
  },
  reviewed: {
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50',
    icon: CheckCircle2,
    label: 'Reviewed'
  },
  completed: {
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50',
    icon: CheckCircle2,
    label: 'Reviewed'
  },
  failed: {
    color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50',
    icon: ShieldAlert,
    label: 'Failed'
  }
};

export function SubmissionList({ submissions, viewMode = 'list' }: SubmissionListProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
        <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Code2 className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No submissions yet</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-center max-w-sm">
          Submit your first code snippet to get an automated AI-powered review.
        </p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'list' ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"}>
      {submissions.map((submission) => {
        const status = statusConfig[submission.status || 'pending'];
        
        if (viewMode === 'list') {
          return (
            <div
              key={submission.id}
              onClick={() => router.push(`/dashboard/submissions/${submission.id}`)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 transition-colors shrink-0">
                  <Code2 className="h-6 w-6 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    {submission.title}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {submission.language}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      submission.mode === 'fix' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/50'
                    }`}>
                      {submission.mode}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 max-w-md">
                     {submission.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {mounted && submission.created_at ? formatDistanceToNow(new Date(submission.created_at), { addSuffix: true }) : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${status.color}`}>
                   <status.icon className="h-3.5 w-3.5" />
                   {status.label}
                </div>
                
                {submission.status === 'pending' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/submissions/${submission.id}?startAnalysis=true`);
                    }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    title="Run AI Review"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}

                <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        }

        // Grid View
        return (
          <div
            key={submission.id}
            onClick={() => router.push(`/dashboard/submissions/${submission.id}`)}
            className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Code2 className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                 <status.icon className="h-3 w-3" />
                 {status.label}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {submission.title}
              </h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {submission.language}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  submission.mode === 'fix' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                }`}>
                  {submission.mode}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {mounted && submission.created_at ? formatDistanceToNow(new Date(submission.created_at), { addSuffix: true }) : ''}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 line-clamp-3 mb-6 flex-1">
              {submission.content.substring(0, 150)}...
            </p>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">View Details</span>
              <div className="flex items-center gap-1 text-slate-400">
                {submission.status === 'pending' && (
                  <RefreshCw className="h-4 w-4 animate-spin-slow" />
                )}
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

