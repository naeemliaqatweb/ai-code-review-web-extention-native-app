export default function InputBar({ input, setInput }) {
  return (
    <footer className="p-4 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-sm sticky bottom-0">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none min-h-[45px] max-h-[150px]"
          rows={1}
        />
        <button className="absolute right-2 bottom-2 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!input.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
      <p className="text-[10px] text-zinc-500 mt-2 text-center">
        Press Enter to send. Use Shift+Enter for new line.
      </p>
    </footer>
  )
}
