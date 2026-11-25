import Link from "next/link";

import { AccountForm } from "../account-form";
import { completePasswordReset } from "../actions";

export default function ResetPage() {
  return (
    <>
      <h1 className="mb-4 font-editorial text-3xl">Choose a new password</h1>
      <p className="mb-6 text-sm">Use at least 14 characters.</p>
      <AccountForm action={completePasswordReset} kind="password" button="Reset password" />
      <p className="mt-5 text-sm"><Link className="underline" href="/account/login">Sign in</Link></p>
    </>
  );
}
