"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Code2, 
  Calendar, 
  Hash,
  RefreshCw,
  Terminal,
  Download,
  Trash2,
  CheckCircle2,
  Lightbulb,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { CodeSubmission } from '@/types/submission';
import { ScoreCard } from '@/components/dashboard/ScoreCard';
import { AnalysisResults } from '@/components/dashboard/AnalysisResults';
import { CodeComparison } from '@/components/dashboard/CodeComparison';
import { CodeViewer } from '@/components/dashboard/CodeViewer';
import { ConfirmationModal } from '@/components/dashboard/ConfirmationModal';
import { format } from 'date-fns';
import { generatePDFReport } from '@/lib/pdf-generator';

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<CodeSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'original' | 'fixed' | 'compare'>('compare');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions/${id}`);
      setSubmission(response.data.data || response.data);
    } catch (err: any) {
      setError('Failed to load submission details. It might not exist or you might not have permission.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!submission) return;
    setGeneratingPDF(true);
    try {
      generatePDFReport(submission);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!submission) return;
    try {
      setLoading(true);
      await api.post('/analyze-code', { submission_id: submission.id });
      await fetchDetails();
    } catch (err: any) {
      console.error('Analysis failed', err);
      // Don't set state-blocking error, just log it. 
      // User can retry.
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!submission || !window.confirm('Are you sure you want to delete this submission? This cannot be undone.')) return;
    
    try {
      setIsDeleting(true);
      await api.delete(`/submissions/${submission.id}`);
      router.push('/dashboard/submissions');
    } catch (err: any) {
      console.error('Failed to delete submission', err);
      alert('Failed to delete submission. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleApplyFix = async () => {
    if (!submission || !submission.analysis?.fixed_code) return;

    try {
      setIsApplying(true);
      await api.post(`/submissions/${submission.id}/apply-fix`);
      await fetchDetails();
      setActiveCodeTab('original'); // Switch to original to see the updated code
      alert('Fix applied successfully! A backup of your previous version was saved.');
    } catch (err: any) {
      console.error('Failed to apply fix', err);
      alert(err.response?.data?.message || 'Failed to apply fix. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchDetails().then(() => {
        // Check for manual trigger query param
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('startAnalysis') === 'true') {
          handleStartAnalysis();
          // Clean up the URL
          window.history.replaceState({}, '', window.location.pathname);
        }
      });
    }
  }, [id]);


  // Polling for pending/processing status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const needsPolling = submission && (submission.status === 'pending' || submission.status === 'processing');
    
    if (needsPolling) {
      interval = setInterval(() => {
        // We use a separate flag or check to avoid setting loading=true on every poll
        // to prevent UI flickering
        api.get(`/submissions/${id}`).then(response => {
          const updatedSubmission = response.data.data || response.data;
          setSubmission(updatedSubmission);
        }).catch(err => console.error('Polling failed', err));
      }, 5000); // Poll every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [submission?.status, id]);


  const [showDiff, setShowDiff] = useState(true);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-6 text-red-600">
          <ArrowLeft className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{error || 'Submission not found'}</h2>
        <Link href="/dashboard" className="mt-6 text-indigo-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const analysis = submission.analysis;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {submission.title}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 capitalize">
                <Code2 className="h-4 w-4" /> {submission.language}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                submission.mode === 'fix' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' 
                  : 'bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/50'
              }`}>
                {submission.mode}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {format(new Date(submission.created_at), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="h-4 w-4" /> ID: {submission.id}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-red-600 dark:text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm disabled:opacity-50"
            title="Delete this submission"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          
          <button 
            onClick={fetchDetails}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>

          {submission.analysis && (
            <button 
              onClick={handleDownloadPDF}
              disabled={generatingPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              {generatingPDF ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export PDF
            </button>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {submission.mode === 'fix' && analysis?.fixed_code ? (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                <button
                  onClick={() => setActiveCodeTab('original')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCodeTab === 'original' 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Terminal className="h-4 w-4" /> Original
                </button>
                <button
                  onClick={() => setActiveCodeTab('fixed')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCodeTab === 'fixed' 
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" /> Fixed
                </button>
                <button
                  onClick={() => setActiveCodeTab('compare')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCodeTab === 'compare' 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="h-4 w-4" /> Compare
                </button>
              </div>

              {/* View Content */}
              {activeCodeTab === 'compare' ? (
                <CodeComparison 
                  oldCode={submission.content} 
                  newCode={analysis.fixed_code} 
                  language={submission.language}
                  filename={submission.title}
                />
              ) : activeCodeTab === 'fixed' ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 flex items-center justify-between">
                    <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 className="h-4 w-4" /> This code addresses the identified issues.
                    </p>
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      disabled={isApplying}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply This Fix'}
                    </button>
                  </div>
                  <CodeViewer 
                    code={analysis.fixed_code} 
                    language={submission.language} 
                  />
                </div>
              ) : (
                <CodeViewer 
                  code={submission.content} 
                  language={submission.language} 
                />
              )}
            </div>
          ) : (
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-2">
                 <Terminal className="h-4 w-4" /> Submitted Code
               </h3>
               <CodeViewer 
                 code={submission.content} 
                 language={submission.language} 
               />
            </div>
          )}
        </div>

        <div className="space-y-8">
          {analysis ? (
            <>
              <ScoreCard score={analysis.score} />
              <div className="space-y-4">
                 <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 ml-1">Analysis Findings</h2>
                 <AnalysisResults 
                   bugs={analysis.bugs} 
                   securityIssues={analysis.security_issues} 
                   improvements={analysis.improvements} 
                   fixedCode={analysis.fixed_code}
                   fixedExplanation={analysis.fixed_explanation}
                   fixedImprovements={analysis.fixed_improvements}
                 />
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center shadow-sm">
              <div className={`h-20 w-20 rounded-2xl flex items-center justify-center mb-6 ${
                submission.status === 'failed' 
                  ? 'bg-red-50 dark:bg-red-900/10 text-red-600' 
                  : 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600'
              }`}>
                {submission.status === 'failed' ? (
                  <ShieldAlert className="h-10 w-10" />
                ) : (
                  <RefreshCw className={`h-10 w-10 ${submission.status === 'processing' ? 'animate-spin' : 'animate-pulse'}`} />
                )}
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                {submission.status === 'pending' && 'In Queue...'}
                {submission.status === 'processing' && 'AI Review Active'}
                {submission.status === 'failed' && 'Analysis Failed'}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 text-sm leading-relaxed px-4">
                {submission.status === 'pending' && "Your code is waiting for an available AI reviewer. This usually takes just a few seconds."}
                {submission.status === 'processing' && "Our senior AI auditor is currently reviewing your code for bugs and security issues."}
                {submission.status === 'failed' && "Something went wrong while communicating with the AI. You can try triggering it again manually."}
              </p>
              
              <button 
                onClick={handleStartAnalysis}
                disabled={submission.status === 'processing'}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
                  submission.status === 'failed'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                } disabled:opacity-50`}
              >
                {submission.status === 'processing' ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {submission.status === 'failed' ? 'Retry Analysis' : 'Refresh Status Now'}
                  </>
                )}
              </button>
            </div>

          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onConfirm={handleApplyFix}
        title="Apply Sugggested Fix?"
        message="This will overwrite your original code with the AI's suggested version. A backup of your current code will be saved in the version history."
        confirmText="Apply Overwrite"
        isDanger={false}
      />
    </div>
  );
}
