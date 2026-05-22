"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Code2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_ITEMS } from '@/config/navigation';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter items for the landing page navbar
  const landingNavItems = NAV_ITEMS.filter(item => !item.authRequired || (item.authRequired && user));

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">ReviewAI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {landingNavItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`text-sm font-medium transition-colors ${
                pathname === item.href ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <Link 
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
              >
                Dashboard
              </Link>
              <button 
                onClick={logout}
                className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white px-4">Sign In</Link>
              <Link 
                href="/register"
                className="px-6 py-2.5 rounded-full bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/5 p-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {landingNavItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-medium text-slate-300 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/5">
            {user ? (
              <button 
                onClick={logout}
                className="w-full text-left text-lg font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-4">
                <Link href="/login" className="block text-lg font-medium text-slate-300 hover:text-white">Sign In</Link>
                <Link href="/register" className="block text-lg font-medium text-indigo-400 hover:text-indigo-300">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
