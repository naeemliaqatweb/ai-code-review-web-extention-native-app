"use client";

import React from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Maximize2, 
  Minimize2,
  Check,
  Plus
} from 'lucide-react';

interface StyleConfig {
  primaryColor: string;
  backgroundColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'sans' | 'serif' | 'mono';
  layout: 'modern' | 'classic' | 'sidebar';
}

interface ResumeThemeControlsProps {
  config: StyleConfig;
  onChange: (newConfig: StyleConfig) => void;
}

const COLORS = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Slate', hex: '#475569' },
  { name: 'Violet', hex: '#7c3aed' },
];

const BG_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Soft Gray', hex: '#f8fafc' },
  { name: 'Cream', hex: '#fffbeb' },
  { name: 'Ice', hex: '#f0f9ff' },
];

export default function ResumeThemeControls({ config, onChange }: ResumeThemeControlsProps) {
  const updateConfig = (key: keyof StyleConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Palette className="h-3 w-3" />
          Accent Color
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => updateConfig('primaryColor', color.hex)}
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 relative"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {config.primaryColor === color.hex && (
                <Check className="h-4 w-4 text-white drop-shadow-md" />
              )}
            </button>
          ))}
          <div className="relative group col-span-1">
            <button
              onClick={() => document.getElementById('customColorPicker')?.click()}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ${
                !COLORS.some(c => c.hex === config.primaryColor) ? 'ring-2 ring-indigo-500 border-solid' : ''
              }`}
              style={{ backgroundColor: !COLORS.some(c => c.hex === config.primaryColor) ? config.primaryColor : undefined }}
              title="Custom Color"
            >
              <Plus className="h-4 w-4 text-slate-400" />
            </button>
            <input 
              id="customColorPicker"
              type="color"
              value={config.primaryColor}
              onChange={(e) => updateConfig('primaryColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-0 h-0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Layout className="h-3 w-3" />
          Paper Color
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.hex}
              onClick={() => updateConfig('backgroundColor', bg.hex)}
              className={`h-10 w-full rounded-xl flex items-center justify-center transition-all border-2 ${
                config.backgroundColor === bg.hex ? 'border-indigo-600 scale-105' : 'border-slate-100 hover:border-slate-200 shadow-sm'
              }`}
              style={{ backgroundColor: bg.hex }}
            >
              {config.backgroundColor === bg.hex && <Check className="h-4 w-4 text-indigo-600" />}
            </button>
          ))}
          <div className="relative group col-span-1">
            <button
              onClick={() => document.getElementById('customBgPicker')?.click()}
              className={`h-10 w-full rounded-xl flex items-center justify-center transition-all border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 ${
                !BG_COLORS.some(c => c.hex === config.backgroundColor) ? 'border-indigo-600 border-solid scale-105' : ''
              }`}
              style={{ backgroundColor: !BG_COLORS.some(c => c.hex === config.backgroundColor) ? config.backgroundColor : undefined }}
              title="Custom Paper Color"
            >
              <Plus className="h-4 w-4 text-slate-400" />
            </button>
            <input 
              id="customBgPicker"
              type="color"
              value={config.backgroundColor}
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-0 h-0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Type className="h-3 w-3" />
          Typography
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['sans', 'serif', 'mono'] as const).map((font) => (
            <button
              key={font}
              onClick={() => updateConfig('fontFamily', font)}
              className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                config.fontFamily === font 
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' 
                  : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
              }`}
            >
              <span className={`text-lg font-bold ${
                font === 'sans' ? 'font-sans' : font === 'serif' ? 'font-serif' : 'font-mono'
              }`}>Aa</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">{font}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Type className="h-3 w-3" />
          Text Size
        </h3>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateConfig('fontSize', size)}
              className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg capitalize transition-all ${
                config.fontSize === size 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {size === 'small' && <Minimize2 className="h-4 w-4" />}
              {size === 'medium' && <Type className="h-4 w-4" />}
              {size === 'large' && <Maximize2 className="h-4 w-4" />}
              <span className="text-[10px] font-bold mt-1">{size}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
        <p className="text-[10px] font-bold text-indigo-600/70 leading-relaxed uppercase tracking-wider">
          💡 These styles are applied in real-time to both your preview and the final PDF download.
        </p>
      </div>
    </div>
  );
}
