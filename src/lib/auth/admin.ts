import "server-only";

import { getCurrentUser } from "./current-user";

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin" || user?.role === "owner" ? user : null;
}
