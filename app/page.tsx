'use client'

import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Droplets,
  Gauge,
  Leaf,
  Menu,
  Play,
  Power,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Waves,
  X,
  Zap,
} from 'lucide-react'

const metrics = [
  { label: 'Temperature', value: '30.2', unit: '°C', icon: Thermometer, tone: 'sand' },
  { label: 'Dissolved oxygen', value: '6.4', unit: 'mg/L', icon: Waves, tone: 'mint' },
  { label: 'pH balance', value: '7.8', unit: '', icon: Activity, tone: 'lavender' },
  { label: 'Turbidity', value: '2.1', unit: 'NTU', icon: Droplets, tone: 'blue' },
]

const steps = [
  { number: '01', title: 'Sense', copy: 'Sensors continuously read the water, day and night.', icon: Radio },
  { number: '02', title: 'Understand', copy: 'Clear signals turn raw readings into pond intelligence.', icon: Gauge },
  { number: '03', title: 'Act', copy: 'Get a recommendation, or let automation respond.', icon: Zap },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aeratorOn, setAeratorOn] = useState(true)

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7f2] text-[#193c36]">
      <nav className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="Royya Watch home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5f36d] text-[#193c36]"><Leaf size={19} strokeWidth={2.5} /></span>
          <span className="text-sm font-bold tracking-[0.18em] text-[#d5f36d] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">ROYYA WATCH</span>
        </a>
        <div className="hidden items-center gap-9 text-sm font-medium text-white/75 md:flex">
          <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          <a href="#platform" className="transition hover:text-white">Platform</a>
          <a href="#about" className="transition hover:text-white">About us</a>
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <button className="text-sm font-semibold text-white/80 transition hover:text-white">Log in</button>
          <button className="rounded-full bg-[#d5f36d] px-5 py-3 text-sm font-bold text-[#193c36] transition hover:bg-white">Explore platform <ArrowRight className="ml-2 inline" size={15} /></button>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full bg-white/15 p-2 text-white md:hidden" aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {menuOpen && <div className="absolute right-6 top-16 w-48 rounded-2xl bg-white p-4 text-sm shadow-xl md:hidden"><a className="block p-3" href="#how-it-works">How it works</a><a className="block p-3" href="#platform">Platform</a><a className="block p-3" href="#about">About us</a><button className="mt-2 w-full rounded-full bg-[#d5f36d] p-3 font-bold">Log in</button></div>}
      </nav>

      <section id="top" className="relative flex min-h-[720px] items-end overflow-hidden rounded-b-[2.5rem] bg-[#123c36] pb-14 pt-32 sm:min-h-[760px] lg:min-h-[800px] lg:rounded-b-[4rem] lg:pb-20">
        <video autoPlay muted loop playsInline poster="/pond-hero.png" aria-label="Shrimp swimming in an aquaculture pond" className="absolute inset-0 h-full w-full object-cover opacity-80"><source src="/hero-pond.mp4" type="video/mp4" />Your browser does not support the video tag.</video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#102f2d]/65 via-[#123c36]/15 to-[#123c36]/90" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d5f36d]"><span className="h-px w-8 bg-[#d5f36d]" /> Smart aquaculture intelligence</div>
            <h1 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl lg:text-[92px]">Intelligence at the <span className="text-[#d5f36d]">water&apos;s edge.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg">Real-time monitoring and automation for healthier ponds, calmer decisions, and smarter shrimp aquaculture.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button className="rounded-full bg-[#d5f36d] px-6 py-4 text-sm font-bold text-[#193c36] transition hover:bg-white">Explore platform <ArrowRight className="ml-2 inline" size={16} /></button><button className="rounded-full border border-white/30 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"><Play className="mr-2 inline fill-current" size={15} /> Watch how it works</button></div>
          </div>
          <div className="mt-16 flex flex-wrap items-center gap-6 text-xs font-medium text-white/60"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#d5f36d]" /> Live monitoring</span><span>•</span><span>Built for the field</span><span>•</span><span>Works offline</span></div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7b9b66]">A clearer picture</p><h2 className="mt-4 max-w-lg text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">Know your pond is healthy in <span className="text-[#8baf35]">five seconds.</span></h2><p className="mt-6 max-w-md leading-7 text-[#60756e]">Royya Watch transforms complex water quality data into a simple next best action. Less guesswork. More confident farming.</p><div className="mt-9 flex items-center gap-3 text-sm font-bold"><ShieldCheck size={20} className="text-[#8baf35]" /> Designed for the realities of the field</div></div>
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_60px_rgba(42,77,60,0.09)] sm:p-7"><div className="mb-7 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#91a39c]">Pond overview</p><button className="mt-2 flex items-center gap-1 text-lg font-bold">Pond 01 <ChevronDown size={16} /></button></div><span className="flex items-center gap-2 rounded-full bg-[#eef9e5] px-3 py-2 text-xs font-bold text-[#5d8d32]"><span className="h-2 w-2 rounded-full bg-[#80bd48]" /> Live</span></div><div className="rounded-2xl bg-[#edf8e4] p-6 text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6a9364]">Pond health</p><p className="mt-1 text-5xl font-medium tracking-[-0.06em] text-[#28583d]">92<span className="text-2xl text-[#7e9c82]">/100</span></p><p className="mt-2 text-sm font-bold text-[#5f8a43]">Good · All systems normal</p></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{metrics.map(({ label, value, unit, icon: Icon, tone }) => <div key={label} className={`rounded-2xl p-4 ${tone === 'sand' ? 'bg-[#fff5de]' : tone === 'mint' ? 'bg-[#e9f7f1]' : tone === 'lavender' ? 'bg-[#f0effb]' : 'bg-[#eaf4fa]'}`}><Icon size={17} className="mb-5 text-[#71847d]" /><p className="text-[11px] font-medium text-[#71847d]">{label}</p><p className="mt-1 text-xl font-bold tracking-tight">{value}<span className="ml-0.5 text-xs font-medium text-[#71847d]">{unit}</span></p><p className="mt-2 text-[10px] font-bold text-[#6d9960]">Normal</p></div>)}</div><div className="mt-5 flex items-center justify-between rounded-2xl bg-[#193c36] p-5 text-white"><div className="flex items-center gap-3"><span className="rounded-xl bg-white/10 p-2.5"><Power size={18} className={aeratorOn ? 'text-[#d5f36d]' : 'text-white/50'} /></span><div><p className="text-sm font-bold">Aerator</p><p className="mt-0.5 text-xs text-white/60">{aeratorOn ? 'Running smoothly' : 'Currently stopped'}</p></div></div><button onClick={() => setAeratorOn(!aeratorOn)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${aeratorOn ? 'bg-[#d5f36d] text-[#193c36]' : 'bg-white/15 text-white'}`}>{aeratorOn ? 'Turn off' : 'Turn on'}</button></div></div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#e7f0e7] px-6 py-24 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7b9b66]">From signal to action</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Sense. Understand. <span className="text-[#8baf35]">Act.</span></h2></div><div className="mt-14 grid gap-5 md:grid-cols-3">{steps.map(({ number, title, copy, icon: Icon }) => <div key={number} className="rounded-[1.75rem] border border-[#cbdcca] bg-white/60 p-7"><div className="flex items-center justify-between"><Icon size={24} className="text-[#7caa38]" /><span className="text-sm font-bold text-[#9bad9d]">{number}</span></div><h3 className="mt-12 text-2xl font-bold tracking-tight">{title}</h3><p className="mt-3 max-w-xs leading-6 text-[#647970]">{copy}</p></div>)}</div></div></section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="rounded-[2.5rem] bg-[#d5f36d] px-7 py-14 text-center sm:px-14"><SlidersHorizontal className="mx-auto text-[#55742e]" size={28} /><h2 className="mx-auto mt-5 max-w-2xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Better water. Better decisions. Better harvests.</h2><p className="mx-auto mt-5 max-w-lg leading-7 text-[#466239]">One calm, connected view of every pond you care for.</p><button className="mt-8 rounded-full bg-[#193c36] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#28584c]">Start exploring <ArrowRight className="ml-2 inline" size={16} /></button></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 pb-8 text-xs text-[#789087] sm:flex-row sm:items-center sm:justify-between lg:px-10"><span className="font-bold tracking-[0.15em] text-[#193c36]">ROYYA WATCH</span><span>Intelligence at the water&apos;s edge.</span><span>© 2026 Royya Watch</span></footer>
    </main>
  )
}
