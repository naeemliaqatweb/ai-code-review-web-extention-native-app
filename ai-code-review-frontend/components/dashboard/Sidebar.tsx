"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut,
  ChevronRight,
  Code2
} from 'lucide-react';
import { NAV_ITEMS, FOOTER_ITEMS } from '@/config/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Filter items for the dashboard sidebar (ones that require auth)
  const dashboardNavItems = NAV_ITEMS.filter(item => item.authRequired);

  const isItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-72 flex-col bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300">
      <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500/50 group-hover:rotate-6 transition-transform">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">ReviewAI</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {dashboardNavItems.map((item) => {
          const isActive = isItemActive(item.href);
          const isTextAssistant = item.href.includes('text-assistant');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? isTextAssistant 
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? (isTextAssistant ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400') : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* Footer Items (Settings, etc) */}
        {FOOTER_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}

        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 my-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-900 flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
              {user?.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email}
            </span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 dark:text-red-400 dark:hover:bg-red-400/10"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
