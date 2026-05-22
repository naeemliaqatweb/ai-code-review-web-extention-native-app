"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Code2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  MessageSquareText, 
  FileText, 
  Cpu,
  ChevronRight,
  Brain,
  LayoutDashboard
} from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Senior AI Review",
      description: "Deep-dive diagnostics for bugs, performance leaks, and security vulnerabilities.",
      icon: <ShieldCheck className="h-6 w-6" />,
      tag: "Code"
    },
    {
      title: "Grammar & Style",
      description: "Level up your documentation and READMEs with professional linguistic analysis.",
      icon: <MessageSquareText className="h-6 w-6" />,
      tag: "Text"
    },
    {
      title: "Impact Score AI",
      description: "Analyze your resume's effectiveness and get quantifiable metrics for success.",
      icon: <Brain className="h-6 w-6" />,
      tag: "Resume"
    },
    {
      title: "Unified Analytics",
      description: "Track your progress across all modules with our integrated dashboard.",
      icon: <LayoutDashboard className="h-6 w-6" />,
      tag: "Stats"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 font-sans relative overflow-x-hidden">
      {/* Advanced Neural Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse duration-[8s]" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-600/5 blur-[100px] animate-pulse duration-[12s]" />
      </div>

      <Navbar />

      <header className="relative pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="h-4 w-4" />
            The Elite Engineering Suite
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 animate-gradient-x bg-[length:200%_auto] italic">Engineering.</span>
          </h1>

          <p className="max-w-3xl text-xl md:text-2xl text-slate-400 mb-14 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 leading-relaxed font-medium">
            ReviewAI is a high-bandwidth senior partner that suggests, refactors, and explains—transforming your entire workflow from code to career.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              href={user ? "/dashboard" : "/register"}
              className="px-12 py-6 rounded-3xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 group"
            >
              Get Started Free
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/docs"
              className="px-12 py-6 rounded-3xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-4"
            >
              <Terminal className="h-6 w-6" />
              Explore API
            </Link>
          </div>

          {/* Hero Asset: Unified Dashboard Preview */}
          <div className="mt-32 relative w-full max-w-6xl animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10 h-full" />
            <div className="rounded-[40px] border border-white/10 bg-slate-900/40 p-3 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative group backdrop-blur-3xl">
              <Image 
                 src="/docs/dashboard-preview.png" 
                 alt="ReviewAI Dashboard" 
                 width={1920} 
                 height={1080} 
                 className="rounded-[32px] opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 space-y-4 text-center">
            <h2 className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em]">Elite Ecosystem</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter">Powered by intelligence.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-10 rounded-[40px] bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-indigo-500/[0.03] relative overflow-hidden">
                <div className="mb-8 h-14 w-14 rounded-2xl flex items-center justify-center bg-slate-900 border border-white/10 text-white shadow-xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">{feature.tag} Module</div>
                <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
                <p className="text-slate-400 text-base leading-relaxed mb-8 font-medium">
                  {feature.description}
                </p>
                <Link href="/dashboard" className="flex items-center gap-2 text-xs font-black text-indigo-400 opacity-60 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-2">
                  Launch Assistant
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Resume Builder Spotlight */}
      <section className="py-40 px-6 bg-slate-900/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 space-y-10">
            <div className="h-16 w-16 rounded-3xl bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <FileText className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Career <br />
              <span className="text-amber-500 opacity-80">Optimized.</span>
            </h2>
            <p className="text-2xl text-slate-400 leading-relaxed max-w-xl font-medium">
              Your resume isn't just a document—it's your most important codebase. Let AI optimize your impact, scores, and professional presentation.
            </p>
            <ul className="space-y-6">
              {[
                "AI Impact Scoring (70+ Target)",
                "Bullet point refactoring for impact",
                "Corporate & Creative Templates",
                "One-click professional PDF export"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-slate-200 text-lg font-bold">
                  <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link 
              href="/dashboard/resume-builder"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl bg-amber-500 text-black font-black text-lg hover:bg-amber-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/10"
            >
              Build Your Resume
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="rounded-[40px] border border-amber-500/20 bg-slate-950 p-4 shadow-2xl relative group overflow-hidden">
               <Image 
                 src="/docs/resume-preview.png" 
                 alt="AI Resume Builder Preview" 
                 width={1024} 
                 height={1024} 
                 className="rounded-[32px] opacity-90 group-hover:opacity-100 transition-opacity"
               />
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1 space-y-10 lg:order-2">
            <div className="h-16 w-16 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <MessageSquareText className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Every Word <br />
              <span className="text-emerald-500 opacity-80">Calculated.</span>
            </h2>
            <p className="text-2xl text-slate-400 leading-relaxed max-w-xl font-medium">
              Professionalism isn't just about code. Level up your documentation, logs, and communication with our linguistic AI.
            </p>
            <div className="space-y-4 pt-4">
               <div className="flex items-center gap-4 text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-bold">Linguistic error diagnostics</span>
               </div>
               <div className="flex items-center gap-4 text-slate-400">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span className="font-bold">Automated README generation</span>
               </div>
            </div>
          </div>
          <div className="flex-1 w-full lg:order-1">
            <div className="rounded-[40px] border border-white/10 bg-slate-950 p-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-150 transition-transform duration-[10s]">
                  <MessageSquareText className="h-64 w-64 text-emerald-500" />
               </div>
               <div className="space-y-8 relative z-10">
                 <div className="space-y-3">
                   <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Input Stream</div>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-base italic text-slate-400 font-medium">
                     "I has a project, its very better and i want to show you."
                   </div>
                 </div>
                 <div className="flex justify-center">
                    <Zap className="h-8 w-8 text-emerald-500 animate-bounce" />
                 </div>
                 <div className="space-y-3">
                   <div className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3">
                     <Sparkles className="h-4 w-4" />
                     Optimized Output
                    </div>
                   <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-base font-black text-white">
                     "I have a project that has improved significantly, and I would like to showcase it to you."
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-60 px-6 text-center overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/10 blur-[180px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-7xl md:text-9xl font-black tracking-tight mb-12">
            Push the <br /><span className="italic">Limit.</span>
          </h2>
          <p className="text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
            Join 20,000+ engineers who treat quality as their first principle. Experience the future of dev tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link 
              href="/register"
              className="px-16 py-6 rounded-3xl bg-white text-slate-950 font-black text-xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Join the Elite
            </Link>
            <Link 
              href="/dashboard"
              className="px-16 py-6 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black text-xl hover:bg-indigo-500/30 transition-all active:scale-95"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-16">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/20">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">ReviewAI</span>
            </Link>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xs font-medium">
              Scaling code quality with artificial intelligence. Built for modern engineering teams.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Modules</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-500">
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Code Review</Link></li>
              <li><Link href="/dashboard/text-assistant" className="hover:text-indigo-400 transition-colors">Text Assistant</Link></li>
              <li><Link href="/dashboard/resume-builder" className="hover:text-indigo-400 transition-colors">Resume Builder</Link></li>
              <li><Link href="/docs" className="hover:text-indigo-400 transition-colors">Enterprise API</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Trust</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-500">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Shield</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">SOC2 Details</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Terms of High Use</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Sync</h4>
            <p className="text-sm font-bold text-slate-500">
              &copy; {new Date().getFullYear()} ReviewAI <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
