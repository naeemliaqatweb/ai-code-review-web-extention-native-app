import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

export default function TextAssistant({ initialData, onRefreshStats, usageCount = 0 }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    mode: initialData?.mode || 'grammar'
  })
  const [submission, setSubmission] = useState(initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const pollingRef = useRef(null)
  const pollingCountRef = useRef(0)

  const isLimitReached = usageCount >= 20;

  const handleCopy = () => {
    const textToCopy = submission?.analysis?.processed_text || submission?.analysis?.content || ''
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
        mode: initialData.mode
      })
    }
  }, [initialData])

  const modes = [
    { id: 'grammar', label: 'Grammar', color: 'bg-emerald-500' },
    { id: 'rewrite', label: 'Rewrite', color: 'bg-indigo-500' },
    { id: 'summarize', label: 'Summarize', color: 'bg-amber-500' },
    { id: 'improve', label: 'Improve', color: 'bg-rose-500' },
  ]

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const startPolling = (id) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingCountRef.current = 0
    
    pollingRef.current = setInterval(async () => {
      pollingCountRef.current += 1
      
      // Stop polling after 2 minutes (60 attempts * 2s)
      if (pollingCountRef.current > 60) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
        setLoading(false)
        setError("Analysis is taking longer than expected. Please check the dashboard later.")
        return
      }

      try {
        const submissionData = await api.getTextSubmission(id)
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
        // Only stop on real errors, not intermittent network issues
        if (err.message && err.message.includes('not found')) {
            clearInterval(pollingRef.current)
            setLoading(false)
        }
      }
    }, 2000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSubmission(null)

    try {
      const resp = await api.createTextSubmission(
        formData.title || `Text Audit - ${new Date().toLocaleTimeString()}`,
        formData.content,
        formData.mode
      )
      setSubmission(resp)
      startPolling(resp.id)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-sans h-full">
      {!submission && !loading ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setFormData({ ...formData, mode: mode.id })}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  formData.mode === mode.id
                    ? `${mode.color} border-transparent text-white shadow-lg`
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              required
              placeholder="Paste your text here..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[200px] resize-none transition-all"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={!formData.content.trim() || isLimitReached}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
          >
            {isLimitReached ? 'Daily Limit Reached' : 'Run AI Analysis'}
          </button>
          
          {isLimitReached && (
            <p className="text-[10px] text-rose-400 text-center font-bold animate-pulse">
              You have reached your free limit of 20 Text Audits.
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">{formData.mode} Analysis</span>
            <button 
              onClick={() => { setSubmission(null); setFormData({ ...formData, content: '' }) }}
              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase"
            >
              New Audit
            </button>
          </div>

          {loading && (submission?.status === 'pending' || submission?.status === 'processing' || !submission) ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm font-bold text-zinc-200 mb-1">
                {submission?.status === 'processing' ? 'Finalizing Analysis...' : 'AI is Thinking...'}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                {submission?.status === 'processing' ? 'Generating processed text' : 'Checking results every 2 seconds'}
              </p>
            </div>
          ) : (
            <>
              {/* Score Display */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Health Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${
                      (submission?.analysis?.score || 0) > 7 ? 'text-emerald-500' : (submission?.analysis?.score || 0) > 4 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {submission?.analysis?.score || '0'}
                    </span>
                    <span className="text-xs font-bold text-zinc-600">/10</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter italic">Optimized</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${submission?.status === 'failed' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-tighter">
                    {submission?.status === 'failed' ? 'Analysis Failed' : 'Result'}
                  </span>
                </div>
                
                {submission?.status === 'failed' ? (
                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Something went wrong during the AI analysis. This could be due to a temporary service issue or a connection problem.
                    </p>
                    <button 
                      onClick={() => { setSubmission(null); setLoading(false); }}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl transition-all border border-zinc-700 active:scale-[0.98]"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap select-text">
                      {submission?.analysis?.processed_text || submission?.analysis?.content || (submission?.status === 'completed' ? 'Analysis finished, but no text was generated.' : 'Formatting results...')}
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-800 flex justify-end">
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {copied ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            Copy Result
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
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
