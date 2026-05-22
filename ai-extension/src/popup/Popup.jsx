import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Tabs from '../components/Tabs'
import Auth from './Auth'
import Dashboard from './Dashboard'
import TextAssistant from './TextAssistant'
import CodeAssistant from './CodeAssistant'
import ResumeAssistant from './ResumeAssistant'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'

export default function Popup() {
  const { user, loading, error, login, register, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [moduleUsage, setModuleUsage] = useState({ text: 0, code: 0, resume: 0 })
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (user) {
      fetchGlobalStats()
    }
  }, [user, activeTab])

  const fetchGlobalStats = async () => {
    try {
      const [textItems, codeItems, resumeItems] = await Promise.all([
        api.listTextSubmissions(),
        api.listCodeSubmissions(),
        api.listResumes()
      ])
      setModuleUsage({
        text: textItems.length || 0,
        code: codeItems.length || 0,
        resume: resumeItems.length || 0
      })
    } catch (err) {
      console.error('Failed to sync global stats:', err)
    }
  }

  const handleHistoryClick = (type, item) => {
    setSelectedItem(item)
    setActiveTab(type === 'resumes' ? 'resume' : type)
  }

  const handleTabChange = (tabId) => {
    setSelectedItem(null)
    setActiveTab(tabId)
  }

  if (loading) {
    return (
      <div className="h-[600px] w-[380px] bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium animate-pulse text-zinc-400 font-sans tracking-wide">Syncing AI Session...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-[600px] w-[380px] bg-zinc-950 flex flex-col font-sans">
        <Auth 
          onLogin={login} 
          onRegister={register} 
          error={error} 
        />
      </div>
    )
  }

  return (
    <div className="h-[600px] w-[380px] bg-zinc-950 text-zinc-100 flex flex-col font-sans overflow-hidden">
      <Header user={user} onLogout={logout} moduleUsage={moduleUsage} activeTab={activeTab} />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'dashboard' && <Dashboard onNavigate={handleHistoryClick} />}
        {activeTab === 'text' && (
          <TextAssistant 
            initialData={activeTab === 'text' ? selectedItem : null} 
            onRefreshStats={fetchGlobalStats}
            usageCount={moduleUsage.text}
          />
        )}
        {activeTab === 'code' && (
          <CodeAssistant 
            initialData={activeTab === 'code' ? selectedItem : null} 
            onRefreshStats={fetchGlobalStats}
            usageCount={moduleUsage.code}
          />
        )}
        {activeTab === 'resume' && (
          <ResumeAssistant 
            initialData={activeTab === 'resume' ? selectedItem : null} 
            onRefreshStats={fetchGlobalStats}
            usageCount={moduleUsage.resume}
          />
        )}
      </main>
    </div>
  )
}
