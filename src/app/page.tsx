import Link from "next/link";

const routes = [
  {
    href: "/knowledge",
    title: "Knowledge Center",
    description:
      "Browse all ONX architecture documents, SBPs, programs, and preservation records.",
    badge: "60+ docs",
  },
  {
    href: "/constitution",
    title: "Constitutional Rules",
    description:
      "The 7 principles that govern every ONX system, decision, and interaction.",
    badge: "7 principles",
  },
  {
    href: "/registry",
    title: "Titan Registry",
    description:
      "The lineage and genealogy of ONX civilization across 5 foundational layers.",
    badge: "5 titans",
  },
  {
    href: "/memory",
    title: "Civilization Memory",
    description:
      "Every document, decision, correction, and approval — preserved and browsable.",
    badge: "143 records",
  },
  {
    href: "/gaps",
    title: "Gap Closure Status",
    description:
      "13 gaps approved by the Founder. 7 closed. 6 on roadmap. All tracked.",
    badge: "13 gaps",
  },
  {
    href: "/va-capabilities",
    title: "ONX-VA Capabilities",
    description:
      "25 AI capabilities powering the veterinary assistant — operational and deferred.",
    badge: "25 capabilities",
  },
  {
    href: "/pulse",
    title: "Civilization Pulse",
    description:
      "Real-time system health, knowledge preservation score, and SECH activity.",
    badge: "live",
  },
  {
    href: "/ask",
    title: "Conversational ONX",
    description:
      "Ask the civilization corpus questions and generate knowledge synthesis records.",
    badge: "Gate 6",
  },
  {
    href: "/titan-conclave",
    title: "Titan Conclave",
    description:
      "Consult SECH, Kimi, Hadeer, Founder, and Atlas personas with source-backed responses.",
    badge: "Gate 6",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f5]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-[#c9a84c] uppercase mb-3">
            ONX v1.0.0 — Gate 5
          </p>
          <h1 className="text-4xl font-bold text-[#1e2d3d] mb-4">
            ONX Civilization Platform
          </h1>
          <p className="text-lg text-[#5a6c7d] max-w-xl">
            A digital civilization for veterinary medicine. Built on 7
            principles, 5 titans, and a commitment to knowledge preservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group block border border-gray-200 rounded-xl p-5 bg-white hover:border-[#c9a84c] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-semibold text-[#1e2d3d] group-hover:text-[#c9a84c] transition-colors">
                  {route.title}
                </h2>
                <span className="text-xs font-medium text-[#5a6c7d] bg-gray-100 px-2 py-0.5 rounded-full shrink-0 ml-3">
                  {route.badge}
                </span>
              </div>
              <p className="text-sm text-[#5a6c7d] leading-relaxed">
                {route.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
