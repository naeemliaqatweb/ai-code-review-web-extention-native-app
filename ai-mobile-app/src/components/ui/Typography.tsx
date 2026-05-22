import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label' | 'muted';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  className = '', 
  children,
  ...props 
}) => {
  const variants = {
  h1: "text-4xl font-extrabold text-[#0F172A] tracking-tighter leading-tight",
  h2: "text-2xl font-bold text-[#1E293B] tracking-tight leading-snug",
  h3: "text-lg font-bold text-[#334155] tracking-tight",
  h4: "text-base font-bold text-[#475569] tracking-tight",
  body: "text-base font-normal leading-relaxed text-[#64748B]",
  caption: "text-[12px] font-medium tracking-wide text-slate-400",
  label: "text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500",
  muted: "text-sm font-normal text-slate-400 leading-relaxed",
};

  return (
    <Text 
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Text>
  );
};
