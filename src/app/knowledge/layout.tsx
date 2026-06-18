import { Suspense } from "react";
import RouteLoading from "@/components/civilization/route-loading";

export const metadata = {
  title: "ONX Knowledge Center",
  description:
    "Browse all ONX architecture documents, SBPs, programs, and preservation records.",
};
export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Suspense fallback={<RouteLoading />}>{children}</Suspense>
    </div>
  );
}
