'use client'

import React from 'react'
import { Sliders, Server, ShieldCheck, Zap, Cpu, Radio, Check } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

interface AdminSettingsProps {
  isLive: boolean
}

export function AdminSettings({ isLive }: AdminSettingsProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-[#153b35]">System Configuration & Policy</h2>
        <p className="text-xs text-[#788d81]">
          FastAPI control parameters, model decision boundaries, and edge gateway settings
        </p>
      </div>

      {/* Thresholds Display */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1eb]">
          <div className="rounded-xl bg-[#ecfdf5] p-2.5 text-[#059669]">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#153b35]">
              Automated Hysteresis Thresholds
            </h3>
            <p className="text-xs text-[#788d81]">
              Backend parameters enforced by FastAPI in AUTO mode
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="rounded-2xl bg-[#f4f7f2] p-4 border border-[#edf1eb]">
            <span className="text-[#788d81] text-[10px] uppercase">DO Low Trigger</span>
            <p className="text-xl font-bold text-[#ea580c] mt-1">5.0 mg/L</p>
            <p className="text-[11px] text-[#6d8176] mt-2 font-sans">
              Action: Aerator commanded ON automatically.
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4 border border-[#edf1eb]">
            <span className="text-[#788d81] text-[10px] uppercase">DO Recovery Trigger</span>
            <p className="text-xl font-bold text-[#059669] mt-1">6.0 mg/L</p>
            <p className="text-[11px] text-[#6d8176] mt-2 font-sans">
              Action: Aerator commanded OFF automatically.
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4 border border-[#edf1eb]">
            <span className="text-[#788d81] text-[10px] uppercase">Hysteresis Buffer</span>
            <p className="text-xl font-bold text-[#153b35] mt-1">5.0 – 6.0 mg/L</p>
            <p className="text-[11px] text-[#6d8176] mt-2 font-sans">
              Action: Preserves previous relay state.
            </p>
          </div>
        </div>
      </div>

      {/* Backend API Configuration */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1eb]">
          <div className="rounded-xl bg-[#eff6ff] p-2.5 text-[#2563eb]">
            <Server size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#153b35]">FastAPI Edge Gateway</h3>
            <p className="text-xs text-[#788d81]">
              Centralized API endpoint configuration from <code>lib/api.ts</code>
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#f9faf7] border border-[#edf1eb] gap-2">
            <span className="text-[#788d81]">API Endpoint URL</span>
            <span className="font-bold text-[#153b35]">{API_BASE_URL}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#f9faf7] border border-[#edf1eb] gap-2">
            <span className="text-[#788d81]">Environment Variable</span>
            <span className="text-[#153b35]">NEXT_PUBLIC_API_URL</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#f9faf7] border border-[#edf1eb] gap-2">
            <span className="text-[#788d81]">CORS Middleware</span>
            <span className="text-[#059669] font-bold">Wildcard (allow_origins=[&quot;*&quot;])</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#f9faf7] border border-[#edf1eb] gap-2">
            <span className="text-[#788d81]">Service Health</span>
            <span className={`font-bold ${isLive ? 'text-[#059669]' : 'text-[#b55835]'}`}>
              {isLive ? 'Online / Operational' : 'Offline / Unreachable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
