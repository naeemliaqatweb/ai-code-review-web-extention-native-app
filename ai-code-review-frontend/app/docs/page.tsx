'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/shared/Navbar';
import {
  Book,
  Server,
  Layout,
  Monitor,
  Terminal,
  Code2,
  FileText,
  History,
  LifeBuoy,
  ChevronRight,
  Copy,
  Check,
  Info,
  AlertCircle,
  Database,
  Lock,
  Cpu,
  Brain,
  LayoutDashboard,
  Zap
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const sections = [
  { id: 'overview', title: 'Overview', icon: <Book className="w-5 h-5" /> },
  { id: 'setup-backend', title: 'Backend Setup', icon: <Server className="w-5 h-5" /> },
  { id: 'setup-frontend', title: 'Frontend Setup', icon: <Layout className="w-5 h-5" /> },
  { id: 'api-reference', title: 'API Reference', icon: <Code2 className="w-5 h-5" /> },
  { id: 'features', title: 'Features Deep Dive', icon: <Cpu className="w-5 h-5" /> },
  { id: 'extension', title: 'Chrome Extension', icon: <Monitor className="w-5 h-5" /> },
  { id: 'troubleshooting', title: 'Troubleshooting', icon: <LifeBuoy className="w-5 h-5" /> },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative overflow-x-hidden">
      {/* Neural Mesh Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[120px] dark:bg-indigo-600/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px] dark:bg-emerald-600/5" />
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-1">
              <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Developer Documentation
              </h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${activeSection === section.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 lg:p-16">

              {activeSection === 'overview' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                      Platform Overview
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                      ReviewAI is an elite hub for technical excellence. Our ecosystem unifies code analysis, linguistic optimization, and career impact through advanced AI model orchestration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="p-8 bg-indigo-50 dark:bg-indigo-600/5 rounded-3xl border border-indigo-100 dark:border-indigo-600/20">
                      <Zap className="w-10 h-10 text-indigo-600 mb-6" />
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">Unified Analytics</h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-3 font-medium">A 360-degree command center aggregating insights from Code, Text, and Resume modules into actionable intelligence.</p>
                    </div>
                    <div className="p-8 bg-emerald-50 dark:bg-emerald-600/5 rounded-3xl border border-emerald-100 dark:border-emerald-600/20">
                      <Brain className="w-10 h-10 text-emerald-600 mb-6" />
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">Gemini Pro Engine</h3>
                      <p className="text-slate-600 dark:text-slate-400 mt-3 font-medium">Multi-modal AI that understands complex architectural patterns, nuances in professional writing, and career impact metrics.</p>
                    </div>
                  </div>

                  <div className="mt-16 space-y-6">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                       <LayoutDashboard className="h-8 w-8 text-indigo-500" />
                       Command Center
                    </h2>
                    <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative group">
                       <Image 
                          src="/docs/dashboard-preview.png" 
                          alt="Unified Dashboard" 
                          width={1920} 
                          height={1080} 
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-500 font-bold italic text-center">
                       Real-time aggregation of multi-module engineering activity.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 'setup-backend' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Backend Configuration</h1>

                  <section className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3">
                      <Terminal className="w-8 h-8 text-indigo-500" /> System Prerequisites
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {['PHP 8.2+', 'Composer', 'MySQL 8', 'Redis'].map(req => (
                         <div key={req} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center font-bold text-slate-700 dark:text-slate-300">
                           {req}
                         </div>
                       ))}
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Installation Sequence</h2>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <p className="text-lg font-black text-indigo-500">01. Dependencies</p>
                        <div className="relative group">
                          <SyntaxHighlighter language="bash" style={atomDark} className="rounded-3xl !p-8 shadow-xl">
                            composer install
                          </SyntaxHighlighter>
                          <button onClick={() => copyToClipboard('composer install', 'c-inst')} className="absolute top-6 right-6 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity transition-colors">
                            {copied === 'c-inst' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-lg font-black text-indigo-500">02. Environment Initialization</p>
                        <SyntaxHighlighter language="bash" style={atomDark} className="rounded-3xl !p-8 shadow-xl">
                          cp .env.example .env{"\n"}
                          php artisan key:generate
                        </SyntaxHighlighter>
                      </div>

                      <div className="space-y-3">
                        <p className="text-lg font-black text-indigo-500">03. Deployment</p>
                        <SyntaxHighlighter language="bash" style={atomDark} className="rounded-3xl !p-8 shadow-xl">
                          php artisan migrate --seed{"\n"}
                          php artisan serve
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeSection === 'setup-frontend' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Frontend Deployment</h1>
                  <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                    The frontend is a specialized Next.js engine architected with TypeScript and Tailwind for ultimate performance.
                  </p>

                  <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative mb-12">
                    <Image src="/docs/home-hero.png" alt="Home Page" width={1920} height={1080} className="w-full h-auto" />
                  </div>

                  <section className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Development Environment</h2>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-slate-600 dark:text-slate-400 font-bold">1. Install Node ecosystem packages</p>
                        <SyntaxHighlighter language="bash" style={atomDark} className="rounded-3xl !p-8">
                          npm install
                        </SyntaxHighlighter>
                      </div>
                      <div className="space-y-3">
                        <p className="text-slate-600 dark:text-slate-400 font-bold">2. Define API endpoint architecture</p>
                        <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 font-mono text-indigo-400">
                          NEXT_PUBLIC_API_URL=http://localhost:8000/api
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-slate-600 dark:text-slate-400 font-bold">3. Launch development node</p>
                        <SyntaxHighlighter language="bash" style={atomDark} className="rounded-3xl !p-8">
                          npm run dev
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeSection === 'api-reference' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">API Architecture</h1>

                  <div className="space-y-16">
                    {/* Auth */}
                    <div className="space-y-6">
                      <h2 className="text-3xl font-black text-indigo-500 flex items-center gap-3">
                        <Lock className="w-8 h-8" /> Neural Identity
                      </h2>
                      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Endpoint</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Context</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/10">
                            {[
                               { m: 'POST', e: '/register', d: 'User registration' },
                               { m: 'POST', e: '/login', d: 'Token generation' },
                               { m: 'GET', e: '/user', d: 'Identity verification' }
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-8 py-6"><span className="text-indigo-500 font-black text-xs px-3 py-1 bg-indigo-500/10 rounded-full">{row.m}</span></td>
                                <td className="px-8 py-6 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{row.e}</td>
                                <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400 font-medium">{row.d}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Integrated Modules */}
                    <div className="space-y-6">
                      <h2 className="text-3xl font-black text-emerald-500 flex items-center gap-3">
                        <Database className="w-8 h-8" /> Module Intelligence
                      </h2>
                      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                          <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Endpoint</th>
                              <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/10">
                            {[
                               { m: 'GET', e: '/submissions', d: 'Retrieve code audit history' },
                               { m: 'GET', e: '/text-submissions', d: 'Retrieve text assistant logs' },
                               { m: 'GET', e: '/resumes', d: 'Retrieve Resume optimization history' },
                               { m: 'POST', e: '/analyze-code', d: 'Trigger multi-modal code review' }
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-8 py-6"><span className="text-emerald-500 font-black text-xs px-3 py-1 bg-emerald-500/10 rounded-full">{row.m}</span></td>
                                <td className="px-8 py-6 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{row.e}</td>
                                <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400 font-medium">{row.d}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'features' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Core Excellence Hubs</h1>

                  <div className="space-y-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-600/20">
                          <Code2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">AI Code Review</h3>
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          Senior-level diagnostics for any codebase. Our model identifies architectural leaks, performance bottlenecks, and security gaps with instant refactoring patches.
                        </p>
                      </div>
                      <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                         <div className="p-4 bg-slate-100 dark:bg-slate-800 flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-400" />
                           <div className="w-3 h-3 rounded-full bg-amber-400" />
                           <div className="w-3 h-3 rounded-full bg-emerald-400" />
                         </div>
                         <Image src="/docs/home-hero.png" alt="Code Review" width={1024} height={1024} className="w-full transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 order-2 md:order-1 relative">
                        <Image src="/docs/resume-preview.png" alt="Resume Builder" width={1024} height={1024} className="w-full" />
                        <div className="absolute inset-0 bg-amber-500/5 backdrop-blur-[2px]" />
                      </div>
                      <div className="space-y-6 order-1 md:order-2">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-600/10 rounded-3xl flex items-center justify-center text-amber-600 shadow-lg shadow-amber-600/20">
                          <History className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">AI Resume Builder</h3>
                        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          Impact-optimized career assets. Leverage custom templates and AI impact scoring to ensure your experience resonates with top-tier engineering filters.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'extension' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Chrome Extension</h1>

                  <div className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-[2rem] border border-amber-200 dark:border-amber-800 flex gap-6">
                    <Info className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-lg font-black text-amber-900 dark:text-amber-400">Developer Preview</p>
                      <p className="text-amber-800 dark:text-amber-500/80 font-medium">
                        To install the extension, you must enable "Developer Mode" in Chrome Extensions settings.
                      </p>
                    </div>
                  </div>

                  <section className="space-y-8 pt-6">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Installation Sequence</h2>
                    <ul className="space-y-6">
                      {[
                        { t: 'Chrome Center', d: 'Navigate to chrome://extensions/' },
                        { t: 'Dev Mode', d: 'Activate "Developer Mode" on the top right.' },
                        { t: 'Direct Load', d: 'Click "Load unpacked" and select the extension/dist directory.' }
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-5">
                           <span className="h-8 w-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-sm shrink-0">{i+1}</span>
                           <div>
                              <p className="font-black text-slate-900 dark:text-white">{step.t}</p>
                              <p className="text-slate-500 font-medium">{step.d}</p>
                           </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}

              {activeSection === 'troubleshooting' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Diagnostics</h1>

                  <div className="space-y-8">
                    <div className="p-10 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 group">
                      <h3 className="text-2xl font-black text-red-900 dark:text-red-400 flex items-center gap-3">
                        <AlertCircle className="w-8 h-8 transition-transform group-hover:rotate-12" /> Neural Link Failure
                      </h3>
                      <p className="text-lg text-red-800 dark:text-red-500/80 mt-4 leading-relaxed font-medium">
                        Verify that your Laravel server is active on <code className="px-2 py-0.5 bg-red-100 dark:bg-red-950 rounded text-red-600">http://localhost:8000</code> and the environmental proxy points to the authoritative API gateway.
                      </p>
                    </div>

                    <div className="p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">CSRF Synchronization</h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                        Ensure unified state management for Sanctum sessions. If identity verification fails during transition, clear session storage and re-initialize authentication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
