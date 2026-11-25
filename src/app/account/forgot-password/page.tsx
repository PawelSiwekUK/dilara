import Link from "next/link";

import { AccountForm } from "../account-form";
import { requestPasswordReset } from "../actions";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-4 font-editorial text-3xl">Reset your password</h1>
      <p className="mb-6 text-sm">Enter your email and we&apos;ll send a reset link if an account exists.</p>
      <AccountForm action={requestPasswordReset} kind="email" button="Send reset link" />
      <p className="mt-5 text-sm"><Link className="underline" href="/account/login">Back to sign in</Link></p>
    </>
  );
}
