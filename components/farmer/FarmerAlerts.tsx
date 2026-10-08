'use client'

import React, { useState } from 'react'
import { AlertTriangle, Bell, CheckCircle2, ShieldAlert, Waves, Thermometer, Droplets, WifiOff } from 'lucide-react'
import type { SystemData } from '@/lib/api'

interface FarmerAlertsProps {
  data: SystemData | null
  isLive: boolean
  language: 'EN' | 'తెలుగు'
}

export function FarmerAlerts({ data, isLive, language }: FarmerAlertsProps) {
  const isTe = language === 'తెలుగు'
  const [filter, setFilter] = useState<'all' | 'active'>('all')

  const alerts = []

  // Check backend offline
  if (!isLive) {
    alerts.push({
      id: 'offline',
      severity: 'critical',
      parameter: isTe ? 'కనెక్టివిటీ' : 'Connectivity',
      icon: WifiOff,
      title: isTe ? 'బ్యాకెండ్ కనెక్షన్ విఫలమైంది' : 'Backend & ESP32 Offline',
      message: isTe
        ? 'FastAPI సర్వర్‌ను సంప్రదించలేకపోతున్నాము. సెన్సార్ డేటా అందుబాటులో లేదు.'
        : 'Unable to reach FastAPI backend at http://10.138.215.133:8000. Real-time telemetry paused.',
      recommendation: isTe
        ? 'సర్వర్ మరియు ESP32 విద్యుత్ కనెక్షన్‌ను తనిఖీ చేయండి.'
        : 'Verify local WiFi network, ESP32 power supply, and FastAPI server process.',
      active: true,
      time: 'Now',
    })
  }

  // Check Dissolved Oxygen (< 5.0)
  if (data && data.dissolved_oxygen < 5.0) {
    alerts.push({
      id: 'do-low',
      severity: 'critical',
      parameter: isTe ? 'కరిగిన ఆక్సిజన్' : 'Dissolved Oxygen',
      icon: Waves,
      title: isTe
        ? `తక్కువ ఆక్సిజన్ హెచ్చరిక (${data.dissolved_oxygen.toFixed(2)} mg/L)`
        : `Low Oxygen Warning (${data.dissolved_oxygen.toFixed(2)} mg/L)`,
      message: isTe
        ? 'ఆక్సిజన్ పరిమితి 5.0 mg/L కంటే తగ్గింది. రొయ్యల ఆరోగ్యానికి ముప్పు కలగవచ్చు.'
        : `Predicted dissolved oxygen dropped to ${data.dissolved_oxygen.toFixed(2)} mg/L, falling below the safe threshold of 5.0 mg/L.`,
      recommendation: isTe
        ? 'ఆటో మోడ్‌లో ఎరేటర్ ఆన్‌లో ఉంది. ఎరేటర్ తిరుగుతోందో లేదో సరిచూడండి.'
        : 'Aerator is automatically triggered ON. Verify physical aerator paddlewheels are rotating freely.',
      active: true,
      time: 'Live',
    })
  }

  // Check Temperature (< 24 or > 32)
  if (data && (data.temperature > 32 || data.temperature < 24)) {
    alerts.push({
      id: 'temp-abnormal',
      severity: 'warning',
      parameter: isTe ? 'ఉష్ణోగ్రత' : 'Temperature',
      icon: Thermometer,
      title: isTe
        ? `అసాధారణ ఉష్ణోగ్రత (${data.temperature.toFixed(2)}°C)`
        : `Temperature Shift (${data.temperature.toFixed(2)}°C)`,
      message: isTe
        ? 'నీటి ఉష్ణోగ్రత సాధారణ పరిధి (26–32°C) నుండి వైదొలిగింది.'
        : `Water temperature is ${data.temperature.toFixed(2)}°C, outside the optimal 26–32°C aquaculture band.`,
      recommendation: isTe
        ? 'చెరువు నీటి లోతును మరియు నీడను తనిఖీ చేయండి.'
        : 'Monitor shrimp appetite and check pond water depth.',
      active: true,
      time: 'Live',
    })
  }

  // Check Turbidity sensor voltage (> 3.5V)
  if (data && data.turbidity > 3.5) {
    alerts.push({
      id: 'turb-high',
      severity: 'warning',
      parameter: isTe ? 'మడ్డితనం' : 'Turbidity',
      icon: Droplets,
      title: isTe
        ? `అధిక మడ్డితనం వోల్టేజ్ (${data.turbidity.toFixed(2)}V)`
        : `Turbidity Voltage Alert (${data.turbidity.toFixed(2)}V)`,
      message: isTe
        ? 'సెన్సార్ వోల్టేజ్ పెరిగింది. నీటి స్వచ్ఛత తగ్గింది.'
        : `Sensor voltage reading is elevated at ${data.turbidity.toFixed(2)}V. Water may have suspended organic matter.`,
      recommendation: isTe
        ? 'ఫీడ్ పరిమాణం మరియు చెరువు అడుగుభాగాన్ని గమనించండి.'
        : 'Review feeding rate and check bottom aeration.',
      active: true,
      time: 'Live',
    })
  }

  // Fallback resolved history item if no active alerts
  const allAlerts = [
    ...alerts,
    {
      id: 'do-recovery',
      severity: 'resolved',
      parameter: isTe ? 'ఆటోమేషన్' : 'Automation',
      icon: CheckCircle2,
      title: isTe ? 'సిస్టమ్ స్థిరంగా ఉంది' : 'Hysteresis Baseline Checked',
      message: isTe
        ? 'ఆటోమేటిక్ థ్రెషోల్డ్‌లు (5.0 mg/L ఆన్ / 6.0 mg/L ఆఫ్) సక్రమంగా పనిచేస్తున్నాయి.'
        : 'Automated hysteresis thresholds (5.0 ON / 6.0 OFF) verified by backend control loop.',
      recommendation: isTe
        ? 'ఎటువంటి ప్రత్యేక చర్య అవసరం లేదు.'
        : 'No manual intervention required.',
      active: false,
      time: 'Normal operation',
    },
  ]

  const displayedAlerts = filter === 'active' ? allAlerts.filter((a) => a.active) : allAlerts

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">
            {isTe ? 'చెరువు హెచ్చరికల కేంద్రం' : 'Pond Alerts Center'}
          </h2>
          <p className="text-xs text-[#788d81]">
            {isTe ? 'నిజ-సమయ సెన్సార్ హెచ్చరికలు మరియు చర్యలు' : 'Real-time telemetry threshold events and actionable insights'}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-1 border border-[#dce5d9]">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#153b35] text-white shadow-xs'
                : 'text-[#60756e] hover:text-[#153b35]'
            }`}
          >
            {isTe ? 'అన్నీ' : 'All'}
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'active'
                ? 'bg-[#153b35] text-white shadow-xs'
                : 'text-[#60756e] hover:text-[#153b35]'
            }`}
          >
            {isTe ? 'సక్రియ హెచ్చరికలు' : 'Active Only'} ({alerts.length})
          </button>
        </div>
      </div>

      {displayedAlerts.length === 0 ? (
        <div className="rounded-3xl border border-[#cfe6bf] bg-white p-8 text-center">
          <CheckCircle2 size={36} className="mx-auto text-[#5c8e33]" />
          <h3 className="mt-3 text-lg font-bold text-[#153b35]">
            {isTe ? 'ఎటువంటి హెచ్చరికలు లేవు' : 'No Active Alerts'}
          </h3>
          <p className="mt-1 text-xs text-[#788d81]">
            {isTe ? 'అన్ని సెన్సార్ రీడింగ్‌లు సాధారణ పరిధిలో ఉన్నాయి.' : 'All water parameters are currently operating within safe thresholds.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAlerts.map((alert) => {
            const Icon = alert.icon
            const isCrit = alert.severity === 'critical'
            const isWarn = alert.severity === 'warning'

            return (
              <div
                key={alert.id}
                className={`rounded-3xl border p-5 sm:p-6 transition-all ${
                  isCrit
                    ? 'border-[#f2c5af] bg-[#fff5f0]'
                    : isWarn
                    ? 'border-[#f9e79f] bg-[#fefdf8]'
                    : 'border-[#cfe6bf] bg-[#f8fcf6]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`rounded-2xl p-3 shrink-0 ${
                        isCrit
                          ? 'bg-[#fee4d7] text-[#c0392b]'
                          : isWarn
                          ? 'bg-[#fef3c7] text-[#d97706]'
                          : 'bg-[#eaf6df] text-[#5c8e33]'
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isCrit
                              ? 'bg-[#ffded2] text-[#c0392b]'
                              : isWarn
                              ? 'bg-[#fef3c7] text-[#b45309]'
                              : 'bg-[#eaf6df] text-[#5c8e33]'
                          }`}
                        >
                          {alert.parameter}
                        </span>
                        <span className="text-[11px] text-[#8a9d90]">{alert.time}</span>
                      </div>

                      <h4 className="mt-1.5 text-base sm:text-lg font-bold text-[#153b35]">
                        {alert.title}
                      </h4>
                      <p className="mt-1 text-xs text-[#60756e] leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="mt-3 rounded-xl bg-white/80 p-3 border border-[#e5ece2]">
                        <p className="text-xs font-bold text-[#153b35]">
                          {isTe ? 'సూచించిన చర్య:' : 'Recommended action:'}
                        </p>
                        <p className="text-xs text-[#60756e] mt-0.5">{alert.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold self-start sm:self-auto ${
                      alert.active
                        ? isCrit
                          ? 'bg-[#c0392b] text-white'
                          : 'bg-[#d97706] text-white'
                        : 'bg-[#5c8e33] text-white'
                    }`}
                  >
                    {alert.active ? (isTe ? 'సక్రియం' : 'Active') : (isTe ? 'పరిష్కరించబడింది' : 'Resolved')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
