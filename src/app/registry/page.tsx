import { redirect } from "next/navigation";
import { getCurrentSession, hasRequiredRole } from "@/server/auth/roles";
import RegistryClient from "./registry-client";

export default async function RegistryPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?callbackUrl=/registry");
  }

  if (!hasRequiredRole(session.user.role, "admin")) {
    redirect("/forbidden");
  }

  return <RegistryClient />;
}
