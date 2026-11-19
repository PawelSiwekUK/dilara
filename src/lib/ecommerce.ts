import type { Address, Cart } from '@/payload-types'

const notConnected = () => Promise.reject(new Error('Ecommerce is not connected yet.'))

const cart: {
  available: boolean
  cart: Cart | null
  isLoading: boolean
  addItem: (...args: unknown[]) => Promise<unknown>
  removeItem: (...args: unknown[]) => Promise<unknown>
  incrementItem: (...args: unknown[]) => Promise<unknown>
  decrementItem: (...args: unknown[]) => Promise<unknown>
  clearCart: (...args: unknown[]) => Promise<unknown>
} = {
  available: false,
  cart: null,
  isLoading: false,
  addItem: notConnected,
  removeItem: notConnected,
  incrementItem: notConnected,
  decrementItem: notConnected,
  clearCart: notConnected,
}

const addresses: {
  available: boolean
  addresses: Address[] | null
  createAddress: (...args: unknown[]) => Promise<unknown>
  updateAddress: (...args: unknown[]) => Promise<unknown>
} = {
  available: false,
  addresses: null,
  createAddress: notConnected,
  updateAddress: notConnected,
}

const payments: {
  available: boolean
  initiatePayment: (...args: unknown[]) => Promise<unknown>
  confirmOrder: (...args: unknown[]) => Promise<unknown>
} = {
  available: false,
  initiatePayment: notConnected,
  confirmOrder: notConnected,
}

const currency: {
  available: boolean
  currency: { code: string } | null
  supportedCurrencies: Array<{ code: string }>
  formatCurrency: (amount: number, options?: { currency?: { code: string } }) => string
} = {
  available: false,
  currency: null,
  supportedCurrencies: [],
  formatCurrency: () => {
    throw new Error('Currency formatting is not connected yet.')
  },
}

export const defaultCountries: Array<string | { value: string; label: string }> = []

export const useCart = () => cart
export const useAddresses = () => addresses
export const usePayments = () => payments
export const useCurrency = () => currency
