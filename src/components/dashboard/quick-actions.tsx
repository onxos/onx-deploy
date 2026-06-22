import Link from "next/link";

const actions = [
  { href: "/ask", label: "Ask ONX" },
  { href: "/knowledge", label: "Open Knowledge" },
  { href: "/gaps", label: "Review Gaps" },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
