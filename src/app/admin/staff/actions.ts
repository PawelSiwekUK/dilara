"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/src/auth";
import { createAdminInvitation, InvitationError } from "@/src/lib/auth/admin-invitations";
import { changeStaffRole, RoleChangeError } from "@/src/lib/auth/staff";

export type StaffActionResult = { ok: boolean; message: string };
export type InvitationActionResult = StaffActionResult & { token?: string };

export async function inviteAdmin(_state: InvitationActionResult | undefined, formData: FormData): Promise<InvitationActionResult> {
  const session = await auth();
  const id = session?.user?.id;
  const sessionVersion = session?.user?.sessionVersion;
  if (!id || typeof sessionVersion !== "number") {
    return { ok: false, message: "Please sign in as an administrator." };
  }
  const email = formData.get("email");
  if (typeof email !== "string") return { ok: false, message: "Enter an email address." };
  try {
    const token = await createAdminInvitation({ id, sessionVersion }, email);
    return { ok: true, message: "Share this link privately. It expires in 24 hours and works once.", token };
  } catch (error) {
    if (error instanceof InvitationError) return { ok: false, message: error.message };
    throw error;
  }
}

async function changeRole(change: { kind: "promote"; email: string } | { kind: "demote" | "make-owner" | "remove-owner"; id: string }): Promise<StaffActionResult> {
  const session = await auth();
  const id = session?.user?.id;
  const sessionVersion = session?.user?.sessionVersion;
  if (!id || typeof sessionVersion !== "number") {
    return { ok: false, message: "Please sign in as an administrator." };
  }
  try {
    await changeStaffRole({ id, sessionVersion }, change);
  } catch (error) {
    if (error instanceof RoleChangeError) return { ok: false, message: error.message };
    throw error;
  }
  revalidatePath("/admin/staff");
  return {
    ok: true,
    message: change.kind === "promote"
      ? "Administrator access granted. The user must sign in again."
      : change.kind === "demote"
        ? "Administrator access removed. The user must sign in again."
        : "Owner role updated. The user must sign in again.",
  };
}

export async function changeOwnerRole(_state: StaffActionResult | undefined, formData: FormData) {
  const id = formData.get("id");
  const kind = formData.get("kind");
  if (typeof id !== "string" || (kind !== "make-owner" && kind !== "remove-owner")) {
    return { ok: false, message: "Invalid owner role change." };
  }
  return changeRole({ kind, id });
}

export async function promoteCustomer(_state: StaffActionResult | undefined, formData: FormData) {
  const email = formData.get("email");
  if (typeof email !== "string") return { ok: false, message: "Enter a customer email address." };
  return changeRole({ kind: "promote", email: email.trim().toLowerCase() });
}

export async function demoteAdmin(_state: StaffActionResult | undefined, formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false, message: "The administrator could not be found." };
  return changeRole({ kind: "demote", id });
}
