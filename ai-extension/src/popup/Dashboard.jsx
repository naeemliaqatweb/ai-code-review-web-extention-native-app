import { useState, useEffect } from 'react'
import { api } from '../services/api'
import Modal from '../components/Modal'

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ text: 0, code: 0, resume: 0 })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [textData, codeData, resumeData] = await Promise.all([
        api.listTextSubmissions(),
        api.listCodeSubmissions(),
        api.listResumes()
      ])

      const allHistory = [
        ...textData.map(i => ({ ...i, type: 'text', icon: 'T' })),
        ...codeData.map(i => ({ ...i, type: 'code', icon: '</>' })),
        ...resumeData.map(i => ({ ...i, type: 'resume', icon: 'R' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setHistory(allHistory.slice(0, 5))
      setStats({
        text: textData.length,
        code: codeData.length,
        resume: resumeData.length
      })
    } catch (err) {
      console.error('Dashboard sync failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      if (itemToDelete.type === 'code') {
        await api.deleteCodeSubmission(itemToDelete.id)
      } else if (itemToDelete.type === 'text') {
        await api.deleteTextSubmission(itemToDelete.id)
      } else if (itemToDelete.type === 'resume') {
        await api.deleteResume(itemToDelete.id)
      }
      fetchDashboardData()
    } catch (err) {
      console.error('Failed to delete history item:', err)
    } finally {
      setItemToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-pulse">
        <div className="w-12 h-12 bg-zinc-900 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-zinc-900 rounded mb-2"></div>
        <div className="h-2 w-24 bg-zinc-900 rounded"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 font-sans">
      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Text</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{stats.text}</span>
            <span className="text-[8px] text-zinc-600 font-bold">/ 20</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${(stats.text / 20) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Code</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{stats.code}</span>
            <span className="text-[8px] text-zinc-600 font-bold">/ 20</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${(stats.code / 20) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-sm">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Resume</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{stats.resume}</span>
            <span className="text-[8px] text-zinc-600 font-bold">/ 20</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${(stats.resume / 20) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Recent Activity</h3>
          <span className="text-[10px] font-medium text-zinc-600 italic">Latest history</span>
        </div>

        {history.length === 0 ? (
          <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-8 text-center">
            <p className="text-xs text-zinc-600 font-medium">No activity yet. Start your first AI analysis!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl p-3 flex items-center gap-3 group relative cursor-pointer"
                onClick={() => onNavigate(item.type, item)}
              >
                <div className={`p-2 rounded-lg ${
                  item.type === 'text' ? 'bg-emerald-500/10 text-emerald-500' : 
                  item.type === 'code' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {item.type === 'text' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  )}
                  {item.type === 'code' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  )}
                  {item.type === 'resume' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-zinc-200 truncate pr-2">{item.title}</h4>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase whitespace-nowrap group-hover:hidden">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setItemToDelete(item); }}
                      className="hidden group-hover:flex items-center justify-center p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      title="Delete Activity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-black uppercase px-1 rounded-sm ${
                      item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{item.mode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Prompt */}
      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex flex-col items-center text-center mt-auto">
        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Boost Your Productivity</h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[200px]">
          Upgrade to Premium for unlimited audits and advanced resume builder features.
        </p>
      </div>

      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Activity?"
        confirmText="Delete Permanently"
        variant="red"
      >
        This will permanently remove your <span className="text-white font-bold">{itemToDelete?.title || 'analysis'}</span> and cannot be undone. You will also get your credit back.
      </Modal>
    </div>
  )
}
