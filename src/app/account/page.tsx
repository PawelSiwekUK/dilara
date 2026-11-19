import { redirect } from "next/navigation";

import { signOut } from "@/src/auth";
import { getCurrentUser } from "@/src/lib/auth/current-user";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "customer") redirect("/account/login");
  return (
    <>
      <h1 className="mb-4 font-editorial text-3xl">Your account</h1>
      <p className="text-sm">{user.email}</p>
      <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
        <button type="submit" className="mt-5 text-sm underline">Sign out</button>
      </form>
    </>
  );
}
