export default function ChatArea() {
  return (
    <main className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm">
        <p className="text-zinc-300 text-sm leading-relaxed">
          Hello! I'm your AI Assistant. How can I help you today?
        </p>
      </div>
      
      {/* Placeholder for results */}
      <div className="flex-1 flex items-center justify-center opacity-20 select-none">
        <div className="text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4L8 8"/><path d="M12 16v4l4-4"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <p className="text-xs uppercase tracking-widest font-medium">Waiting for Input</p>
        </div>
      </div>
    </main>
  )
}
