'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSafeRedirect } from 'payload/shared'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const redirect = useRef(
    getSafeRedirect({
      fallbackTo: '/',
      redirectTo: searchParams.get('redirect') ?? '',
    }),
  )
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      try {
        await login(data)
        router.push(redirect.current)
        router.refresh()
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div role="alert">
        <Message error={error} />
      </div>
      <div className="flex flex-col gap-8">
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

      </div>

      <div className="mt-8 flex">
        <Button className="grow" disabled={isSubmitting} size="lg" type="submit" variant="default">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  )
}
