import React from 'react'
import Link from 'next/link'

export const BeforeLogin: React.FC = () => {
  return (
    <div>
      <p>
        <b>Welcome to your dashboard!</b>{' '}
        Admin sign-in is not connected yet. Customers can use the <Link href="/login">store login</Link>{' '}
        once it is connected.
      </p>
    </div>
  )
}
