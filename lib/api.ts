/**
 * Centralized API client for ROYYA WATCH FastAPI Backend.
 * Backend address configured via NEXT_PUBLIC_API_URL.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://10.138.215.133:8000'
).replace(/\/+$/, '')

export type SystemData = {
  temperature: number
  turbidity: number
  dissolved_oxygen: number
  mode: 'AUTO' | 'MANUAL'
  aerator_state: 'ON' | 'OFF'
}

export type AeratorStateResponse = {
  mode: 'AUTO' | 'MANUAL'
  state: 'ON' | 'OFF'
}

export type HealthCheckResponse = {
  message: string
  status: string
}

export class ApiError extends Error {
  status?: number
  isNetworkError: boolean

  constructor(message: string, status?: number, isNetworkError: boolean = false) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isNetworkError = isNetworkError
  }
}

async function request<T>(path: string, options: RequestInit = {}, timeoutMs = 4500): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      let errorMessage = `Server error (${res.status} ${res.statusText})`
      try {
        const errorJson = await res.json()
        if (errorJson && typeof errorJson === 'object') {
          errorMessage = errorJson.detail || errorJson.message || errorMessage
        }
      } catch {
        // Fallback to res.statusText
      }
      throw new ApiError(errorMessage, res.status)
    }

    const data = await res.json()
    return data as T
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof ApiError) {
      throw err
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out connecting to backend', 408, true)
    }

    const message = err instanceof Error ? err.message : 'Unknown network failure'
    throw new ApiError(`Backend unreachable: ${message}`, undefined, true)
  }
}

/**
 * Fetch current system sensor readings and aerator state.
 * GET /api/data
 */
export async function getSystemData(): Promise<SystemData> {
  return request<SystemData>('/api/data')
}

/**
 * Fetch current aerator mode and physical relay state.
 * GET /api/aerator/state
 */
export async function getAeratorState(): Promise<AeratorStateResponse> {
  return request<AeratorStateResponse>('/api/aerator/state')
}

/**
 * Update system aerator mode (AUTO or MANUAL).
 * POST /api/aerator/mode
 */
export async function setAeratorMode(mode: 'AUTO' | 'MANUAL'): Promise<AeratorStateResponse> {
  return request<AeratorStateResponse>('/api/aerator/mode', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  })
}

/**
 * Manually turn aerator ON or OFF.
 * Backend only permits this when mode is MANUAL.
 * POST /api/aerator/manual
 */
export async function setManualAerator(state: 'ON' | 'OFF'): Promise<AeratorStateResponse> {
  return request<AeratorStateResponse>('/api/aerator/manual', {
    method: 'POST',
    body: JSON.stringify({ state }),
  })
}

/**
 * Verify backend root health check.
 * GET /
 */
export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  return request<HealthCheckResponse>('/')
}
