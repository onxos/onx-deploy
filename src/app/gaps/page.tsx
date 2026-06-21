import { redirect } from "next/navigation";
import { getCurrentSession, hasRequiredRole } from "@/server/auth/roles";
import GapsClient from "./gaps-client";

export default async function GapsPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?callbackUrl=/gaps");
  }

  if (!hasRequiredRole(session.user.role, "admin")) {
    redirect("/forbidden");
  }

  return <GapsClient />;
}
