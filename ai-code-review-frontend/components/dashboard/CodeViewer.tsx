"use client";

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeViewerProps {
  code: string;
  language?: string;
  showCopy?: boolean;
}

export function CodeViewer({ code, language = 'javascript', showCopy = true }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#282c34] shadow-xl">
      {/* Header with dots */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/20 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/50" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{language}</span>
      </div>

      {/* Code Area */}
      <div className="p-6 overflow-auto max-h-[600px] custom-scrollbar">
        <SyntaxHighlighter
          language={language?.toLowerCase() || 'javascript'}
          style={oneDark}
          customStyle={{ 
            background: 'transparent', 
            padding: 0,
            fontSize: '13px',
            lineHeight: '20px',
            margin: 0
          }}
          codeTagProps={{
            style: { background: 'inherit' }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Copy Button */}
      {showCopy && (
        <button
          onClick={handleCopy}
          className="absolute top-12 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
