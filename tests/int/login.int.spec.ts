import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AccountForm } from '../../src/app/account/account-form'
import type { AccountResult } from '../../src/lib/auth/customer-accounts'

describe('Customer login form', () => {
  afterEach(cleanup)

  function submitCredentials() {
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'customer@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'example-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
  }

  it('submits the supplied credentials to the login action', async () => {
    const action = vi.fn(async (_state: AccountResult | undefined, _data: FormData) => undefined)
    render(createElement(AccountForm, { action, kind: 'login', button: 'Sign in' }))

    submitCredentials()

    await waitFor(() => expect(action).toHaveBeenCalledOnce())
    const formData = action.mock.calls[0][1]
    expect(formData.get('email')).toBe('customer@example.com')
    expect(formData.get('password')).toBe('example-password')
  })

  it('shows an authentication error and allows another attempt', async () => {
    const action = vi.fn(async () => ({
      ok: false,
      message: 'Unable to sign in. Check your details or try again later.',
    }))
    render(createElement(AccountForm, { action, kind: 'login', button: 'Sign in' }))

    submitCredentials()

    expect((await screen.findByRole('alert')).textContent).toContain('Unable to sign in.')
    expect((screen.getByRole('button', { name: 'Sign in' }) as HTMLButtonElement).disabled).toBe(false)
  })
})
