"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/src/auth";
import {
  AccountEmailError,
  completeAccountToken,
  requestAccountEmail,
  type AccountResult,
} from "@/src/lib/auth/customer-accounts";

export async function customerSignIn(_state: AccountResult | undefined, formData: FormData) {
  try {
    await signIn("customer", {
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: formData.get("rememberMe") === "on" ? "true" : "false",
      redirectTo: "/account",
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { ok: false, message: "Unable to sign in. Check your details or try again later." };
    }
    throw error;
  }
}

async function requestEmail(purpose: "register" | "reset", formData: FormData) {
  try {
    return await requestAccountEmail(purpose, formData);
  } catch (error) {
    if (error instanceof AccountEmailError) {
      console.error("Customer account email error:", error.message);
      return { ok: false, message: "Email service is unavailable. Please try again later." };
    }
    throw error;
  }
}

export async function requestRegistration(_state: AccountResult | undefined, formData: FormData) {
  return requestEmail("register", formData);
}

export async function requestPasswordReset(_state: AccountResult | undefined, formData: FormData) {
  return requestEmail("reset", formData);
}

export async function completeRegistration(_state: AccountResult | undefined, formData: FormData) {
  return completeAccountToken("register", formData);
}

export async function completePasswordReset(_state: AccountResult | undefined, formData: FormData) {
  return completeAccountToken("reset", formData);
}
