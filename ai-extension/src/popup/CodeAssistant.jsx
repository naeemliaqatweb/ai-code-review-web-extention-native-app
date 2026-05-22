import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

export default function CodeAssistant({ initialData, onRefreshStats, usageCount = 0 }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    language: initialData?.language || 'Javascript',
    mode: initialData?.mode || 'review'
  })
  const [submission, setSubmission] = useState(initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const pollingRef = useRef(null)

  const isLimitReached = usageCount >= 20;

  const handleCopy = () => {
    const textToCopy = analysis?.fixed_code || analysis?.fixed_explanation || ''
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  useEffect(() => {
    if (initialData) {
      setSubmission(initialData)
      setFormData({
        title: initialData.title,
        content: initialData.content,
        language: initialData.language || 'Javascript',
        mode: initialData.mode
      })
    }
  }, [initialData])

  const modes = [
    { id: 'review', label: 'Review', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
    )},
    { id: 'fix', label: 'Fix', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
    )},
    { id: 'explain', label: 'Explain', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    )},
  ]

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const startPolling = (id) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    
    pollingRef.current = setInterval(async () => {
      try {
        const submissionData = await api.getCodeSubmission(id)
        if (submissionData.status === 'completed' || submissionData.status === 'failed') {
          setSubmission(submissionData)
          setLoading(false)
          clearInterval(pollingRef.current)
          pollingRef.current = null
          if (onRefreshStats) onRefreshStats()
        } else {
          setSubmission(submissionData)
        }
      } catch (err) {
        console.error('Polling error:', err)
        clearInterval(pollingRef.current)
      }
    }, 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSubmission(null)

    try {
      const resp = await api.createCodeSubmission(
        formData.title || `Code Review - ${new Date().toLocaleTimeString()}`,
        formData.content,
        formData.language,
        formData.mode
      )
      setSubmission(resp)
      startPolling(resp.id)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const analysis = submission?.analysis

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-sans h-full">
      {!submission && !loading ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFormData({ ...formData, mode: mode.id })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  formData.mode === mode.id
                    ? 'bg-zinc-800 text-indigo-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Source Language</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
              {['Javascript', 'Python', 'PHP', 'Java', 'C++', 'C#', 'Ruby', 'Rust', 'Swift', 'Go', 'SQL', 'HTML', 'CSS'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setFormData({ ...formData, language: lang })}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                    formData.language === lang
                      ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <textarea
              required
              placeholder="Paste your code here..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[300px] resize-none transition-all placeholder:font-sans"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={!formData.content.trim() || isLimitReached}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
            {isLimitReached ? 'Daily Limit Reached' : 'Review My Code'}
          </button>

          {isLimitReached && (
            <p className="text-[10px] text-rose-400 text-center font-bold animate-pulse">
              You have reached your free limit of 20 Code Audits.
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-4 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase text-zinc-300 tracking-widest">{formData.mode} Module</span>
            </div>
            <button 
              onClick={() => { setSubmission(null); setFormData({ ...formData, content: '' }) }}
              className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase"
            >
              Reset
            </button>
          </div>

          {loading && submission?.status === 'pending' ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Analyzing Codebase</p>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">Building dependency tree & checking logic...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Score & Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Health Score</span>
                  <span className={`text-3xl font-black ${
                    (analysis?.score || 0) > 7 ? 'text-emerald-500' : (analysis?.score || 0) > 4 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {analysis?.score || '0'}/10
                  </span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Security</span>
                    <span className="text-[10px] font-black text-rose-500">{analysis?.security_issues?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Bugs</span>
                    <span className="text-[10px] font-black text-amber-500">{analysis?.bugs?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Sections */}
              {analysis?.bugs?.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3">Critical Bugs</h4>
                  <ul className="space-y-2">
                    {analysis.bugs.map((bug, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex gap-2">
                        <span className="text-rose-500">•</span>
                        {bug}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis?.security_issues?.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-3">Security Risks</h4>
                  <ul className="space-y-2">
                    {analysis.security_issues.map((issue, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex gap-2">
                        <span className="text-orange-500">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fixed Code / Explanation */}
              {(analysis?.fixed_code || analysis?.fixed_explanation) && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="bg-zinc-800/50 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">
                      {formData.mode === 'explain' ? 'Logic Breakdown' : 'Optimized Version'}
                    </span>
                    {analysis?.fixed_code && (
                      <button 
                        onClick={handleCopy}
                        className={`text-[9px] font-bold uppercase transition-all ${
                          copied ? 'text-emerald-400' : 'text-indigo-400 hover:text-indigo-300'
                        }`}
                      >
                        {copied ? 'Copied!' : 'Copy Code'}
                      </button>
                    )}
                  </div>
                  <div className="p-4 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre overflow-x-auto select-text">
                    {formData.mode === 'explain' ? (analysis?.fixed_explanation || 'No explanation generated.') : (analysis?.fixed_code || analysis?.fixed_explanation || 'Analysis complete. See bug reports above for details.')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
          {error}
        </div>
      )}
    </div>
  )
}
