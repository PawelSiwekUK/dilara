import Link from "next/link";

import { AccountForm } from "../account-form";
import { customerSignIn } from "../actions";

export default function CustomerLoginPage() {
  return (
    <>
      <h1 className="mb-6 font-editorial text-3xl">Customer sign in</h1>
      <AccountForm action={customerSignIn} kind="login" button="Sign in" />
      <div className="mt-5 space-y-2 text-sm">
        <p><Link className="underline" href="/account/register">Create an account</Link></p>
        <p><Link className="underline" href="/account/forgot-password">Forgot your password?</Link></p>
      </div>
    </>
  );
}
