'use client'

import { FormError } from '@/src/components/forms/FormError'
import { FormItem } from '@/src/components/forms/FormItem'
import { Message } from '@/src/components/Message'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
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
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(
    getSafeRedirect({
      fallbackTo: '/account',
      redirectTo: searchParams.get('redirect') ?? '',
    }),
  )
  const { available, login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!available) {
        setError('Authentication is not connected yet.')
        return
      }

      try {
        await login(data)
        router.push(redirect.current)
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [available, login, router],
  )

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      {!available && <p>Authentication is not connected yet.</p>}
      <Message className="classes.message" error={error} />
      <div className="flex flex-col gap-8">
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password', { required: 'Please provide a password.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <div className="text-primary/70 mb-6 prose prose-a:hover:text-primary dark:prose-invert">
          <p>
            Forgot your password?{' '}
            <Link href={`/forgot-password${allParams}`}>Click here to reset it</Link>
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        <Button asChild variant="outline" size="lg">
          <Link href={`/create-account${allParams}`} className="grow max-w-[50%]">
            Create an account
          </Link>
        </Button>
        <Button className="grow" disabled={!available || isLoading} size="lg" type="submit" variant="default">
          {isLoading ? 'Processing' : 'Continue'}
        </Button>
      </div>
    </form>
  )
}
