'use client'

import { useTheme } from 'next-themes'
import { useId, useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function ThemeSelector() {
  const { theme, setTheme, forcedTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="mr-2">Theme</label>
      <select
        id={id}
        className="rounded border border-border bg-background px-2 py-1 text-foreground"
        value={mounted ? theme ?? 'system' : ''}
        onChange={(event) => setTheme(event.target.value)}
        disabled={!mounted || Boolean(forcedTheme)}
      >
        <option value="">Loading theme...</option>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}
