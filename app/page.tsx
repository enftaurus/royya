'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Activity,
  ArrowRight,
  ChevronDown,
  Cpu,
  Droplets,
  Gauge,
  Leaf,
  Menu,
  Power,
  Radio,
  ShieldCheck,
  Thermometer,
  Waves,
  X,
  Zap,
  User,
} from 'lucide-react'
import { getCurrentUser, getPortalRoute, type AuthUser } from '@/lib/auth'

export default function LandingPage() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f6f0] text-[#153b35]">
      {/* Navigation Bar */}
      <nav className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="#top" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5f36d] text-[#153b35] shadow-xs">
            <Leaf size={19} />
          </span>
          <span className="text-sm font-black tracking-[0.18em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            ROYYA WATCH
          </span>
        </Link>

        <div className="hidden items-center gap-9 text-sm font-medium text-white/75 md:flex">
          <a href="#problem" className="hover:text-white transition-colors">
            Why Royya
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How it works
          </a>
          <a href="#platform" className="hover:text-white transition-colors">
            Platform
          </a>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <Link
              href={getPortalRoute(user.role)}
              className="flex items-center gap-2 rounded-full bg-[#d5f36d] px-5 py-2.5 text-sm font-bold text-[#153b35] hover:bg-[#e4f98d] transition-colors"
            >
              <User size={14} />
              <span>Enter {user.role.toUpperCase()} Portal</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-[#d5f36d] px-5 py-3 text-sm font-bold text-[#153b35] hover:bg-[#e4f98d] transition-colors"
              >
                Access Portals <ArrowRight className="ml-2 inline" size={15} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full bg-white/15 p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {menuOpen && (
          <div className="absolute right-6 top-16 w-56 rounded-2xl bg-white p-4 text-sm shadow-xl md:hidden text-[#153b35]">
            <a className="block p-3 hover:bg-[#f4f6f0] rounded-xl font-medium" href="#problem" onClick={() => setMenuOpen(false)}>
              Why Royya
            </a>
            <a className="block p-3 hover:bg-[#f4f6f0] rounded-xl font-medium" href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a className="block p-3 hover:bg-[#f4f6f0] rounded-xl font-medium" href="#platform" onClick={() => setMenuOpen(false)}>
              Platform Portals
            </a>
            <Link
              href="/login"
              className="mt-2 block w-full rounded-full bg-[#d5f36d] p-3 text-center font-bold text-[#153b35]"
              onClick={() => setMenuOpen(false)}
            >
              Sign In to Portal
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="top"
        className="relative flex min-h-[720px] items-end overflow-hidden rounded-b-[2.5rem] bg-[#123c36] pb-14 pt-32 lg:min-h-[800px] lg:rounded-b-[4rem] lg:pb-20"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/pond-hero.png"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          aria-label="Shrimp swimming in an aquaculture pond"
        >
          <source src="/hero-pond.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#102f2d]/70 via-[#123c36]/15 to-[#123c36]/95" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d5f36d]">
              <span className="h-px w-8 bg-[#d5f36d]" /> Smart aquaculture intelligence
            </div>
            <h1 className="text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-[92px]">
              Intelligence at the <span className="text-[#d5f36d]">water&apos;s edge.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Real-time monitoring and automation for healthier ponds, calmer decisions, and smarter shrimp aquaculture.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-[#d5f36d] px-6 py-4 text-center text-sm font-bold text-[#193c36] hover:bg-[#e4f98d] transition-colors"
              >
                Access Platform Portals <ArrowRight className="ml-2 inline" size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="rounded-full border border-white/30 px-6 py-4 text-center text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-6 text-xs font-medium text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#d5f36d] animate-pulse" /> Live telemetry
            </span>
            <span>•</span>
            <span>FastAPI edge computing</span>
            <span>•</span>
            <span>ML Dissolved Oxygen Prediction</span>
            <span>•</span>
            <span>ESP32 Automated Control</span>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section
        id="problem"
        className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-32"
      >
        <div>
          <p className="eyebrow">The problem</p>
          <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">
            Water changes faster than manual monitoring can.
          </h2>
          <p className="mt-6 max-w-md leading-7 text-[#60756e]">
            Oxygen fluctuations, turbidity, temperature shifts and delayed responses put every harvest at risk. Royya Watch turns a moving pond into a clear next step.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Oxygen fluctuations', 'Turbidity changes', 'Temperature shifts', 'Delayed response'].map((item, i) => (
            <div key={item} className="rounded-3xl border border-[#d9e2d5] bg-white p-5 shadow-xs">
              <span className="text-3xl font-light text-[#9db26c]">0{i + 1}</span>
              <p className="mt-10 text-sm font-bold text-[#153b35]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* From Signal to Action */}
      <section id="how-it-works" className="bg-[#e5eee5] px-6 py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">From signal to action</p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
            Sense. Understand. <span className="text-[#8baf35]">Act.</span>
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Sense', 'Sensors read water temperature and turbidity voltage continuously.', Radio],
              ['02', 'Understand', 'FastAPI runs an ML model to estimate Dissolved Oxygen in real-time.', Gauge],
              ['03', 'Act', 'Automated hysteresis logic engages physical aerators on ESP32 GPIO 18.', Zap],
            ].map(([n, t, c, I]) => (
              <div key={n as string} className="rounded-[1.75rem] border border-[#cbdcca] bg-white/80 p-7 shadow-xs">
                <I size={24} className="text-[#7caa38]" />
                <span className="mt-5 block text-sm font-bold text-[#9bad9d]">{n as string}</span>
                <h3 className="mt-8 text-2xl font-bold text-[#153b35]">{t as string}</h3>
                <p className="mt-3 leading-6 text-[#647970]">{c as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Role Portals Section */}
      <section id="platform" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="rounded-[2.5rem] bg-[#d5f36d] px-7 py-14 text-center sm:px-14">
          <ShieldCheck className="mx-auto text-[#55742e]" size={32} />
          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl text-[#153b35]">
            One connected view of every pond you care for.
          </h2>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-[#466239]">
            Farmer, Admin, and Nerd portals connect to the same real-time FastAPI telemetry backend with dedicated responsibilities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[#193c36] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#122e29] transition-colors"
            >
              Farmer Portal →
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#193c36]/40 px-6 py-3.5 text-sm font-bold text-[#193c36] hover:bg-white/30 transition-colors"
            >
              Admin Operations →
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#193c36]/40 px-6 py-3.5 text-sm font-bold text-[#193c36] hover:bg-white/30 transition-colors"
            >
              Nerd Console →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 pb-8 text-xs text-[#789087] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span className="font-bold tracking-[0.15em] text-[#193c36]">ROYYA WATCH</span>
        <span>Aquaculture Edge Intelligence · FastAPI Gateway: 10.138.215.133:8000</span>
        <span>© 2026 Royya Watch</span>
      </footer>
    </main>
  )
}
