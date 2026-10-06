export type PortalRole = 'farmer' | 'admin' | 'nerd'

export type PondReading = {
  pondId: string
  temperature: number
  ph: number
  tds: number
  turbidity: number
  dissolvedOxygen: number
  aeratorStatus: 'on' | 'off'
  timestamp: string
}

export type AlertSeverity = 'critical' | 'warning' | 'device' | 'resolved'

export type PondAlert = {
  id: string
  pondId: string
  severity: AlertSeverity
  parameter: string
  message: string
  value: string
  recommendation: string
  timestamp: string
  resolved: boolean
}

export interface DataProvider {
  getPonds(): Promise<string[]>
  getLatestReading(pondId: string): Promise<PondReading>
  getHistory(pondId: string, range: '1h' | '6h' | '24h' | '7d'): Promise<PondReading[]>
  getAlerts(pondId?: string): Promise<PondAlert[]>
  setAerator(pondId: string, enabled: boolean): Promise<PondReading>
}

const baseReadings: Record<string, PondReading> = {
  'Pond 01': { pondId: 'Pond 01', temperature: 28.4, ph: 8.1, tds: 780, turbidity: 12, dissolvedOxygen: 5.8, aeratorStatus: 'on', timestamp: new Date().toISOString() },
  'Pond 02': { pondId: 'Pond 02', temperature: 29.1, ph: 7.9, tds: 812, turbidity: 16, dissolvedOxygen: 5.2, aeratorStatus: 'on', timestamp: new Date().toISOString() },
  'Pond 03': { pondId: 'Pond 03', temperature: 31.4, ph: 8.6, tds: 845, turbidity: 28, dissolvedOxygen: 4.4, aeratorStatus: 'off', timestamp: new Date().toISOString() },
}

export class MockDataProvider implements DataProvider {
  private readings = structuredClone(baseReadings)

  async getPonds() { return Object.keys(this.readings) }
  async getLatestReading(pondId: string) {
    const current = this.readings[pondId] ?? this.readings['Pond 01']
    const drift = (Math.random() - 0.5) * 0.16
    const next = { ...current, temperature: Number((current.temperature + drift).toFixed(1)), dissolvedOxygen: Number(Math.max(3.6, current.dissolvedOxygen + drift).toFixed(1)), timestamp: new Date().toISOString() }
    this.readings[next.pondId] = next
    return next
  }
  async getHistory(pondId: string, range: '1h' | '6h' | '24h' | '7d') { const latest = await this.getLatestReading(pondId); return Array.from({ length: range === '7d' ? 14 : 12 }, (_, index) => ({ ...latest, timestamp: new Date(Date.now() - index * 3600000).toISOString(), temperature: Number((latest.temperature + Math.sin(index) * 0.5).toFixed(1)), dissolvedOxygen: Number((latest.dissolvedOxygen + Math.cos(index) * 0.3).toFixed(1)) })) }
  async getAlerts(pondId?: string) { return Object.values(this.readings).filter((reading) => !pondId || reading.pondId === pondId).flatMap((reading) => reading.dissolvedOxygen < 5 ? [{ id: `do-${reading.pondId}`, pondId: reading.pondId, severity: 'critical' as const, parameter: 'Dissolved oxygen', message: 'Dissolved oxygen is low.', value: `${reading.dissolvedOxygen} mg/L`, recommendation: 'Turn ON aerator.', timestamp: reading.timestamp, resolved: false }] : []) }
  async setAerator(pondId: string, enabled: boolean) { this.readings[pondId] = { ...(this.readings[pondId] ?? baseReadings['Pond 01']), aeratorStatus: enabled ? 'on' : 'off', timestamp: new Date().toISOString() }; return this.readings[pondId] }
}

export class RealDataProvider implements DataProvider {
  async getPonds() { return [] }
  async getLatestReading(_pondId: string): Promise<PondReading> { throw new Error('Backend connection not configured') }
  async getHistory(_pondId: string, _range: '1h' | '6h' | '24h' | '7d'): Promise<PondReading[]> { throw new Error('Backend connection not configured') }
  async getAlerts(_pondId?: string): Promise<PondAlert[]> { throw new Error('Backend connection not configured') }
  async setAerator(_pondId: string, _enabled: boolean): Promise<PondReading> { throw new Error('Backend connection not configured') }
}

export const mockDataProvider = new MockDataProvider()
export const calculateHealth = (reading: PondReading) => Math.max(0, Math.min(100, Math.round(100 - Math.abs(reading.temperature - 28.5) * 4 - Math.abs(reading.ph - 8) * 12 - Math.max(0, 5 - reading.dissolvedOxygen) * 15 - Math.max(0, reading.turbidity - 18) * 0.5)))
export const healthLabel = (score: number) => score >= 80 ? 'HEALTHY' : score >= 60 ? 'ATTENTION' : 'CRITICAL'
