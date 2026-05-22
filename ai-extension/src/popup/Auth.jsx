import { useState } from 'react'

export default function Auth({ onLogin, onRegister, error }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      onLogin(formData.email, formData.password)
    } else {
      onRegister(formData.name, formData.email, formData.password)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center p-6 bg-zinc-950">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mx-auto mb-4">
          <span className="text-white font-bold text-3xl">A</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          {isLogin ? 'Sign in to continue to AI Assistant' : 'Join us and start your AI journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1 uppercase tracking-wider">Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs text-center animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-zinc-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </span>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          {isLogin ? 'Sign up free' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}
