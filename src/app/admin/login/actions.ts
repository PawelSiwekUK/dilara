"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/src/auth";

export async function authenticate(_state: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: formData.get("rememberMe") === "on" ? "true" : "false",
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return "Unable to sign in. Check your details or try again later.";
    }
    throw error;
  }
}
