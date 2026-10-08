'use client'

import React from 'react'
import { Waves, Thermometer, Droplets, Power, CheckCircle, AlertTriangle } from 'lucide-react'
import type { SystemData } from '@/lib/api'

interface FarmerPondsProps {
  data: SystemData | null
  isLive: boolean
  language: 'EN' | 'తెలుగు'
}

export function FarmerPonds({ data, isLive, language }: FarmerPondsProps) {
  const isTe = language === 'తెలుగు'
  const doValue = data?.dissolved_oxygen ?? 0
  const isHealthy = doValue >= 6.0
  const isWarning = doValue >= 5.0 && doValue < 6.0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">
            {isTe ? 'చెరువుల స్థితి' : 'Pond Overview'}
          </h2>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'మీ పొలంలో ఉన్న అన్ని చెరువుల పర్యవేక్షణ' : 'Active aquaculture production ponds'}
          </p>
        </div>
        <span className="rounded-full bg-[#eaf6df] px-3.5 py-1 text-xs font-bold text-[#5c8e33] self-start sm:self-auto">
          {isTe ? '1 క్రియాశీలక చెరువు' : '1 Active Pond Connected'}
        </span>
      </div>

      {/* Pond 01: Live connected pond */}
      <div className="rounded-3xl border border-[#cfe6bf] bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#edf1eb]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d5f36d] text-[#153b35] font-black">
                01
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#153b35]">
                  {isTe ? 'చెరువు 01 (ప్రధాన చెరువు)' : 'Pond 01 (Main Production Pond)'}
                </h3>
                <p className="text-xs text-[#788d81]">
                  ESP32-001 · {isLive ? (isTe ? 'ఆన్‌లైన్' : 'Online & Streaming') : (isTe ? 'ఆఫ్‌లైన్' : 'Device Offline')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                !isLive
                  ? 'bg-gray-100 text-gray-600'
                  : isHealthy
                  ? 'bg-[#eaf6df] text-[#5c8e33]'
                  : isWarning
                  ? 'bg-[#fef9e7] text-[#9c7414]'
                  : 'bg-[#fff0e5] text-[#b55835]'
              }`}
            >
              {isHealthy ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>
                {!isLive
                  ? (isTe ? 'కనెక్షన్ లేదు' : 'Disconnected')
                  : isHealthy
                  ? (isTe ? 'ఆరోగ్యకరం' : 'Healthy')
                  : isWarning
                  ? (isTe ? 'రికవరీ జోన్' : 'Recovery Band')
                  : (isTe ? 'తక్కువ ఆక్సిజన్' : 'Low Oxygen')}
              </span>
            </span>

            <span className="rounded-full bg-[#153b35] px-3.5 py-1 text-xs font-bold text-white">
              {data ? `${data.mode} MODE` : '--'}
            </span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <div className="flex items-center gap-2 text-xs text-[#788d81]">
              <Thermometer size={16} className="text-[#ea580c]" />
              <span>{isTe ? 'ఉష్ణోగ్రత' : 'Temperature'}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.temperature.toFixed(2) : '--'}
              <span className="text-xs font-normal text-[#788d81] ml-1">°C</span>
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <div className="flex items-center gap-2 text-xs text-[#788d81]">
              <Droplets size={16} className="text-[#2563eb]" />
              <span>{isTe ? 'మడ్డితనం' : 'Turbidity'}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.turbidity.toFixed(2) : '--'}
              <span className="text-xs font-normal text-[#788d81] ml-1">V</span>
            </p>
            <p className="text-[10px] text-[#8a9d90] mt-0.5">Sensor voltage</p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <div className="flex items-center gap-2 text-xs text-[#788d81]">
              <Waves size={16} className="text-[#059669]" />
              <span>{isTe ? 'అంచనా DO' : 'Predicted DO'}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.dissolved_oxygen.toFixed(2) : '--'}
              <span className="text-xs font-normal text-[#788d81] ml-1">mg/L</span>
            </p>
            <p className="text-[10px] text-[#8a9d90] mt-0.5">ML estimate</p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <div className="flex items-center gap-2 text-xs text-[#788d81]">
              <Power size={16} className={data?.aerator_state === 'ON' ? 'text-[#84cc16]' : 'text-gray-400'} />
              <span>{isTe ? 'ఎరేటర్' : 'Aerator'}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data?.aerator_state === 'ON'
                ? (isTe ? 'నడుస్తోంది' : 'RUNNING')
                : (isTe ? 'ఆపివేయబడింది' : 'STOPPED')}
            </p>
          </div>
        </div>
      </div>

      {/* Standby / Offline Ponds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Pond 02 (Nursery)', 'Pond 03 (Growout Pond)'].map((name, idx) => (
          <div key={name} className="rounded-3xl border border-[#e2e8df] bg-white/60 p-6 opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200 text-gray-700 font-bold text-xs">
                  0{idx + 2}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-[#153b35]">{name}</h4>
                  <p className="text-[11px] text-[#788d81]">
                    {isTe ? 'సెన్సార్ కిట్ కనెక్ట్ కాలేదు' : 'Sensor kit pending installation'}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-500">
                {isTe ? 'స్టాండ్‌బై' : 'Standby'}
              </span>
            </div>
            <p className="mt-4 text-xs text-[#8a9d90]">
              {isTe
                ? 'ఈ చెరువుకు పరికరం అమర్చబడలేదు. త్వరలో లైవ్ డేటా అందుబాటులోకి వస్తుంది.'
                : 'No telemetry hub assigned yet. Only Pond 01 is currently wired to the live FastAPI backend.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
