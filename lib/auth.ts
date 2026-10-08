/**
 * Client-side Authentication & Role-Based Access Control for ROYYA WATCH prototype.
 * Uses localStorage session persistence with demo credentials.
 */

export type Role = 'farmer' | 'admin' | 'nerd'

export interface AuthUser {
  username: string
  role: Role
  name: string
  title: string
}

const STORAGE_KEY = 'royya_watch_user'

export const DEMO_CREDENTIALS: Record<string, { password: string; role: Role; name: string; title: string }> = {
  farmer: {
    password: 'farmer123',
    role: 'farmer',
    name: 'Ravi Kumar',
    title: 'Shrimp Pond Farmer',
  },
  admin: {
    password: 'admin123',
    role: 'admin',
    name: 'Operations Admin',
    title: 'Cluster Operations Lead',
  },
  nerd: {
    password: 'nerd123',
    role: 'nerd',
    name: 'Field Engineer',
    title: 'IoT & Telemetry Engineer',
  },
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function hasRole(role: Role): boolean {
  const user = getCurrentUser()
  return user?.role === role
}

export function login(usernameInput: string, passwordInput: string): {
  success: boolean
  user?: AuthUser
  error?: string
} {
  const username = usernameInput.trim().toLowerCase()
  const password = passwordInput.trim()

  const entry = DEMO_CREDENTIALS[username]
  if (!entry || entry.password !== password) {
    return {
      success: false,
      error: 'Invalid username or password.',
    }
  }

  const user: AuthUser = {
    username,
    role: entry.role,
    name: entry.name,
    title: entry.title,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }

  return {
    success: true,
    user,
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function getPortalRoute(role: Role): string {
  switch (role) {
    case 'farmer':
      return '/farmer'
    case 'admin':
      return '/admin'
    case 'nerd':
      return '/nerd'
    default:
      return '/login'
  }
}
