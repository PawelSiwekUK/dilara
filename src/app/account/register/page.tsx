import Link from "next/link";

import { AccountForm } from "../account-form";
import { requestRegistration } from "../actions";

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-4 font-editorial text-3xl">Create an account</h1>
      <p className="mb-6 text-sm">We&apos;ll email you a link to verify your address and set your password.</p>
      <AccountForm action={requestRegistration} kind="email" button="Send verification link" />
      <p className="mt-5 text-sm"><Link className="underline" href="/account/login">Already have an account? Sign in</Link></p>
    </>
  );
}
