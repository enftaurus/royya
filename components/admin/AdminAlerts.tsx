'use client'

import React, { useState } from 'react'
import { AlertTriangle, Bell, CheckCircle2, ShieldAlert, Waves, Check } from 'lucide-react'
import type { SystemData } from '@/lib/api'

interface AdminAlertsProps {
  data: SystemData | null
  isLive: boolean
}

export function AdminAlerts({ data, isLive }: AdminAlertsProps) {
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({})

  const toggleAck = (id: string) => {
    setAcknowledged((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const alerts = []

  if (!isLive) {
    alerts.push({
      id: 'cluster-offline',
      title: 'FastAPI Telemetry Gateway Unreachable',
      severity: 'CRITICAL',
      source: 'Backend Gateway',
      target: 'Pond 01 / ESP32-001',
      description: 'HTTP connection to http://10.138.215.133:8000 timed out or refused. Telemetry pipeline interrupted.',
      time: 'Immediate',
    })
  }

  if (data && data.dissolved_oxygen < 5.0) {
    alerts.push({
      id: 'cluster-do-low',
      title: 'Dissolved Oxygen Below Safe Threshold',
      severity: 'CRITICAL',
      source: 'ML Inference Engine',
      target: 'Pond 01',
      description: `Predicted DO dropped to ${data.dissolved_oxygen.toFixed(2)} mg/L (Threshold: 5.0 mg/L). Automated hysteresis loop engaged aerator ON.`,
      time: 'Active Telemetry',
    })
  }

  if (data && data.turbidity > 3.5) {
    alerts.push({
      id: 'cluster-turb-high',
      title: 'High Turbidity Sensor Voltage',
      severity: 'WARNING',
      source: 'ADC Pin 34',
      target: 'Pond 01',
      description: `Analog turbidity voltage is elevated at ${data.turbidity.toFixed(2)}V. Water column clarity reduced.`,
      time: 'Active Telemetry',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#153b35]">Cluster Operations Alerts</h2>
        <p className="text-xs text-[#788d81]">
          System-wide telemetry alarms, severity escalation, and acknowledgement center
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-3xl border border-[#cfe6bf] bg-white p-8 text-center shadow-xs">
          <CheckCircle2 size={36} className="mx-auto text-[#5c8e33]" />
          <h3 className="mt-3 text-lg font-bold text-[#153b35]">System Operating Within Thresholds</h3>
          <p className="mt-1 text-xs text-[#788d81]">
            No critical or warning alerts triggered across active telemetry streams.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((al) => {
            const isAck = acknowledged[al.id]
            const isCrit = al.severity === 'CRITICAL'

            return (
              <div
                key={al.id}
                className={`rounded-3xl border p-6 transition-all ${
                  isAck
                    ? 'border-[#cfe6bf] bg-[#f9faf7] opacity-80'
                    : isCrit
                    ? 'border-[#f2c5af] bg-[#fff5f0]'
                    : 'border-[#f9e79f] bg-[#fefdf8]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`rounded-2xl p-3 shrink-0 ${
                        isCrit ? 'bg-[#fee4d7] text-[#c0392b]' : 'bg-[#fef3c7] text-[#d97706]'
                      }`}
                    >
                      <AlertTriangle size={22} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isCrit ? 'bg-[#ffded2] text-[#c0392b]' : 'bg-[#fef3c7] text-[#b45309]'
                          }`}
                        >
                          {al.severity}
                        </span>
                        <span className="text-xs text-[#8a9d90] font-mono">{al.source}</span>
                        <span className="text-xs text-[#8a9d90]">· {al.target}</span>
                      </div>

                      <h4 className="mt-1.5 text-base font-bold text-[#153b35]">{al.title}</h4>
                      <p className="mt-1 text-xs text-[#60756e] leading-relaxed">{al.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAck(al.id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all self-start sm:self-auto ${
                      isAck
                        ? 'bg-[#eaf6df] text-[#5c8e33] border border-[#cfe6bf]'
                        : 'bg-[#153b35] text-white hover:bg-[#1b433d]'
                    }`}
                  >
                    {isAck ? <Check size={13} /> : null}
                    <span>{isAck ? 'Acknowledged' : 'Acknowledge'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
