import Link from "next/link";

import { AccountForm } from "../account-form";
import { completeRegistration } from "../actions";

export default function VerifyPage() {
  return (
    <>
      <h1 className="mb-4 font-editorial text-3xl">Verify your email</h1>
      <p className="mb-6 text-sm">Choose a password with at least 14 characters to finish creating your account.</p>
      <AccountForm action={completeRegistration} kind="password" button="Create account" />
      <p className="mt-5 text-sm"><Link className="underline" href="/account/login">Sign in</Link></p>
    </>
  );
}
