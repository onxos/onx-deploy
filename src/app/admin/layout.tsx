import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession, hasRequiredRole } from "@/server/auth/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!hasRequiredRole(session.user.role, "admin")) {
    redirect("/forbidden");
  }

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <header className="border-b border-[#e6dfcf] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">
              ONX Admin
            </p>
            <h1 className="text-2xl font-bold text-[#1e2d3d]">
              Civilization Control
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-medium">
            {[
              ["/admin", "Dashboard"],
              ["/admin/civilization", "Civilization"],
              ["/admin/titans", "Titans"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded border border-[#e6dfcf] px-3 py-2 text-[#1e2d3d] hover:border-[#c9a84c]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
