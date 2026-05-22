"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  Download, 
  ArrowLeft, 
  Eye, 
  Printer, 
  FileCheck,
  Smartphone,
  CheckCircle2,
  XCircle,
  Edit3,
  History as HistoryIcon,
  RotateCcw,
  User as UserIcon
} from 'lucide-react';
import api from '@/lib/api';
import ResumeEditor from '@/components/resume/ResumeEditor';
import ResumeThemeControls from '@/components/resume/ResumeThemeControls';
import { format } from 'date-fns';

export default function ResumePreviewPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const template = searchParams.get('template') || 'modern-minimalist';
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Styling State
  const [styleConfig, setStyleConfig] = useState({
    primaryColor: '#4f46e5',
    backgroundColor: '#ffffff',
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    fontFamily: 'sans' as 'sans' | 'serif' | 'mono',
    layout: 'modern' as 'modern' | 'classic' | 'sidebar'
  });

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, [id]);

  useEffect(() => {
    if (data?.rewrite?.style_config) {
      setStyleConfig(prev => ({ ...prev, ...data.rewrite.style_config }));
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/resumes/${id}`);
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch resume data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/resumes/${id}/history`);
      setHistory(response.data.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleSave = async (newData: any) => {
    setIsSaving(true);
    setError(null);
    try {
      // Merge current style config into the update
      const updateData = {
        ...newData,
        style_config: styleConfig
      };
      await api.put(`/resumes/${id}/rewrite`, updateData);
      await fetchData();
      await fetchHistory();
      setEditMode(false);
    } catch (err: any) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStyle = async (newConfig: any) => {
    setStyleConfig(newConfig);
    // Autosave styling changes to the active rewrite
    try {
      await api.put(`/resumes/${id}/rewrite`, {
        ...data.rewrite,
        style_config: newConfig
      });
    } catch (err) {
      console.error('Failed to save style config', err);
    }
  };

  const handleRestore = async (version: any) => {
    await handleSave({
      summary: version.summary,
      experience: version.experience,
      skills: version.skills,
      education: version.education,
      contact_details: version.contact_details,
      profile_image: version.profile_image,
      style_config: version.style_config
    });
    if (version.style_config) {
      setStyleConfig(version.style_config);
    }
  };

  const handleDownload = async () => {
    // ... download code remains same ...
    setDownloading(true);
    setError(null);
    try {
      const response = await api.get(`/resumes/${id}/download?template=${template}&style=${JSON.stringify(styleConfig)}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume-${data?.user?.name || 'ReviewAI'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error('Download failed', err);
      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        const errorData = JSON.parse(text);
        setError(errorData.error || 'Download failed');
      } else {
        setError('Download failed. Please check your plan or try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-tight">Generating your premium preview...</p>
      </div>
    );
  }

  const rewrite = data?.rewrite;

  // Font styling mapping
  const fontSizeMap: Record<string, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg text-slate-800'
  };

  const fontFamilyMap: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const renderModernLayout = (rewrite: any, styleConfig: any) => (
    <div 
      className={`bg-white rounded-3xl p-16 shadow-2xl transition-all duration-500 overflow-hidden relative ${fontFamilyMap[styleConfig.fontFamily]}`}
      style={{ backgroundColor: styleConfig.backgroundColor }}
    >
      <div 
        className="flex flex-col md:flex-row items-center gap-10 border-b-4 pb-12 mb-12"
        style={{ borderColor: styleConfig.primaryColor }}
      >
        {rewrite?.profile_image ? (
          <div className="h-32 w-32 rounded-[2rem] overflow-hidden shadow-lg flex-shrink-0 border-2 border-slate-100 bg-slate-50">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${rewrite.profile_image}`} 
              alt="Profile" 
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="h-full w-full flex items-center justify-center bg-slate-100"><svg class="h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
              }}
            />
          </div>
        ) : (
          <div className="h-32 w-32 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 shadow-inner">
             <UserIcon className="h-12 w-12" />
          </div>
        )}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            {data?.user?.name}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-xs font-black uppercase tracking-widest">
            {rewrite?.contact_details?.email && <span className="flex items-center gap-1 py-1 px-2 bg-slate-50 rounded italic">{rewrite.contact_details.email}</span>}
            {rewrite?.contact_details?.phone && <span className="flex items-center gap-1 py-1 px-2 bg-slate-50 rounded">{rewrite.contact_details.phone}</span>}
            {rewrite?.contact_details?.location && <span className="flex items-center gap-1 py-1 px-2 bg-slate-50 rounded">{rewrite.contact_details.location}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <section className="space-y-4">
          <h3 className="font-black uppercase text-[10px] tracking-[0.3em]" style={{ color: styleConfig.primaryColor }}>Professional Profile</h3>
          <p className={`${fontSizeMap[styleConfig.fontSize]} text-slate-700 leading-relaxed`}>{rewrite?.summary}</p>
        </section>

        <section className="space-y-8">
          <h3 className="font-black uppercase text-[10px] tracking-[0.3em]" style={{ color: styleConfig.primaryColor }}>Strategic Experience</h3>
          <div className="space-y-10">
            {rewrite?.experience?.map((exp: any, i: number) => (
              <div key={i} className="space-y-3 relative">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-xl font-black text-slate-900">{exp.role}</h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">{exp.duration}</span>
                </div>
                <div className="font-black uppercase text-[11px] tracking-widest" style={{ color: styleConfig.primaryColor }}>{exp.company}</div>
                <ul className={`list-none space-y-2 text-slate-600 ${fontSizeMap[styleConfig.fontSize]}`}>
                    {exp.achievements?.map((ach: string, j: number) => (
                      <li key={j} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: styleConfig.primaryColor }} />
                        {ach}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-slate-100">
          <section className="space-y-4">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em]" style={{ color: styleConfig.primaryColor }}>Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {rewrite?.skills?.map((skill: string, i: number) => (
                <span key={i} className="text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm" style={{ backgroundColor: styleConfig.primaryColor }}>{skill}</span>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em]" style={{ color: styleConfig.primaryColor }}>Academic Base</h3>
            <div className="space-y-6">
              {rewrite?.education?.map((edu: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                    <span className="text-[10px] font-black text-slate-400">{edu.year}</span>
                  </div>
                  <div className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderCorporateLayout = (rewrite: any, styleConfig: any) => (
    <div 
      className={`min-h-[1100px] flex shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ${fontFamilyMap[styleConfig.fontFamily]}`}
      style={{ backgroundColor: styleConfig.backgroundColor }}
    >
      <div className="w-1/3 bg-slate-900 text-white p-12 space-y-10">
        {rewrite?.profile_image && (
          <div className="h-40 w-40 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-xl mx-auto">
            <img 
              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${rewrite.profile_image}`} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-800 pb-2">Contact</h4>
          <div className="space-y-4 text-sm text-slate-300">
            {rewrite?.contact_details?.email && <p className="flex items-center gap-3">{rewrite.contact_details.email}</p>}
            {rewrite?.contact_details?.phone && <p className="flex items-center gap-3">{rewrite.contact_details.phone}</p>}
            {rewrite?.contact_details?.location && <p className="flex items-center gap-3">{rewrite.contact_details.location}</p>}
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-800 pb-2">Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {rewrite?.skills?.map((skill: string, i: number) => (
              <span key={i} className="bg-slate-800 text-[10px] font-bold px-3 py-1.5 rounded text-slate-400 uppercase tracking-wider">{skill}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 p-16 space-y-12">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{data?.user?.name}</h2>
          <div className="h-1.5 w-24 rounded-full" style={{ backgroundColor: styleConfig.primaryColor }} />
        </div>
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Professional Summary</h3>
          <p className={`${fontSizeMap[styleConfig.fontSize]} text-slate-600 leading-relaxed`}>{rewrite?.summary}</p>
        </section>
        <section className="space-y-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Experience</h3>
          <div className="space-y-10">
            {rewrite?.experience?.map((exp: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center font-black">
                  <span className="text-xl text-slate-900">{exp.role}</span>
                  <span className="text-xs text-slate-400">{exp.duration}</span>
                </div>
                <div className="text-sm font-bold uppercase tracking-widest" style={{ color: styleConfig.primaryColor }}>{exp.company}</div>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-slate-600 text-sm">
                  {exp.achievements?.map((ach: string, j: number) => <li key={j}>{ach}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderCreativeLayout = (rewrite: any, styleConfig: any) => (
    <div 
      className={`min-h-[1100px] shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 bg-white ${fontFamilyMap[styleConfig.fontFamily]}`}
      style={{ backgroundColor: styleConfig.backgroundColor }}
    >
      <div className="h-48 relative" style={{ backgroundColor: styleConfig.primaryColor }}>
          <div className="absolute -bottom-16 left-16 flex items-end gap-10">
            {rewrite?.profile_image && (
              <div className="h-48 w-48 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                <img 
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${rewrite.profile_image}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="pb-4">
               <h2 className="text-6xl font-black text-slate-900 tracking-tighter">{data?.user?.name}</h2>
               <p className="text-indigo-600 font-black uppercase tracking-[0.4em] text-xs">Portfolio Highlights</p>
            </div>
          </div>
      </div>
      <div className="mt-28 p-16 grid grid-cols-3 gap-16">
          <div className="col-span-2 space-y-12">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: styleConfig.primaryColor }}>The Profile</h3>
              <p className={`${fontSizeMap[styleConfig.fontSize]} text-slate-600 leading-relaxed italic`}>{rewrite?.summary}</p>
            </section>
            <section className="space-y-10">
              <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: styleConfig.primaryColor }}>The Journey</h3>
              <div className="space-y-12">
                {rewrite?.experience?.map((exp: any, i: number) => (
                  <div key={i} className="space-y-2">
                    <h4 className="text-2xl font-black text-slate-900">{exp.role}</h4>
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>{exp.company}</span>
                      <span>{exp.duration}</span>
                    </div>
                    <div className="space-y-3 pt-2">
                      {exp.achievements?.map((ach: string, j: number) => (
                        <p key={j} className="text-sm text-slate-500">• {ach}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="col-span-1 border-l border-slate-100 pl-10 space-y-12">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Connect</h3>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                {rewrite?.contact_details?.email && <p>{rewrite.contact_details.email}</p>}
                {rewrite?.contact_details?.phone && <p>{rewrite.contact_details.phone}</p>}
                {rewrite?.contact_details?.location && <p>{rewrite.contact_details.location}</p>}
              </div>
            </section>
            <section className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Hard Skills</h3>
              <div className="space-y-4">
                {rewrite?.skills?.map((skill: string, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-500">
                       <span>{skill}</span>
                       <span>85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ backgroundColor: styleConfig.primaryColor, width: '85%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Templates
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-3">
            {editMode ? <Edit3 className="h-8 w-8 text-indigo-600" /> : <Eye className="h-8 w-8 text-indigo-600" />}
            {editMode ? 'Design Lab' : 'Premium Preview'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {editMode ? 'Fine-tune every detail of your AI-crafted resume.' : 'See how your optimized resume looks before finalizing.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
           {error && (
             <span className="text-red-500 text-xs font-bold flex items-center gap-1 animate-pulse mr-4">
                <XCircle className="h-4 w-4" />
                {error}
             </span>
           )}
           <button
             onClick={() => setEditMode(!editMode)}
             className={`flex items-center justify-center gap-2 px-6 py-4 ${editMode ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate-700 border border-slate-200'} rounded-2xl font-bold transition-all active:scale-[0.98] shadow-sm hover:shadow-md`}
           >
             {editMode ? <Eye className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
             {editMode ? 'Live Preview' : 'Edit Content'}
           </button>
           <button
             onClick={handleDownload}
             disabled={downloading || editMode}
             className={`flex items-center justify-center gap-2 px-8 py-4 ${downloading || editMode ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20'} rounded-2xl font-black transition-all active:scale-[0.98]`}
           >
             {downloading ? (
               <>
                 <div className="h-5 w-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                 Building PDF...
               </>
             ) : (
               <>
                 <Download className="h-5 w-5" />
                 Export Resume
               </>
             )}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Design Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <ResumeThemeControls config={styleConfig} onChange={updateStyle} />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
              <HistoryIcon className="h-3 w-3" />
              Recent Revisions
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Starting fresh! Save to create versions.</p>
              ) : (
                history.map((version) => (
                  <div key={version.id} className="group/ver p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 transition-all cursor-default">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase">Rev v{version.version_number}</span>
                      <button 
                        onClick={() => handleRestore(version)}
                        className="opacity-0 group-hover/ver:opacity-100 text-indigo-600 hover:text-indigo-800 transition-all"
                        title="Restore this version"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500">{format(new Date(version.created_at), 'MMMM dd, HH:mm')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-3 min-h-[1000px] transition-all duration-500">
          {editMode ? (
            <ResumeEditor 
              id={id as string}
              data={rewrite} 
              onSave={handleSave} 
              isLoading={isSaving} 
            />
          ) : (
             <>
               {template === 'modern-minimalist' && renderModernLayout(rewrite, styleConfig)}
               {template === 'professional-corporate' && renderCorporateLayout(rewrite, styleConfig)}
               {template === 'creative-designer' && renderCreativeLayout(rewrite, styleConfig)}
               {['modern-minimalist', 'professional-corporate', 'creative-designer'].indexOf(template) === -1 && renderModernLayout(rewrite, styleConfig)}
             </>
          )}
        </div>
      </div>
    </div>
  );
}
