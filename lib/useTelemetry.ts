'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  getSystemData,
  setAeratorMode,
  setManualAerator,
  type SystemData,
  ApiError,
} from './api'
import type { DataPoint } from '@/components/LineChart'

export interface TelemetryLog {
  id: string
  timestamp: string
  type: 'POLL' | 'MODE_CHANGE' | 'MANUAL_RELAY' | 'ERROR' | 'HEALTH_CHECK'
  message: string
  status: 'SUCCESS' | 'ERROR' | 'INFO'
  details?: Record<string, unknown>
}

// Global shared rolling logs for the session
let globalLogs: TelemetryLog[] = []
const logListeners = new Set<(logs: TelemetryLog[]) => void>()

function addLog(entry: Omit<TelemetryLog, 'id'>) {
  const newLog: TelemetryLog = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  }
  globalLogs = [newLog, ...globalLogs].slice(0, 100)
  logListeners.forEach((listener) => listener(globalLogs))
}

export function useSystemLogs() {
  const [logs, setLogs] = useState<TelemetryLog[]>(() => globalLogs)

  useEffect(() => {
    logListeners.add(setLogs)
    return () => {
      logListeners.delete(setLogs)
    }
  }, [])

  const clearLogs = useCallback(() => {
    globalLogs = []
    logListeners.forEach((l) => l(globalLogs))
  }, [])

  return { logs, clearLogs }
}

const MAX_HISTORY = 45
let globalTempHistory: DataPoint[] = []
let globalTurbidityHistory: DataPoint[] = []
let globalDoHistory: DataPoint[] = []

export function useTelemetry(pollingIntervalMs = 3000) {
  const [data, setData] = useState<SystemData | null>(null)
  const [isLive, setIsLive] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const [tempHistory, setTempHistory] = useState<DataPoint[]>(() => globalTempHistory)
  const [turbidityHistory, setTurbidityHistory] = useState<DataPoint[]>(() => globalTurbidityHistory)
  const [doHistory, setDoHistory] = useState<DataPoint[]>(() => globalDoHistory)

  const [controlLoading, setControlLoading] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const isMounted = useRef(true)

  const fetchData = useCallback(async (isManualTrigger = false) => {
    if (isManualTrigger) setIsReconnecting(true)

    try {
      const result = await getSystemData()
      if (!isMounted.current) return

      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      setData(result)
      setIsLive(true)
      setIsLoading(false)
      setIsReconnecting(false)
      setLastUpdated(timeStr)
      setError(null)

      // Append to rolling history
      const newTempPoint: DataPoint = { timestamp: timeStr, value: result.temperature }
      const newTurbPoint: DataPoint = { timestamp: timeStr, value: result.turbidity }
      const newDoPoint: DataPoint = { timestamp: timeStr, value: result.dissolved_oxygen }

      globalTempHistory = [...globalTempHistory, newTempPoint].slice(-MAX_HISTORY)
      globalTurbidityHistory = [...globalTurbidityHistory, newTurbPoint].slice(-MAX_HISTORY)
      globalDoHistory = [...globalDoHistory, newDoPoint].slice(-MAX_HISTORY)

      setTempHistory(globalTempHistory)
      setTurbidityHistory(globalTurbidityHistory)
      setDoHistory(globalDoHistory)

      // Add log if manual or state change
      if (isManualTrigger) {
        addLog({
          timestamp: timeStr,
          type: 'POLL',
          message: `GET /api/data -> 200 OK (Temp: ${result.temperature}°C, Turbidity: ${result.turbidity}V, DO: ${result.dissolved_oxygen} mg/L, Mode: ${result.mode}, Relay: ${result.aerator_state})`,
          status: 'SUCCESS',
        })
      }
    } catch (err: unknown) {
      if (!isMounted.current) return
      setIsLive(false)
      setIsLoading(false)
      setIsReconnecting(false)

      const errMsg = err instanceof ApiError ? err.message : 'Backend unreachable'
      setError(errMsg)

      const timeStr = new Date().toLocaleTimeString()
      addLog({
        timestamp: timeStr,
        type: 'ERROR',
        message: `GET /api/data failed: ${errMsg}`,
        status: 'ERROR',
      })
    }
  }, [])

  // Periodic Polling
  useEffect(() => {
    isMounted.current = true
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, pollingIntervalMs)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [fetchData, pollingIntervalMs])

  // Aerator Mode Switch
  const updateMode = async (newMode: 'AUTO' | 'MANUAL') => {
    setControlLoading(true)
    setFeedback(null)

    try {
      const response = await setAeratorMode(newMode)
      const timeStr = new Date().toLocaleTimeString()

      addLog({
        timestamp: timeStr,
        type: 'MODE_CHANGE',
        message: `POST /api/aerator/mode {"mode":"${newMode}"} -> ${response.mode} (State: ${response.state})`,
        status: 'SUCCESS',
      })

      setFeedback({
        type: 'success',
        message: `Switched system mode to ${newMode}. Aerator is now ${response.state}.`,
      })

      // Fetch fresh state immediately
      await fetchData(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to change mode'
      setFeedback({
        type: 'error',
        message: `Failed to set mode: ${message}`,
      })
      addLog({
        timestamp: new Date().toLocaleTimeString(),
        type: 'ERROR',
        message: `POST /api/aerator/mode failed: ${message}`,
        status: 'ERROR',
      })
    } finally {
      setControlLoading(false)
    }
  }

  // Aerator Manual Control
  const updateManualAerator = async (state: 'ON' | 'OFF') => {
    if (data?.mode !== 'MANUAL') {
      setFeedback({
        type: 'error',
        message: 'Cannot manually control aerator while in AUTO mode.',
      })
      return
    }

    setControlLoading(true)
    setFeedback(null)

    try {
      const response = await setManualAerator(state)
      const timeStr = new Date().toLocaleTimeString()

      addLog({
        timestamp: timeStr,
        type: 'MANUAL_RELAY',
        message: `POST /api/aerator/manual {"state":"${state}"} -> Aerator is ${response.state}`,
        status: 'SUCCESS',
      })

      setFeedback({
        type: 'success',
        message: `Aerator turned ${state}. Relay state updated.`,
      })

      // Fetch fresh state immediately
      await fetchData(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to change aerator state'
      setFeedback({
        type: 'error',
        message: `Failed: ${message}`,
      })
      addLog({
        timestamp: new Date().toLocaleTimeString(),
        type: 'ERROR',
        message: `POST /api/aerator/manual failed: ${message}`,
        status: 'ERROR',
      })
    } finally {
      setControlLoading(false)
    }
  }

  const dismissFeedback = () => setFeedback(null)

  return {
    data,
    isLive,
    isLoading,
    isReconnecting,
    lastUpdated,
    error,
    tempHistory,
    turbidityHistory,
    doHistory,
    controlLoading,
    feedback,
    dismissFeedback,
    updateMode,
    updateManualAerator,
    refreshData: () => fetchData(true),
  }
}
