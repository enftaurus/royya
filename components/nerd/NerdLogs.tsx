'use client'

import React, { useState } from 'react'
import { Terminal, Trash2, Download, Filter, Search } from 'lucide-react'
import { useSystemLogs, type TelemetryLog } from '@/lib/useTelemetry'

export function NerdLogs() {
  const { logs, clearLogs } = useSystemLogs()
  const [filterType, setFilterType] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'ALL' && log.type !== filterType) return false
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `royya-telemetry-logs-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">System & Event Logs</h2>
          <p className="text-xs text-[#788d81]">
            Real-time event stream tracking HTTP polling, actuator mode switches, and API failures
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-xl border border-[#dce5d9] bg-white px-3.5 py-2 text-xs font-bold text-[#153b35] hover:bg-[#f9faf7]"
          >
            <Download size={13} />
            <span>Export JSON</span>
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 rounded-xl border border-[#f4cbb8] bg-[#fff0e5] px-3.5 py-2 text-xs font-bold text-[#b55835] hover:bg-[#ffe5d9]"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-3.5 text-[#8a9d90]" />
          <input
            type="text"
            placeholder="Search logs by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-[#dce5d9] bg-white pl-9 pr-4 py-2.5 text-xs text-[#153b35] placeholder:text-[#8a9d90] focus:outline-[#153b35]"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-2xl bg-white p-1 border border-[#dce5d9] overflow-x-auto">
          {['ALL', 'POLL', 'MODE_CHANGE', 'MANUAL_RELAY', 'ERROR'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-[#153b35] text-white shadow-xs'
                  : 'text-[#60756e] hover:text-[#153b35]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal View Container */}
      <div className="rounded-3xl border border-[#1b3d36] bg-[#0d211e] p-6 text-white shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/50">
          <span className="flex items-center gap-2 text-[#d5f36d]">
            <Terminal size={14} />
            Live Buffer ({filteredLogs.length} events)
          </span>
          <span>Auto-scrolling stream</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-white/40">
            No events logged matching current filters. Real-time telemetry events will appear here as requests occur.
          </div>
        ) : (
          <div className="mt-4 space-y-2 max-h-[520px] overflow-y-auto pr-2 text-xs">
            {filteredLogs.map((log) => {
              const isErr = log.status === 'ERROR'
              const isMode = log.type === 'MODE_CHANGE'
              const isRelay = log.type === 'MANUAL_RELAY'

              return (
                <div
                  key={log.id}
                  className={`rounded-xl p-3 border leading-relaxed transition-colors ${
                    isErr
                      ? 'border-[#7f1d1d] bg-[#3b1212]/50 text-[#fca5a5]'
                      : isMode || isRelay
                      ? 'border-[#1b4332] bg-[#16382b]/60 text-[#d5f36d]'
                      : 'border-white/5 bg-black/20 text-[#d1fae5]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                    <span className="font-bold text-white/70">[{log.type}]</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="break-all">{log.message}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
