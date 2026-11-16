import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginForm } from '@/components/forms/LoginForm'

const { login, push, refresh } = vi.hoisted(() => ({
  login: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}))

vi.mock('@/providers/Auth', () => ({
  useAuth: () => ({ login }),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('Customer login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(cleanup)

  const submitCredentials = () => {
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'customer@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'example-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
  }

  it('authenticates through the shared provider and returns to the home page', async () => {
    login.mockResolvedValue({ id: 'customer' })
    render(createElement(LoginForm))

    submitCredentials()

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'customer@example.com',
        password: 'example-password',
      })
      expect(push).toHaveBeenCalledWith('/')
      expect(refresh).toHaveBeenCalledOnce()
    })
  })

  it('shows failed authentication without navigating away', async () => {
    login.mockRejectedValue(new Error('Invalid login'))
    render(createElement(LoginForm))

    submitCredentials()

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain(
        'There was an error with the credentials provided.',
      )
    })
    expect(push).not.toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
  })
})
