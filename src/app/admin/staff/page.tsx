import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/src/lib/auth/admin";
import { connectDb } from "@/src/lib/mongoDb";
import { UserModel } from "@/src/lib/mongoDb/users";

import { DemoteForm, InviteForm, OwnerForm, PromoteForm } from "./role-form";

export default async function StaffPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await connectDb();
  const staff = await UserModel.find({ role: { $in: ["owner", "admin"] } }).select({ email: 1, name: 1, role: 1 }).sort({ email: 1 }).lean();
  return (
    <main className="min-h-screen bg-[#f7f6f3] px-4 py-12 text-brand-charcoal">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/admin" className="text-sm underline">Back to administration</Link>
        <h1 className="font-editorial text-4xl">Administrators</h1>
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Current staff</h2>
          <ul className="mt-4 divide-y divide-stone-100">
            {staff.map((member) => (
              <li key={member._id.toHexString()} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  {member.name && <p className="font-medium">{member.name}</p>}
                  <p className="text-sm">{member.email}</p>
                  <p className="text-xs text-stone-500">{member.role === "owner" ? "Owner" : "Administrator"}</p>
                </div>
                {member._id.equals(admin._id)
                  ? <span className="text-sm text-stone-500">Your account</span>
                  : <div className="space-y-2">
                    {member.role === "admin" && <DemoteForm id={member._id.toHexString()} email={member.email} />}
                    {admin.role === "owner" && <OwnerForm id={member._id.toHexString()} email={member.email} isOwner={member.role === "owner"} />}
                  </div>}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Invite a new administrator</h2>
          <p className="mt-2 text-sm text-stone-600">
            Share the one-time link privately with the intended person. Anyone with the link can create
            the account; the email address is not independently verified.
          </p>
          <InviteForm />
        </section>
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Add an administrator</h2>
          <p className="mt-2 text-sm text-stone-600">Enter the email of an existing, verified customer.</p>
          <PromoteForm />
          <p className="mt-4 text-xs text-stone-500">
            Role changes sign the affected user out. A former administrator whose email is not verified
            must verify it through customer registration before signing in as a customer.
          </p>
        </section>
      </div>
    </main>
  );
}
