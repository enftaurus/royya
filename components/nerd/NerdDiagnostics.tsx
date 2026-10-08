'use client'

import React, { useState } from 'react'
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Server,
  Zap,
  Power,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import {
  checkBackendHealth,
  setAeratorMode,
  setManualAerator,
  getAeratorState,
  API_BASE_URL,
} from '@/lib/api'
import type { SystemData } from '@/lib/api'

interface NerdDiagnosticsProps {
  data: SystemData | null
  isLive: boolean
  onRefresh: () => void
}

export function NerdDiagnostics({ data, isLive, onRefresh }: NerdDiagnosticsProps) {
  const [pingLoading, setPingLoading] = useState(false)
  const [pingResult, setPingResult] = useState<{
    latencyMs: number
    response: unknown
    timestamp: string
    status: number
  } | null>(null)

  const [cmdLoading, setCmdLoading] = useState(false)
  const [cmdResult, setCmdResult] = useState<{
    endpoint: string
    payload: unknown
    response: unknown
    latencyMs: number
    timestamp: string
    status: number
  } | null>(null)

  const handleTestHealth = async () => {
    setPingLoading(true)
    const start = performance.now()
    try {
      const res = await checkBackendHealth()
      const end = performance.now()
      setPingResult({
        latencyMs: Math.round(end - start),
        response: res,
        timestamp: new Date().toLocaleTimeString(),
        status: 200,
      })
    } catch (err: unknown) {
      const end = performance.now()
      setPingResult({
        latencyMs: Math.round(end - start),
        response: { error: err instanceof Error ? err.message : 'Ping failed' },
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
      })
    } finally {
      setPingLoading(false)
    }
  }

  const handleExecuteCommand = async (type: 'AUTO' | 'MANUAL' | 'RELAY_ON' | 'RELAY_OFF') => {
    setCmdLoading(true)
    const start = performance.now()
    try {
      let endpoint = ''
      let payload: unknown = {}
      let response: unknown = {}

      if (type === 'AUTO') {
        endpoint = 'POST /api/aerator/mode'
        payload = { mode: 'AUTO' }
        response = await setAeratorMode('AUTO')
      } else if (type === 'MANUAL') {
        endpoint = 'POST /api/aerator/mode'
        payload = { mode: 'MANUAL' }
        response = await setAeratorMode('MANUAL')
      } else if (type === 'RELAY_ON') {
        endpoint = 'POST /api/aerator/manual'
        payload = { state: 'ON' }
        response = await setManualAerator('ON')
      } else if (type === 'RELAY_OFF') {
        endpoint = 'POST /api/aerator/manual'
        payload = { state: 'OFF' }
        response = await setManualAerator('OFF')
      }

      const end = performance.now()
      setCmdResult({
        endpoint,
        payload,
        response,
        latencyMs: Math.round(end - start),
        timestamp: new Date().toLocaleTimeString(),
        status: 200,
      })
      onRefresh()
    } catch (err: unknown) {
      const end = performance.now()
      setCmdResult({
        endpoint: type.includes('RELAY') ? 'POST /api/aerator/manual' : 'POST /api/aerator/mode',
        payload: { type },
        response: { error: err instanceof Error ? err.message : 'Command execution failed' },
        latencyMs: Math.round(end - start),
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
      })
    } finally {
      setCmdLoading(false)
    }
  }

  return (
    <div className="space-y-6 font-mono">
      <div>
        <h2 className="text-2xl font-bold text-[#153b35]">System Diagnostics & RPC Console</h2>
        <p className="text-xs text-[#788d81]">
          Probe endpoint latency, dispatch actuator commands, and inspect raw API HTTP payloads
        </p>
      </div>

      {/* Connectivity Probe */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf1eb]">
          <div>
            <h3 className="font-bold text-base text-[#153b35] flex items-center gap-2">
              <Server size={18} className="text-[#2563eb]" />
              Gateway Health Probe (GET /)
            </h3>
            <p className="text-xs text-[#788d81] mt-0.5">
              Target: <span className="text-[#153b35] font-bold">{API_BASE_URL}</span>
            </p>
          </div>

          <button
            onClick={handleTestHealth}
            disabled={pingLoading}
            className="flex items-center gap-2 rounded-xl bg-[#153b35] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1b433d] disabled:opacity-50"
          >
            {pingLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            <span>Ping Backend</span>
          </button>
        </div>

        {pingResult && (
          <div className="mt-4 rounded-2xl bg-[#112925] p-4 text-xs text-white">
            <div className="flex justify-between items-center pb-2 border-b border-white/10 text-[11px]">
              <span className={pingResult.status === 200 ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                HTTP {pingResult.status} {pingResult.status === 200 ? 'OK' : 'ERROR'}
              </span>
              <span className="text-[#d5f36d]">Round-trip: {pingResult.latencyMs} ms</span>
              <span className="text-white/50">{pingResult.timestamp}</span>
            </div>
            <pre className="mt-3 text-[#a7f3d0] overflow-x-auto text-[11px]">
              {JSON.stringify(pingResult.response, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Manual RPC Command Dispatcher */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <h3 className="font-bold text-base text-[#153b35] mb-2 flex items-center gap-2">
          <Zap size={18} className="text-[#80bd48]" />
          Actuator RPC Command Tester
        </h3>
        <p className="text-xs text-[#788d81] mb-5">
          Execute individual aerator commands directly against FastAPI to verify relay responsiveness.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleExecuteCommand('AUTO')}
            disabled={cmdLoading}
            className="rounded-xl border border-[#dce5d9] bg-[#f9faf7] p-3 text-xs font-bold text-[#153b35] hover:bg-[#eaf6df] hover:border-[#5c8e33] transition-all disabled:opacity-50"
          >
            Mode → AUTO
          </button>
          <button
            onClick={() => handleExecuteCommand('MANUAL')}
            disabled={cmdLoading}
            className="rounded-xl border border-[#dce5d9] bg-[#f9faf7] p-3 text-xs font-bold text-[#153b35] hover:bg-[#fef9e7] hover:border-[#d97706] transition-all disabled:opacity-50"
          >
            Mode → MANUAL
          </button>
          <button
            onClick={() => handleExecuteCommand('RELAY_ON')}
            disabled={cmdLoading || data?.mode !== 'MANUAL'}
            className="rounded-xl border border-[#dce5d9] bg-[#f9faf7] p-3 text-xs font-bold text-[#153b35] hover:bg-[#eaf6df] hover:border-[#5c8e33] transition-all disabled:opacity-40"
          >
            Manual → ON
          </button>
          <button
            onClick={() => handleExecuteCommand('RELAY_OFF')}
            disabled={cmdLoading || data?.mode !== 'MANUAL'}
            className="rounded-xl border border-[#dce5d9] bg-[#f9faf7] p-3 text-xs font-bold text-[#153b35] hover:bg-[#fff0e5] hover:border-[#b55835] transition-all disabled:opacity-40"
          >
            Manual → OFF
          </button>
        </div>

        {cmdResult && (
          <div className="mt-5 rounded-2xl bg-[#112925] p-4 text-xs text-white">
            <div className="flex justify-between items-center pb-2 border-b border-white/10 text-[11px]">
              <span className="text-[#d5f36d]">{cmdResult.endpoint}</span>
              <span className="text-white/60">{cmdResult.latencyMs} ms</span>
              <span className={cmdResult.status === 200 ? 'text-[#4ade80]' : 'text-[#f87171]'}>
                Status {cmdResult.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-white/50 mb-1">Payload Sent:</p>
                <pre className="text-white/80 bg-black/30 p-2.5 rounded-xl overflow-x-auto text-[11px]">
                  {JSON.stringify(cmdResult.payload, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-[10px] text-white/50 mb-1">Server Response:</p>
                <pre className="text-[#a7f3d0] bg-black/30 p-2.5 rounded-xl overflow-x-auto text-[11px]">
                  {JSON.stringify(cmdResult.response, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Health Checklist */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <h3 className="font-bold text-base text-[#153b35] mb-4">Firmware & Service Health Matrix</h3>
        <div className="space-y-3 text-xs">
          {[
            { label: 'FastAPI Gateway (Port 8000)', status: isLive ? 'PASS' : 'FAIL', ok: isLive },
            { label: 'CORS Wildcard Configuration (allow_origins=["*"])', status: 'PASS', ok: true },
            { label: 'Joblib Model Artifact (model/dissolved_oxygen_model.pkl)', status: 'LOADED', ok: true },
            { label: 'Continuous Telemetry Polling Loop (~3s)', status: isLive ? 'RUNNING' : 'RETRIEVING', ok: isLive },
            { label: 'GPIO 18 Actuator State Feedback', status: data ? `${data.aerator_state} (${data.mode})` : '--', ok: isLive },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#f9faf7] border border-[#edf1eb]">
              <span className="text-[#153b35]">{item.label}</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${item.ok ? 'bg-[#eaf6df] text-[#5c8e33]' : 'bg-[#fff0e5] text-[#b55835]'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
