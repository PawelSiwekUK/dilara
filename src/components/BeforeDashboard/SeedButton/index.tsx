'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import './index.scss'

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/next/seed', { method: 'POST', credentials: 'include' })
      if (!response.ok) {
        throw new Error(
          response.status === 503
            ? 'Database seeding is not connected.'
            : `Database seeding failed (${response.status}).`,
        )
      }
      setSeeded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Database seeding failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="seedButton" disabled={loading || seeded} onClick={handleClick} type="button">
        Seed your database
      </button>
      <span role="status" aria-live="polite">
        {loading && ' (seeding...)'}
        {seeded && (
          <>
            {' Database seeded! You can now '}
            <Link href="/">visit your website</Link>.
          </>
        )}
        {error && ` (${error})`}
      </span>
    </>
  )
}
