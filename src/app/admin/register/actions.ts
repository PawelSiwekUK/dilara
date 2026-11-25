"use server";

import { redeemAdminInvitation } from "@/src/lib/auth/admin-invitations";
import type { AccountResult } from "@/src/lib/auth/customer-accounts";

export async function registerAdmin(_state: AccountResult | undefined, formData: FormData) {
  return redeemAdminInvitation(formData);
}
