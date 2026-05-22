import CreditBadge from './CreditBadge';

export default function Header({ user, onLogout, moduleUsage = { text: 0, code: 0, resume: 0 }, activeTab }) {
  // Determine which usage to show based on the active module
  const { currentUsage, totalLimit } = (() => {
    switch (activeTab) {
      case 'text': return { currentUsage: moduleUsage.text, totalLimit: 20 };
      case 'code': return { currentUsage: moduleUsage.code, totalLimit: 20 };
      case 'resume': return { currentUsage: moduleUsage.resume, totalLimit: 20 };
      default: return { 
        currentUsage: (moduleUsage.text + moduleUsage.code + moduleUsage.resume), 
        totalLimit: 60 
      };
    }
  })();

  return (
    <header className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-lg leading-none">A</span>
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-white leading-tight">AI Assistant</h1>
          <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[100px]">
            {user?.name || user?.email}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <CreditBadge used={currentUsage} total={totalLimit} />
        <button 
          onClick={onLogout}
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          title="Sign Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </header>
  )
}
