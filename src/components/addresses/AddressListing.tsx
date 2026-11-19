'use client'

import React from 'react'
import { AddressItem } from '@/src/components/addresses/AddressItem'

const addresses: Array<React.ComponentProps<typeof AddressItem>['address'] & { id: string | number }> = []

export const AddressListing: React.FC = () => {
  if (addresses.length === 0) {
    return <p>Address data is not connected yet.</p>
  }

  return (
    <div>
      <ul className="flex flex-col gap-8">
        {addresses.map((address) => (
          <li key={address.id} className="border-b pb-8 last:border-none">
            <AddressItem address={address} />
          </li>
        ))}
      </ul>
    </div>
  )
}
