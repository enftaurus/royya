'use client'

import React from 'react'
import {
  Sliders,
  Power,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

interface MockDOSimulatorProps {
  mockDoEnabled: boolean
  mockDoValue: number
  onUpdateMockDo: (enabled: boolean, value?: number) => Promise<void>
  mode: 'AUTO' | 'MANUAL'
  aeratorState: 'ON' | 'OFF'
  onUpdateMode?: (mode: 'AUTO' | 'MANUAL') => Promise<void>
  language?: 'EN' | 'తెలుగు'
}

export function MockDOSimulator({
  mockDoEnabled,
  mockDoValue,
  onUpdateMockDo,
  mode,
  aeratorState,
  onUpdateMode,
  language = 'EN',
}: MockDOSimulatorProps) {
  const isTe = language === 'తెలుగు'

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    onUpdateMockDo(true, val)
  }

  const handleToggle = () => {
    onUpdateMockDo(!mockDoEnabled, mockDoValue)
  }

  const handlePreset = (val: number) => {
    onUpdateMockDo(true, val)
  }

  // Threshold evaluations
  const isLow = mockDoValue < 5.0
  const isHysteresis = mockDoValue >= 5.0 && mockDoValue <= 6.0
  const isOptimal = mockDoValue > 6.0

  const activeZoneText = isLow
    ? isTe
      ? 'తక్కువ ఆక్సిజన్ (< 5.0 mg/L) → ఆటో ఎరేటర్ ఆన్ అవుతుంది'
      : 'Low Oxygen (< 5.0 mg/L) → AUTO logic commands Aerator ON'
    : isHysteresis
    ? isTe
      ? `హిస్టెరిసిస్ బఫర్ (5.0–6.0 mg/L) → మునుపటి స్థితిని నిలుపుకుంటుంది (${aeratorState})`
      : `Hysteresis Buffer (5.0–6.0 mg/L) → Preserves previous relay state (${aeratorState})`
    : isTe
    ? 'ఆరోగ్యకరమైన స్థాయి (> 6.0 mg/L) → ఆటో ఎరేటర్ ఆఫ్ అవుతుంది'
    : 'Optimal Recovered (> 6.0 mg/L) → AUTO logic commands Aerator OFF'

  return (
    <div
      className={`rounded-3xl border transition-all p-5 sm:p-6 ${
        mockDoEnabled
          ? 'border-[#8b5cf6]/40 bg-gradient-to-br from-[#faf5ff] to-[#f3e8ff]/40 shadow-sm'
          : 'border-[#dce5d9] bg-white shadow-xs'
      }`}
    >
      {/* Top Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf1eb]">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-2xl p-2.5 shrink-0 ${
              mockDoEnabled
                ? 'bg-[#8b5cf6] text-white'
                : 'bg-[#f4f7f2] text-[#6d8176]'
            }`}
          >
            <Sliders size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#153b35]">
                {isTe ? 'మాక్ DO సిమ్యులేషన్ మోడ్' : 'Mock Data Mode: DO Simulator'}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  mockDoEnabled
                    ? 'bg-[#8b5cf6] text-white animate-pulse'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {mockDoEnabled ? 'MOCK MODE ACTIVE' : 'REAL ML MODE'}
              </span>
            </div>
            <p className="text-xs text-[#788d81] mt-0.5">
              {isTe
                ? 'ఆటో మోడ్ హిస్టెరిసిస్ పరీక్షించడానికి మోడల్ DOను మాన్యువల్‌గా భర్తీ చేయండి.'
                : 'Manually override predicted DO to simulate AUTO hysteresis control loop.'}
            </p>
          </div>
        </div>

        {/* Enable / Disable Toggle Switch */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#153b35]">
            {mockDoEnabled ? (isTe ? 'సక్రియం' : 'Simulation Enabled') : (isTe ? 'ఆపివేయబడింది' : 'Simulation Disabled')}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={mockDoEnabled}
            onClick={handleToggle}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              mockDoEnabled ? 'bg-[#8b5cf6]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                mockDoEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Simulator Controls (shown when enabled or collapsed prompt when disabled) */}
      {mockDoEnabled ? (
        <div className="mt-5 space-y-5">
          {/* Live Simulated DO Value Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-[#e9d5ff] shadow-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#788d81]">
                {isTe ? 'ప్రస్తుత మాక్ DO రీడింగ్' : 'Simulated Dissolved Oxygen'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black font-mono text-[#8b5cf6]">
                  {mockDoValue.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-[#788d81]">mg/L</span>
              </div>
            </div>

            <div className="text-right self-start sm:self-auto">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  isLow
                    ? 'bg-[#fee2e2] text-[#b91c1c]'
                    : isHysteresis
                    ? 'bg-[#fef3c7] text-[#b45309]'
                    : 'bg-[#dcfce7] text-[#15803d]'
                }`}
              >
                {isLow ? (
                  <AlertTriangle size={13} />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                <span>{activeZoneText}</span>
              </span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-[#788d81]">
              <span>2.0 mg/L (Critical Low)</span>
              <span className="text-[#8b5cf6] font-mono font-bold">5.0 (ON) | 6.0 (OFF)</span>
              <span>9.0 mg/L (High DO)</span>
            </div>

            <div className="relative py-2">
              <input
                type="range"
                min="2.0"
                max="9.0"
                step="0.1"
                value={mockDoValue}
                onChange={handleSliderChange}
                className="w-full h-3.5 bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#10b981] rounded-lg appearance-none cursor-pointer accent-[#8b5cf6]"
              />
            </div>

            {/* Scale legend */}
            <div className="flex justify-between text-[11px] text-[#8a9d90] px-1 font-mono">
              <span className="text-[#dc2626]">🔴 &lt; 5.0 (Low DO)</span>
              <span className="text-[#d97706]">🟡 5.0 – 6.0 (Hysteresis Band)</span>
              <span className="text-[#16a34a]">🟢 &gt; 6.0 (Healthy)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#788d81] mb-2">
              {isTe ? 'శీఘ్ర పరీక్ష ప్రీసెట్‌లు' : 'Quick Auto Hysteresis Test Presets'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handlePreset(4.2)}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  mockDoValue === 4.2
                    ? 'border-[#ef4444] bg-[#fee2e2]/60 font-bold text-[#b91c1c] shadow-xs'
                    : 'border-[#edf1eb] bg-white hover:border-[#ef4444]/40 text-[#153b35]'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>1. Low DO: 4.2 mg/L</span>
                  <span className="text-[10px] bg-[#ef4444] text-white px-2 py-0.5 rounded-full font-bold">
                    Triggers ON
                  </span>
                </div>
                <p className="text-[11px] text-[#6d8176] mt-1">
                  Falls below 5.0 threshold. Auto logic activates aerator.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handlePreset(5.5)}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  mockDoValue === 5.5
                    ? 'border-[#f59e0b] bg-[#fef3c7]/60 font-bold text-[#b45309] shadow-xs'
                    : 'border-[#edf1eb] bg-white hover:border-[#f59e0b]/40 text-[#153b35]'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>2. Buffer: 5.5 mg/L</span>
                  <span className="text-[10px] bg-[#f59e0b] text-white px-2 py-0.5 rounded-full font-bold">
                    Holds State
                  </span>
                </div>
                <p className="text-[11px] text-[#6d8176] mt-1">
                  Inside 5.0–6.0 band. Retains current relay state ({aeratorState}).
                </p>
              </button>

              <button
                type="button"
                onClick={() => handlePreset(6.8)}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  mockDoValue === 6.8
                    ? 'border-[#10b981] bg-[#dcfce7]/60 font-bold text-[#15803d] shadow-xs'
                    : 'border-[#edf1eb] bg-white hover:border-[#10b981]/40 text-[#153b35]'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>3. Healthy: 6.8 mg/L</span>
                  <span className="text-[10px] bg-[#10b981] text-white px-2 py-0.5 rounded-full font-bold">
                    Triggers OFF
                  </span>
                </div>
                <p className="text-[11px] text-[#6d8176] mt-1">
                  Exceeds 6.0 threshold. Auto logic turns aerator off.
                </p>
              </button>
            </div>
          </div>

          {/* Current Automation State Feedback */}
          <div className="rounded-2xl bg-[#153b35] p-4 text-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Zap size={16} className="text-[#d5f36d]" />
              <span>
                System Mode:{' '}
                <strong className="text-[#d5f36d]">{mode}</strong> | Relay Actuator:{' '}
                <strong className={aeratorState === 'ON' ? 'text-[#4ade80]' : 'text-gray-300'}>
                  {aeratorState === 'ON' ? 'RUNNING (GPIO 18 HIGH)' : 'STOPPED (GPIO 18 LOW)'}
                </strong>
              </span>
            </div>

            {mode !== 'AUTO' && onUpdateMode && (
              <button
                type="button"
                onClick={() => onUpdateMode('AUTO')}
                className="rounded-full bg-[#d5f36d] px-3.5 py-1 text-xs font-bold text-[#153b35] hover:bg-[#e4f98d] transition-colors self-start sm:self-auto"
              >
                Switch to AUTO mode
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between text-xs text-[#788d81] bg-[#f9faf7] p-3.5 rounded-2xl border border-[#edf1eb]">
          <span className="flex items-center gap-2">
            <Info size={15} className="text-[#80bd48]" />
            <span>Currently using real ML model prediction from FastAPI backend.</span>
          </span>
          <button
            type="button"
            onClick={handleToggle}
            className="text-[#8b5cf6] font-bold hover:underline"
          >
            Turn on DO slider simulation →
          </button>
        </div>
      )}
    </div>
  )
}
