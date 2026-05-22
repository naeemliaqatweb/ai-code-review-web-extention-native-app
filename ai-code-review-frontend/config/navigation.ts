import { 
  Home, 
  LayoutDashboard, 
  Code2, 
  ShieldAlert, 
  MessageSquareText, 
  History, 
  Settings,
  FileText
} from 'lucide-react';

export const NAV_ITEMS = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home, 
    authRequired: false 
  },
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    authRequired: true 
  },
  { 
    name: 'AI Code Review', 
    href: '/dashboard/submissions', 
    icon: ShieldAlert, 
    authRequired: true 
  },
  { 
    name: 'AI Text Assistant', 
    href: '/dashboard/text-assistant', 
    icon: MessageSquareText, 
    authRequired: true 
  },
  { 
    name: 'AI Resume Builder', 
    href: '/dashboard/resume-builder', 
    icon: FileText, 
    authRequired: true 
  },
];

export const FOOTER_ITEMS = [
  { name: 'Settings', href: '/settings', icon: Settings },
];
