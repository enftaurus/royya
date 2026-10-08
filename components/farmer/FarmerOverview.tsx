'use client'

import React from 'react'
import {
  Activity,
  Droplets,
  Power,
  Thermometer,
  Waves,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  Sliders,
} from 'lucide-react'
import { LineChart, type DataPoint } from '@/components/LineChart'
import type { SystemData } from '@/lib/api'

interface FarmerOverviewProps {
  data: SystemData | null
  isLive: boolean
  tempHistory: DataPoint[]
  turbidityHistory: DataPoint[]
  doHistory: DataPoint[]
  controlLoading: boolean
  feedback: { type: 'success' | 'error'; message: string } | null
  onDismissFeedback: () => void
  onUpdateMode: (mode: 'AUTO' | 'MANUAL') => Promise<void>
  onUpdateManualAerator: (state: 'ON' | 'OFF') => Promise<void>
  language: 'EN' | 'తెలుగు'
}

export function FarmerOverview({
  data,
  isLive,
  tempHistory,
  turbidityHistory,
  doHistory,
  controlLoading,
  feedback,
  onDismissFeedback,
  onUpdateMode,
  onUpdateManualAerator,
  language,
}: FarmerOverviewProps) {
  const isTe = language === 'తెలుగు'

  // Oxygen status calculation strictly following backend thresholds:
  // < 5.0: Low oxygen (Aerator ON)
  // 5.0 - 6.0: Recovery / Monitoring zone
  // > 6.0: Healthy
  const dissolvedOxygen = data?.dissolved_oxygen ?? 0
  const oxygenStatus =
    !isLive || !data
      ? { label: isTe ? 'కనెక్ట్ కాలేదు' : 'Offline', badge: 'bg-gray-100 text-gray-600', color: '#95a5a6' }
      : dissolvedOxygen < 5.0
      ? {
          label: isTe ? 'తక్కువ ఆక్సిజన్ (< 5.0)' : 'Low oxygen (< 5.0 mg/L)',
          badge: 'bg-[#fff0e5] text-[#b55835] border border-[#f4cbb8]',
          description: isTe
            ? 'ఆక్సిజన్ 5.0 mg/L కంటే తక్కువగా ఉంది. ఆటో మోడ్‌లో ఎరేటర్ ఆన్‌లో ఉంటుంది.'
            : 'Dissolved oxygen dropped below 5.0 mg/L threshold. Aerator automatically engaged in AUTO mode.',
          severity: 'critical',
          color: '#e74c3c',
        }
      : dissolvedOxygen <= 6.0
      ? {
          label: isTe ? 'రికవరీ / పర్యవేక్షణ (5.0–6.0)' : 'Recovery / Monitoring (5.0–6.0 mg/L)',
          badge: 'bg-[#fef9e7] text-[#9c7414] border border-[#f9e79f]',
          description: isTe
            ? 'ఆక్సిజన్ రికవరీ జోన్‌లో ఉంది (5.0 - 6.0 mg/L). మునుపటి ఎరేటర్ స్థితి కొనసాగుతుంది.'
            : 'Dissolved oxygen in hysteresis band (5.0 - 6.0 mg/L). Preserving previous aerator state.',
          severity: 'warning',
          color: '#f39c12',
        }
      : {
          label: isTe ? 'ఆరోగ్యకరం (> 6.0)' : 'Healthy (> 6.0 mg/L)',
          badge: 'bg-[#eaf6df] text-[#5c8e33] border border-[#cfe6bf]',
          description: isTe
            ? 'ఆక్సిజన్ సాధారణ స్థాయిలో ఉంది (> 6.0 mg/L).'
            : 'Optimal oxygen levels detected. System stable.',
          severity: 'normal',
          color: '#27ae60',
        }

  // Pond health calculation based on live DO and Temp
  const healthScore = !isLive || !data
    ? null
    : dissolvedOxygen >= 6.0 && data.temperature >= 26 && data.temperature <= 32
    ? 94
    : dissolvedOxygen >= 5.0
    ? 78
    : 48

  const aeratorIsRunning = data?.aerator_state === 'ON'
  const isAutoMode = data?.mode === 'AUTO'

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-sm font-semibold transition-all ${
            feedback.type === 'success'
              ? 'bg-[#eaf6df] text-[#366e1d] border border-[#cfe6bf]'
              : 'bg-[#fff0e5] text-[#b55835] border border-[#f4cbb8]'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={18} className="text-[#5c8e33]" />
            ) : (
              <AlertTriangle size={18} className="text-[#b55835]" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={onDismissFeedback}
            className="text-xs underline hover:no-underline"
          >
            {isTe ? 'మూసివేయి' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Hero Pond Status Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 transition-colors border ${
          !isLive
            ? 'bg-gray-100 border-gray-200'
            : healthScore && healthScore < 60
            ? 'bg-[#fff0e5] border-[#f4cbb8]'
            : healthScore && healthScore < 85
            ? 'bg-[#fef9e7] border-[#f9e79f]'
            : 'bg-[#e7f6df] border-[#cfe6bf]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#6c9071]">
                {isTe ? 'చెరువు ఆరోగ్యం · చెరువు 01' : 'Pond health · Pond 01'}
              </span>
              <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-[10px] font-bold text-[#5c8e33]">
                {isLive ? (isTe ? 'లైవ్ రీడింగ్' : 'Live telemetry') : (isTe ? 'ఆఫ్‌లైన్' : 'Offline')}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-5xl sm:text-6xl font-medium tracking-tight text-[#153b35]">
                {healthScore !== null ? healthScore : '--'}
              </p>
              {healthScore !== null && (
                <span className="text-xl sm:text-2xl text-[#8ca38a] font-normal">/100</span>
              )}
            </div>

            <p className="mt-2 text-base font-bold text-[#153b35]">
              {!isLive
                ? (isTe ? 'బ్యాకెండ్ కనెక్షన్ విఫలమైంది' : 'Backend connection offline')
                : healthScore && healthScore >= 85
                ? (isTe ? 'చెరువు ఆరోగ్యంగా ఉంది — సాధారణ పరిస్థితులు' : 'Pond is healthy — Normal conditions')
                : healthScore && healthScore >= 60
                ? (isTe ? 'పర్యవేక్షణ అవసరం — ఆక్సిజన్ రికవరీ జోన్' : 'Pond in recovery zone — Monitor closely')
                : (isTe ? 'శ్రద్ధ వహించండి — తక్కువ కరిగిన ఆక్సిజన్' : 'Attention required — Low dissolved oxygen')}
            </p>
            <p className="mt-1 text-xs text-[#60756e]">
              {oxygenStatus.description || (isTe ? 'తాజా సెన్సార్ డేటా కోసం వేచి ఉంది.' : 'Awaiting sensor updates.')}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
            <div className="rounded-2xl bg-white/80 p-3 shadow-xs">
              <Activity className="text-[#7eb548]" size={26} />
            </div>
            <div className="text-right">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${oxygenStatus.badge}`}>
                {oxygenStatus.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Vital Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs transition-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-[#fff7ed] p-2.5 text-[#ea580c]">
              <Thermometer size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#788d81] uppercase tracking-wider">
              {isTe ? 'ఉష్ణోగ్రత' : 'Temperature'}
            </span>
          </div>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'నీటి ఉష్ణోగ్రత' : 'Water Temperature'}
          </p>
          <p className="mt-1 text-3xl font-bold text-[#153b35]">
            {data ? data.temperature.toFixed(2) : '--'}
            <span className="ml-1 text-sm font-normal text-[#788d81]">°C</span>
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-[#6d9960] font-semibold">
              {data && data.temperature >= 26 && data.temperature <= 32
                ? (isTe ? 'సాధారణం (26–32°C)' : 'Optimal (26–32°C)')
                : (isTe ? 'పరిధి వెలుపల' : 'Outside optimal')}
            </span>
          </div>
        </div>

        {/* Turbidity (Explicitly sensor voltage) */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-[#eff6ff] p-2.5 text-[#2563eb]">
              <Droplets size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#788d81] uppercase tracking-wider">
              {isTe ? 'మడ్డితనం' : 'Turbidity'}
            </span>
          </div>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'సెన్సార్ వోల్టేజ్' : 'Turbidity sensor voltage'}
          </p>
          <p className="mt-1 text-3xl font-bold text-[#153b35]">
            {data ? data.turbidity.toFixed(2) : '--'}
            <span className="ml-1 text-sm font-normal text-[#788d81]">V</span>
          </p>
          <p className="mt-3 text-[10px] text-[#8a9d90] leading-tight">
            {isTe ? 'సెన్సార్ వోల్టేజ్; NTU క్రమాంకనం పెండింగ్‌లో ఉంది.' : 'Sensor voltage; NTU calibration pending.'}
          </p>
        </div>

        {/* Predicted Dissolved Oxygen */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-xl bg-[#ecfdf5] p-2.5 text-[#059669]">
              <Waves size={20} />
            </div>
            <span className="text-[10px] font-bold text-[#788d81] uppercase tracking-wider">
              ML Model
            </span>
          </div>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'అంచనా వేసిన ఆక్సిజన్' : 'Predicted DO'}
          </p>
          <p className="mt-1 text-3xl font-bold text-[#153b35]">
            {data ? data.dissolved_oxygen.toFixed(2) : '--'}
            <span className="ml-1 text-sm font-normal text-[#788d81]">mg/L</span>
          </p>
          <div className="mt-3 flex items-center justify-between text-[10px]">
            <span className={`px-2 py-0.5 rounded-full font-bold ${oxygenStatus.badge}`}>
              {oxygenStatus.label}
            </span>
          </div>
        </div>

        {/* Aerator Status Card */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`rounded-xl p-2.5 ${
                aeratorIsRunning
                  ? 'bg-[#ecfccb] text-[#4d7c0f]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Power size={20} />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isAutoMode
                  ? 'bg-[#e0f2fe] text-[#0369a1]'
                  : 'bg-[#fef3c7] text-[#92400e]'
              }`}
            >
              {data ? data.mode : '--'}
            </span>
          </div>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'ఎరేటర్ స్థితి' : 'Aerator Status'}
          </p>
          <p className="mt-1 text-3xl font-bold text-[#153b35]">
            {data
              ? aeratorIsRunning
                ? (isTe ? 'నడుస్తోంది' : 'RUNNING')
                : (isTe ? 'ఆపివేయబడింది' : 'STOPPED')
              : '--'}
          </p>
          <div className="mt-3 text-[10px] text-[#788d81] flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                aeratorIsRunning ? 'bg-[#84cc16] animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span>
              {isAutoMode
                ? (isTe ? 'ఆటో కంట్రోల్ (ML DO ద్వారా)' : 'Auto controlled (via ML DO)')
                : (isTe ? 'మాన్యువల్ నియంత్రణ' : 'Manual operator control')}
            </span>
          </div>
        </div>
      </div>

      {/* Aerator Control Panel Section */}
      <div className="rounded-3xl border border-[#1b433d] bg-[#153b35] p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d5f36d] text-[#153b35]">
                <Zap size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold">
                {isTe ? 'ఎరేటర్ కంట్రోల్ యూనిట్' : 'Aerator Control Unit'}
              </h2>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-white/70 max-w-xl">
              {isTe
                ? 'ఫాస్ట్‌ఏపీఐ ద్వారా ఈఎస్‌పీ32 రిలే (GPIO 18)ను ఆటోమేటిక్ లేదా మాన్యువల్‌గా నియంత్రించండి.'
                : 'Directly controls physical ESP32 relay (GPIO 18) via FastAPI backend.'}
            </p>
          </div>

          {/* Mode Switch Button Group */}
          <div className="flex items-center gap-2 rounded-2xl bg-black/20 p-1.5 border border-white/10">
            <button
              onClick={() => onUpdateMode('AUTO')}
              disabled={controlLoading || isAutoMode}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isAutoMode
                  ? 'bg-[#d5f36d] text-[#153b35] shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders size={14} />
              <span>{isTe ? 'ఆటో మోడ్' : 'AUTO MODE'}</span>
            </button>
            <button
              onClick={() => onUpdateMode('MANUAL')}
              disabled={controlLoading || !isAutoMode}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                !isAutoMode
                  ? 'bg-[#d5f36d] text-[#153b35] shadow-xs'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Power size={14} />
              <span>{isTe ? 'మాన్యువల్ మోడ్' : 'MANUAL MODE'}</span>
            </button>
          </div>
        </div>

        {/* Mode Specific Controls & Explanation */}
        <div className="mt-6">
          {isAutoMode ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-[#d5f36d] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {isTe ? 'ఆటో మోడ్ సక్రియంగా ఉంది' : 'AUTO MODE ACTIVE'}
                  </h3>
                  <p className="mt-1 text-xs text-white/80 leading-relaxed">
                    {isTe
                      ? 'ఎరేటర్ అంచనా వేసిన కరిగిన ఆక్సిజన్ ద్వారా స్వయంచాలకంగా నియంత్రించబడుతుంది: DO < 5.0 mg/L అయితే ఆన్ అవుతుంది, DO > 6.0 mg/L అయితే ఆఫ్ అవుతుంది.'
                      : 'Aerator is controlled automatically by predicted dissolved oxygen: turns ON when DO < 5.0 mg/L, turns OFF when DO > 6.0 mg/L, with hysteresis preservation between 5.0 and 6.0 mg/L.'}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/90">
                      {isTe ? 'ప్రస్తుత ఆక్సిజన్:' : 'Current DO:'} <strong className="text-[#d5f36d] font-mono">{data ? data.dissolved_oxygen.toFixed(2) : '--'} mg/L</strong>
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/90">
                      {isTe ? 'ఎరేటర్:' : 'Relay state:'} <strong className={aeratorIsRunning ? 'text-[#d5f36d]' : 'text-white/60'}>{data?.aerator_state}</strong>
                    </span>
                    <span className="text-[11px] text-white/50 italic">
                      {isTe ? '(ఆటో మోడ్‌లో మాన్యువల్ బటన్ నిలిపివేయబడింది)' : '(Manual ON/OFF buttons disabled in AUTO mode)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#d5f36d]/30 bg-[#d5f36d]/5 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-[#d5f36d]">
                    {isTe ? 'మాన్యువల్ నియంత్రణ మోడ్' : 'MANUAL OPERATOR MODE'}
                  </h3>
                  <p className="mt-1 text-xs text-white/75">
                    {isTe
                      ? 'ఆటోమేటిక్ ఆక్సిజన్ నియంత్రణ నిలిపివేయబడింది. క్రింది బటన్లను ఉపయోగించి ఎరేటర్‌ను ప్రారంభించండి లేదా ఆపండి.'
                      : 'Automatic ML oxygen control is suspended. You have direct control over the aerator relay.'}
                  </p>
                </div>

                {/* Manual On/Off Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpdateManualAerator('ON')}
                    disabled={controlLoading || aeratorIsRunning}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all ${
                      aeratorIsRunning
                        ? 'bg-[#84cc16] text-[#153b35] opacity-60 cursor-not-allowed'
                        : 'bg-[#d5f36d] text-[#153b35] hover:bg-[#e4f98d] shadow-sm'
                    }`}
                  >
                    {controlLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Power size={14} />
                    )}
                    <span>{isTe ? 'ఎరేటర్ ఆన్ చేయండి' : 'Turn ON Aerator'}</span>
                  </button>

                  <button
                    onClick={() => onUpdateManualAerator('OFF')}
                    disabled={controlLoading || !aeratorIsRunning}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all ${
                      !aeratorIsRunning
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-white text-[#153b35] hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    {controlLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Power size={14} />
                    )}
                    <span>{isTe ? 'ఎరేటర్ ఆఫ్ చేయండి' : 'Turn OFF Aerator'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real Time-series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Line Chart */}
        <LineChart
          data={tempHistory}
          title={isTe ? 'ఉష్ణోగ్రత ట్రెండ్' : 'Temperature Trend'}
          subtitle={isTe ? 'లైవ్ నీటి ఉష్ణోగ్రత' : 'Live water temperature'}
          unit="°C"
          lineColor="#d97706"
          fillGradientStart="rgba(217, 119, 6, 0.22)"
          fillGradientEnd="rgba(217, 119, 6, 0.01)"
          badgeText="Live °C"
        />

        {/* Turbidity Line Chart */}
        <LineChart
          data={turbidityHistory}
          title={isTe ? 'మడ్డితనం ట్రెండ్' : 'Turbidity Trend'}
          subtitle={isTe ? 'సెన్సార్ వోల్టేజ్; NTU క్రమాంకనం పెండింగ్‌లో ఉంది' : 'Sensor voltage; NTU calibration pending.'}
          unit="V"
          lineColor="#2563eb"
          fillGradientStart="rgba(37, 99, 235, 0.22)"
          fillGradientEnd="rgba(37, 99, 235, 0.01)"
          badgeText="Voltage"
        />
      </div>

      {/* Low Oxygen Alert Notice if threshold breached */}
      {dissolvedOxygen < 5.0 && isLive && (
        <div className="rounded-2xl border border-[#f0c2a8] bg-[#fff2e9] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-[#c67a4d] shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-sm text-[#a95a35]">
                  {isTe ? 'హెచ్చరిక: కరిగిన ఆక్సిజన్ తక్కువగా ఉంది' : 'Oxygen Alert: Dissolved oxygen below 5.0 mg/L'}
                </p>
                <p className="mt-1 text-xs text-[#8b6c5a] leading-relaxed">
                  {isTe
                    ? `మోడల్ ప్రిడిక్షన్: ${dissolvedOxygen.toFixed(2)} mg/L. ఆటో మోడ్‌లో ఎరేటర్ స్వయంచాలకంగా ప్రారంభించబడింది. నీటి ప్రవాహాన్ని మరియు రొయ్యల కదలికను తనిఖీ చేయండి.`
                    : `Current predicted DO is ${dissolvedOxygen.toFixed(2)} mg/L. Aerator is running to restore safe oxygen levels. Please inspect pond surface.`}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#f4cbb8] px-3 py-1 text-xs font-bold text-[#a95a35] whitespace-nowrap">
              {isTe ? 'పరిశీలించండి' : 'Action taken'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
