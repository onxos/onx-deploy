import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/roles";
import PulseClient from "./pulse-client";

export default async function PulsePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?callbackUrl=/pulse");
  }

  return <PulseClient />;
}
