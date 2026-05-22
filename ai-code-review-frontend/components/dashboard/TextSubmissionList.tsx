"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TextSubmission } from '@/types/text-submission';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  ShieldAlert,
  Trash2,
  ChevronRight,
  MessageSquareText
} from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';

interface TextSubmissionListProps {
  submissions: TextSubmission[];
  onDelete?: (id: number) => void;
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
    label: 'Processing'
  },
  completed: {
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50',
    icon: CheckCircle2,
    label: 'Completed'
  },
  failed: {
    color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50',
    icon: ShieldAlert,
    label: 'Failed'
  }
};

export function TextSubmissionList({ submissions, onDelete }: TextSubmissionListProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
        <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
          <MessageSquareText className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">No text audits yet</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-center max-w-sm">
          Paste your text to get an automated AI-powered linguistic review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const status = statusConfig[submission.status || 'pending'];
        
        return (
          <div
            key={submission.id}
            onClick={() => router.push(`/dashboard/text-assistant/${submission.id}`)}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
          >
            <div className="flex items-start gap-4 pr-12">
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/10 transition-colors shrink-0">
                <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  {submission.title}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50`}>
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
              
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(submission.id);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Delete Audit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
