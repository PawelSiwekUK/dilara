import type { FieldAccess } from 'payload'

import { checkRole } from '@/src/access/utilities'

export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (user) return checkRole(['admin'], user)

  return false
}
