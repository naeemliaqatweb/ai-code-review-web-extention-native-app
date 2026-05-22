"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Check, 
  ChevronRight, 
  Crown, 
  Layout, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import api from '@/lib/api';

export default function TemplateSelectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get('/resume-templates');
        setTemplates(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedTemplate(response.data.data[0].slug);
        }
      } catch (error) {
        console.error('Failed to fetch templates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleContinue = () => {
    if (selectedTemplate) {
      router.push(`/dashboard/resume-builder/${id}/preview?template=${selectedTemplate}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading professional templates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analysis
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            <Layout className="h-8 w-8 text-indigo-600" />
            Select a Template
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Choose a professional design for your AI-optimized resume.
          </p>
        </div>
        <button
          onClick={handleContinue}
          disabled={!selectedTemplate}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          Preview Resume
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div 
            key={template.slug}
            onClick={() => setSelectedTemplate(template.slug)}
            className={`group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border-4 transition-all cursor-pointer ${
              selectedTemplate === template.slug 
                ? 'border-indigo-600 shadow-2xl scale-[1.02]' 
                : 'border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm'
            }`}
          >
            <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
               {/* Template Preview Image Placeholder */}
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <FileText className="h-24 w-24 text-slate-300 dark:text-slate-700" />
               </div>
               
               {template.is_premium && (
                 <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-lg">
                   <Crown className="h-3 w-3" />
                   Premium
                 </div>
               )}

               {selectedTemplate === template.slug && (
                 <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center backdrop-blur-[2px]">
                   <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl scale-110 animate-in zoom-in duration-300">
                     <Check className="h-6 w-6 stroke-[3]" />
                   </div>
                 </div>
               )}
            </div>

            <div className="p-6 space-y-2 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-50">{template.name}</h3>
                <span className={`text-[10px] font-bold uppercase ${template.is_premium ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {template.is_premium ? 'Paid' : 'Free'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{template.description || 'Professional resume design optimized for ATS systems.'}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 mt-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-indigo-600 flex-shrink-0">
             <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Need a custom design?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Our premium templates are designed by top recruitment specialists to pass any ATS system.</p>
          </div>
          <button className="md:ml-auto px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Browse All
          </button>
        </div>
      </div>
    </div>
  );
}

// Reuse icon
function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}
