'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, ArrowRight, ShieldCheck, AlertCircle, User, Lock, Cpu, Building2, HelpCircle } from 'lucide-react'
import { login, getCurrentUser, getPortalRoute, DEMO_CREDENTIALS } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // If already authenticated, redirect to portal
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.replace(getPortalRoute(user.role))
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = login(username, password)
    if (!result.success || !result.user) {
      setError(result.error || 'Invalid username or password.')
      setLoading(false)
      return
    }

    router.replace(getPortalRoute(result.user.role))
  }

  const fillCredentials = (roleKey: string) => {
    const cred = DEMO_CREDENTIALS[roleKey]
    if (cred) {
      setUsername(roleKey)
      setPassword(cred.password)
      setError(null)
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#123c36] text-white p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#d5f36d]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#1b5e52]/40 blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5f36d] text-[#153b35] shadow-xs">
            <Leaf size={18} />
          </span>
          <span className="text-sm font-black tracking-[0.18em] text-white">ROYYA WATCH</span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
        >
          Back to Overview
        </Link>
      </header>

      {/* Center Login Box */}
      <div className="relative z-10 max-w-md w-full mx-auto my-10">
        <div className="rounded-[2.25rem] border border-white/10 bg-white/95 p-7 sm:p-10 text-[#153b35] shadow-2xl backdrop-blur">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d5f36d] text-[#153b35] mb-4 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#153b35]">
              Role Portal Access
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#6d8176]">
              Sign in to your designated operational portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl border border-[#f4cbb8] bg-[#fff0e5] p-3.5 text-xs text-[#b55835] font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#153b35] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-[#8a9d90]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="farmer, admin, or nerd"
                  className="w-full rounded-2xl border border-[#d8e2d7] bg-[#f9faf7] pl-10 pr-4 py-3 text-sm text-[#153b35] placeholder:text-[#a0b2a7] focus:border-[#153b35] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#153b35] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8a9d90]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter demo password"
                  className="w-full rounded-2xl border border-[#d8e2d7] bg-[#f9faf7] pl-10 pr-4 py-3 text-sm text-[#153b35] placeholder:text-[#a0b2a7] focus:border-[#153b35] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#153b35] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1a4a42] transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign in to Portal'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-8 pt-6 border-t border-[#edf1eb]">
            <p className="text-[11px] font-bold text-[#8a9d90] uppercase tracking-wider text-center mb-3">
              One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('farmer')}
                className="flex flex-col items-center p-2.5 rounded-xl border border-[#d8e2d7] bg-[#f4f7f2] hover:bg-[#eaf6df] hover:border-[#80bd48] transition-all text-[#153b35]"
              >
                <Leaf size={14} className="text-[#5c8e33] mb-1" />
                <span className="font-bold text-[11px]">Farmer</span>
                <span className="text-[9px] text-[#788d81]">farmer123</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="flex flex-col items-center p-2.5 rounded-xl border border-[#d8e2d7] bg-[#f4f7f2] hover:bg-[#eaf6df] hover:border-[#80bd48] transition-all text-[#153b35]"
              >
                <Building2 size={14} className="text-[#2563eb] mb-1" />
                <span className="font-bold text-[11px]">Admin</span>
                <span className="text-[9px] text-[#788d81]">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('nerd')}
                className="flex flex-col items-center p-2.5 rounded-xl border border-[#d8e2d7] bg-[#f4f7f2] hover:bg-[#eaf6df] hover:border-[#80bd48] transition-all text-[#153b35]"
              >
                <Cpu size={14} className="text-[#ea580c] mb-1" />
                <span className="font-bold text-[11px]">Nerd</span>
                <span className="text-[9px] text-[#788d81]">nerd123</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] text-[#8a9d90] leading-relaxed">
            Note: These are <strong>DEMO credentials only</strong> for frontend role separation. Not intended as production-grade authentication.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-white/50 max-w-6xl mx-auto w-full">
        ROYYA WATCH · Aquaculture Water Monitoring API Gateway
      </footer>
    </main>
  )
}
