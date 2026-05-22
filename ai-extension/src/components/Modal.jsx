import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, confirmText = 'Confirm', onConfirm, variant = 'indigo' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const variantStyles = {
    indigo: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20',
    red: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[300px] bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            variant === 'red' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'
          }`}>
             {variant === 'red' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             )}
          </div>
          <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
          <div className="text-[11px] text-zinc-400 leading-relaxed mb-6">
            {children}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all bg-zinc-800 text-zinc-400 hover:bg-zinc-700 active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase text-white transition-all active:scale-95 shadow-lg ${variantStyles[variant]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
