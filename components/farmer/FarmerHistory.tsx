'use client'

import React, { useState } from 'react'
import { Calendar, Download, Thermometer, Droplets, Waves } from 'lucide-react'
import { LineChart, type DataPoint } from '@/components/LineChart'

interface FarmerHistoryProps {
  tempHistory: DataPoint[]
  turbidityHistory: DataPoint[]
  doHistory: DataPoint[]
  language: 'EN' | 'తెలుగు'
}

export function FarmerHistory({
  tempHistory,
  turbidityHistory,
  doHistory,
  language,
}: FarmerHistoryProps) {
  const isTe = language === 'తెలుగు'
  const [range, setRange] = useState<'live' | '1h' | '6h' | '24h'>('live')
  const [activeTab, setActiveTab] = useState<'temp' | 'turb' | 'do'>('temp')

  const computeStats = (data: DataPoint[]) => {
    if (data.length === 0) return { min: '--', max: '--', avg: '--', current: '--' }
    const vals = data.map((d) => d.value)
    const min = Math.min(...vals).toFixed(2)
    const max = Math.max(...vals).toFixed(2)
    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
    const current = vals[vals.length - 1].toFixed(2)
    return { min, max, avg, current }
  }

  const tempStats = computeStats(tempHistory)
  const turbStats = computeStats(turbidityHistory)
  const doStats = computeStats(doHistory)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">
            {isTe ? 'నీటి పారామితుల చరిత్ర' : 'Water Telemetry History'}
          </h2>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'లైవ్ బ్యాకెండ్ ద్వారా సేకరించిన రోలింగ్ రీడింగ్‌లు' : 'Rolling telemetry buffer recorded from FastAPI backend'}
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1 border border-[#dce5d9] self-start sm:self-auto">
          {[
            { id: 'live', label: isTe ? 'లైవ్ 15 నిమి' : 'Live ~15m' },
            { id: '1h', label: isTe ? '1 గంట' : '1h' },
            { id: '6h', label: isTe ? '6 గంటలు' : '6h' },
            { id: '24h', label: isTe ? '24 గంటలు' : '24h' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id as typeof range)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                range === item.id
                  ? 'bg-[#153b35] text-white shadow-xs'
                  : 'text-[#60756e] hover:text-[#153b35]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('temp')}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === 'temp'
              ? 'border-[#ea580c] bg-white ring-2 ring-[#ea580c]/20'
              : 'border-[#dce5d9] bg-white hover:border-[#ea580c]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#788d81] flex items-center gap-1.5">
              <Thermometer size={16} className="text-[#ea580c]" />
              {isTe ? 'ఉష్ణోగ్రత' : 'Temperature'}
            </span>
            <span className="text-xs font-bold text-[#ea580c]">{tempStats.current} °C</span>
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-[#788d81]">
            <span>Min: {tempStats.min}°C</span>
            <span>Avg: {tempStats.avg}°C</span>
            <span>Max: {tempStats.max}°C</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('turb')}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === 'turb'
              ? 'border-[#2563eb] bg-white ring-2 ring-[#2563eb]/20'
              : 'border-[#dce5d9] bg-white hover:border-[#2563eb]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#788d81] flex items-center gap-1.5">
              <Droplets size={16} className="text-[#2563eb]" />
              {isTe ? 'మడ్డితనం (వోల్టేజ్)' : 'Turbidity Voltage'}
            </span>
            <span className="text-xs font-bold text-[#2563eb]">{turbStats.current} V</span>
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-[#788d81]">
            <span>Min: {turbStats.min}V</span>
            <span>Avg: {turbStats.avg}V</span>
            <span>Max: {turbStats.max}V</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('do')}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === 'do'
              ? 'border-[#059669] bg-white ring-2 ring-[#059669]/20'
              : 'border-[#dce5d9] bg-white hover:border-[#059669]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#788d81] flex items-center gap-1.5">
              <Waves size={16} className="text-[#059669]" />
              {isTe ? 'అంచనా వేసిన DO' : 'Predicted DO'}
            </span>
            <span className="text-xs font-bold text-[#059669]">{doStats.current} mg/L</span>
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-[#788d81]">
            <span>Min: {doStats.min}</span>
            <span>Avg: {doStats.avg}</span>
            <span>Max: {doStats.max}</span>
          </div>
        </button>
      </div>

      {/* Selected Chart */}
      {activeTab === 'temp' && (
        <LineChart
          data={tempHistory}
          title={isTe ? 'ఉష్ణోగ్రత ట్రెండ్' : 'Temperature Trend'}
          subtitle={isTe ? 'లైవ్ నీటి ఉష్ణోగ్రత రీడింగ్‌లు' : 'Real-time recorded water temperature'}
          unit="°C"
          lineColor="#ea580c"
          fillGradientStart="rgba(234, 88, 12, 0.25)"
          fillGradientEnd="rgba(234, 88, 12, 0.02)"
          badgeText="°C"
          height={260}
        />
      )}

      {activeTab === 'turb' && (
        <LineChart
          data={turbidityHistory}
          title={isTe ? 'మడ్డితనం ట్రెండ్' : 'Turbidity Trend'}
          subtitle={isTe ? 'సెన్సార్ వోల్టేజ్; NTU క్రమాంకనం పెండింగ్‌లో ఉంది' : 'Sensor voltage; NTU calibration pending.'}
          unit="V"
          lineColor="#2563eb"
          fillGradientStart="rgba(37, 99, 235, 0.25)"
          fillGradientEnd="rgba(37, 99, 235, 0.02)"
          badgeText="Voltage"
          height={260}
        />
      )}

      {activeTab === 'do' && (
        <LineChart
          data={doHistory}
          title={isTe ? 'కరిగిన ఆక్సిజన్ అంచనా ట్రెండ్' : 'Predicted DO Trend'}
          subtitle={isTe ? 'మెషిన్ లెర్నింగ్ మోడల్ ఆధారంగా అంచనా' : 'ML model continuous prediction'}
          unit="mg/L"
          lineColor="#059669"
          fillGradientStart="rgba(5, 150, 105, 0.25)"
          fillGradientEnd="rgba(5, 150, 105, 0.02)"
          badgeText="mg/L"
          height={260}
        />
      )}

      {/* Rolling Log Data Table */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <h3 className="font-bold text-base text-[#153b35] mb-4">
          {isTe ? 'సమీప రీడింగ్‌ల పట్టిక' : 'Latest Received Readings'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#edf1eb] bg-[#f9faf7] text-[#788d81] uppercase font-semibold">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Temperature</th>
                <th className="p-3">Turbidity Voltage</th>
                <th className="p-3">Predicted DO</th>
                <th className="p-3">Threshold Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1eb]">
              {tempHistory.slice(-8).reverse().map((item, idx) => {
                const turbItem = turbidityHistory[turbidityHistory.length - 1 - idx]
                const doItem = doHistory[doHistory.length - 1 - idx]
                const doVal = doItem ? doItem.value : 0
                return (
                  <tr key={idx} className="hover:bg-[#f9faf7]">
                    <td className="p-3 font-mono font-medium text-[#153b35]">{item.timestamp}</td>
                    <td className="p-3 font-semibold text-[#ea580c]">{item.value.toFixed(2)} °C</td>
                    <td className="p-3 font-semibold text-[#2563eb]">{turbItem ? turbItem.value.toFixed(2) : '--'} V</td>
                    <td className="p-3 font-semibold text-[#059669]">{doItem ? doItem.value.toFixed(2) : '--'} mg/L</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          doVal >= 6.0
                            ? 'bg-[#eaf6df] text-[#5c8e33]'
                            : doVal >= 5.0
                            ? 'bg-[#fef9e7] text-[#9c7414]'
                            : 'bg-[#fff0e5] text-[#b55835]'
                        }`}
                      >
                        {doVal >= 6.0 ? 'Healthy (>6.0)' : doVal >= 5.0 ? 'Recovery (5.0–6.0)' : 'Low (<5.0)'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
