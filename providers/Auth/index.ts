'use client'

type AuthUser = {
  id: string | number
  email: string
  name?: string
}

type AuthState = {
  available: boolean
  user: AuthUser | null | undefined
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: AuthUser | null) => void
}

const auth: AuthState = {
  available: false,
  user: undefined,
  login: async () => {
    throw new Error('Authentication is not connected yet.')
  },
  logout: async () => {
    throw new Error('Authentication is not connected yet.')
  },
  setUser: () => {
    throw new Error('Authentication is not connected yet.')
  },
}

export const useAuth = () => auth
