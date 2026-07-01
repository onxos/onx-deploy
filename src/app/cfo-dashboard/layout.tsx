import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/roles";

export default async function CfoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return <>{children}</>;
}
