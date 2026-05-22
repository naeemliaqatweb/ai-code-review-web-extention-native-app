"use client";

import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { Columns, StretchHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeComparisonProps {
  oldCode: string;
  newCode: string;
  language?: string;
  filename?: string;
}

export function CodeComparison({ oldCode, newCode, language = 'javascript', filename }: CodeComparisonProps) {
  const [isSplitView, setIsSplitView] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const syntaxHighlight = (str: string) => (
    <SyntaxHighlighter
      language={language?.toLowerCase() || 'javascript'}
      style={oneDark}
      codeTagProps={{ style: { background: 'inherit' } }}
      customStyle={{ background: 'transparent', padding: 0 }}
    >
      {str}
    </SyntaxHighlighter>
  );

  // Custom styles to match our theme
  const newStyles = {
    variables: {
      dark: {
        diffViewerBackground: 'transparent',
        diffViewerColor: '#94a3b8', // slate-400
        addedBackground: 'rgba(16, 185, 129, 0.15)', // emerald-500/15
        addedColor: '#34d399', // emerald-400
        removedBackground: 'rgba(239, 68, 68, 0.15)', // red-500/15
        removedColor: '#f87171', // red-400
        wordAddedBackground: 'rgba(16, 185, 129, 0.3)',
        wordRemovedBackground: 'rgba(239, 68, 68, 0.3)',
        addedGutterBackground: 'rgba(16, 185, 129, 0.1)',
        removedGutterBackground: 'rgba(239, 68, 68, 0.1)',
        gutterBackground: 'rgba(15, 23, 42, 0.5)', // slate-900/50
        gutterColor: '#475569', // slate-500
        codeFoldGutterBackground: '#0f172a',
        codeFoldBackground: '#1e293b',
        emptyLineBackground: 'transparent',
        lineNumberColor: '#475569',
      },
      light: {
        diffViewerBackground: 'white',
        diffViewerColor: '#475569', // slate-600
        addedBackground: '#f0fdf4', // emerald-50
        addedColor: '#059669', // emerald-600
        removedBackground: '#fef2f2', // red-50
        removedColor: '#dc2626', // red-600
        gutterBackground: '#f8fafc', // slate-50
        gutterColor: '#94a3b8', // slate-400
      }
    },
    contentText: {
      fontSize: '13px',
      lineHeight: '20px',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    gutter: {
        padding: '0 12px',
        minWidth: '50px',
    }
  };

  return (
    <div className={`flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-all duration-500 ${isExpanded ? 'fixed inset-4 z-[100] m-0' : 'relative'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/50" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {filename || `Compared Code (${language})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl mr-2">
            <button
              onClick={() => setIsSplitView(true)}
              className={`p-1.5 rounded-lg transition-all ${isSplitView ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              title="Side-by-side view"
            >
              <Columns className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsSplitView(false)}
              className={`p-1.5 rounded-lg transition-all ${!isSplitView ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              title="Unified view"
            >
              <StretchHorizontal className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all"
            title={isExpanded ? "Minimize" : "Full Screen"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Diff Viewer Container */}
      <div className={`overflow-auto ${isExpanded ? 'flex-1' : 'max-h-[600px]'} custom-scrollbar`}>
        <ReactDiffViewer
          oldValue={oldCode}
          newValue={newCode}
          splitView={isSplitView}
          useDarkTheme={true}
          styles={newStyles}
          compareMethod={DiffMethod.WORDS}
          hideLineNumbers={false}
          showDiffOnly={false}
          renderContent={syntaxHighlight}
        />
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <div className="flex gap-4">
           <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-red-500/20 border border-red-500/50" /> Original</span>
           <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500/20 border border-emerald-500/50" /> Fixed</span>
        </div>
        <span>Double-click a line to copy</span>
      </div>
    </div>
  );
}
