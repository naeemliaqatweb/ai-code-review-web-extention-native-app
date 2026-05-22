import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

export default function ResumeAssistant({ initialData, onRefreshStats, usageCount = 0 }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
  })
  const [submission, setSubmission] = useState(initialData || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('analysis') // 'analysis' or 'rewrite'
  const pollingRef = useRef(null)

  const isLimitReached = usageCount >= 20;

  useEffect(() => {
    if (initialData) {
      setSubmission(initialData)
      setFormData({
        title: initialData.title,
        content: initialData.content || initialData.extracted_text || '',
      })
    }
  }, [initialData])

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  const startPolling = (id) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    
    pollingRef.current = setInterval(async () => {
      try {
        const submissionData = await api.getResume(id)
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
      const resp = await api.createResume(
        formData.title || `Resume Optimization - ${new Date().toLocaleDateString()}`,
        formData.content
      )
      setSubmission(resp)
      startPolling(resp.id)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const analysis = submission?.analysis
  const rewrite = submission?.rewrite

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-sans h-full">
      {!submission && !loading ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Resume AI Optimizer</h3>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Paste your resume content below. Our AI will analyze it for ATS compatibility and provide a structured, professional optimization.
            </p>
          </div>

          <div className="relative">
            <textarea
              required
              placeholder="Paste your Resume text here (Experience, Skills, Education...)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[300px] resize-none transition-all scrollbar-thin"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={!formData.content.trim() || isLimitReached}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
            {isLimitReached ? 'Daily Limit Reached' : 'Optimize My Career'}
          </button>

          {isLimitReached && (
            <p className="text-[10px] text-rose-400 text-center font-bold animate-pulse">
              You have reached your free limit of 20 Resume Optimizations.
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-4 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase text-zinc-300 tracking-widest tracking-tighter">AI Career Coach</span>
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
              <p className="text-xs font-bold text-white uppercase tracking-wider">Optimizing Resume</p>
              <p className="text-[10px] text-zinc-500 mt-2 font-medium">Rewriting sections for ATS impact...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Result Tabs */}
              <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeTab === 'analysis' ? 'bg-zinc-800 text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Analysis
                </button>
                <button
                  onClick={() => setActiveTab('rewrite')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    activeTab === 'rewrite' ? 'bg-zinc-800 text-indigo-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Optimization
                </button>
              </div>

              {activeTab === 'analysis' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  {/* Score */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                    <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">ATS Match Score</span>
                    <span className={`text-3xl font-black ${
                      (analysis?.score || 0) > 7 ? 'text-emerald-500' : (analysis?.score || 0) > 4 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {analysis?.score || '0'}/10
                    </span>
                  </div>

                  {/* Missing Sections */}
                  {analysis?.missing_sections?.length > 0 && (
                    <div className="bg-zinc-900/40 border border-rose-500/20 rounded-2xl p-4">
                      <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3">Missing Sections</h4>
                      <ul className="space-y-2">
                        {analysis.missing_sections.map((item, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex gap-2">
                            <span className="text-rose-500">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Professional Improvements */}
                  {analysis?.professional_improvements?.length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                      <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Professional Improvements</h4>
                      <ul className="space-y-2">
                        {analysis.professional_improvements.map((item, i) => (
                          <li key={i} className="text-xs text-zinc-300 flex gap-2">
                            <span className="text-indigo-500">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                   {/* Summary */}
                   {rewrite?.summary && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                      <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Professional Summary</span>
                      </div>
                      <div className="p-4 text-xs text-zinc-300 leading-relaxed italic">
                        {rewrite.summary}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {rewrite?.skills?.length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                       <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Core Competencies</h4>
                       <div className="flex flex-wrap gap-2">
                         {rewrite.skills.map((skill, i) => (
                           <span key={i} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300 font-medium">
                             {skill}
                           </span>
                         ))}
                       </div>
                    </div>
                  )}

                  {/* Experience */}
                  {rewrite?.experience?.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Professional Experience</h4>
                      {rewrite.experience.map((job, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <h5 className="text-[11px] font-black text-white">{job.role}</h5>
                            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{job.duration}</span>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-400">{job.company}</p>
                          <ul className="space-y-1 mt-2">
                            {job.achievements?.map((ach, j) => (
                              <li key={j} className="text-[10px] text-zinc-400 flex gap-2 leading-relaxed">
                                <span className="text-indigo-500">•</span>
                                {ach}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {rewrite?.education?.length > 0 && (
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Academic Background</h4>
                        {rewrite.education.map((edu, i) => (
                          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                            <div>
                               <h5 className="text-[10px] font-black text-white">{edu.degree}</h5>
                               <p className="text-[9px] text-zinc-500">{edu.institution}</p>
                            </div>
                            <span className="text-[9px] font-bold text-zinc-400">{edu.year}</span>
                          </div>
                        ))}
                     </div>
                  )}
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
