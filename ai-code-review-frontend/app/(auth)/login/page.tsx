"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Code2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ChevronRight,
  Lock,
  Mail
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden font-sans">
      {/* Advanced Neural Grid/Nebula Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
        }} />
      </div>

      <div className="w-full max-w-xl z-10 flex flex-col md:flex-row gap-12 items-center lg:max-w-5xl">
        {/* Side Content: Advanced Level UI Text */}
        <div className="hidden lg:flex flex-1 flex-col space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
           <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="h-14 w-14 flex items-center justify-center rounded-[20px] bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.3)] group-hover:rotate-12 transition-transform">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">ReviewAI</span>
           </Link>
           <h2 className="text-6xl font-black tracking-tight text-white leading-tight">
             Access the <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Elite Command.</span>
           </h2>
           <p className="text-xl text-slate-400 leading-relaxed max-w-md font-medium">
             Enter your credentials to regain access to your advanced AI dashboard and unified engineering insights.
           </p>
           <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300 font-bold bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                 <ShieldCheck className="h-5 w-5 text-indigo-400" />
                 SOC2 Type II Secure Environment
              </div>
              <div className="flex items-center gap-4 text-slate-300 font-bold bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                 <Zap className="h-5 w-5 text-emerald-400" />
                 Millisecond Processing Latency
              </div>
           </div>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="text-center lg:hidden">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-50">
              Welcome Back
            </h2>
          </div>

          <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Lock className="h-32 w-32 text-indigo-500" />
            </div>

            <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5 text-sm font-bold text-red-400 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 rotate-180" />
                    {error}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  Neural Identity (Email)
                </label>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within/field:text-indigo-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-white/10 bg-white/5 pl-14 pr-4 py-5 text-white transition-all focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium"
                    placeholder="name@nexus.io"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1 text-[11px] font-black uppercase tracking-widest">
                  <label htmlFor="password" className="text-slate-500">
                    Access Key (Password)
                  </label>
                  <Link href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                    Recovery?
                  </Link>
                </div>
                <div className="relative group/field">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within/field:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border border-white/10 bg-white/5 pl-14 pr-4 py-5 text-white transition-all focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-4 py-5 text-lg font-black text-white shadow-2xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-3 tracking-tight">
                    Sign In 
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-10 text-center text-sm relative z-10">
              <span className="text-slate-500 font-bold">New to the Ecosystem? </span>
              <Link href="/register" className="font-black text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1 mt-2 group">
                Initialize Account
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] opacity-40">
             End-to-End Encrypted Session
          </p>
        </div>
      </div>
    </div>
  );
}
