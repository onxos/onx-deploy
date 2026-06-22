import type { RouteIcon } from "@/config/routes";

const icons: Record<RouteIcon, string> = {
  activity: "◎",
  ask: "?",
  book: "□",
  chart: "▥",
  dashboard: "⌂",
  gaps: "◇",
  memory: "◫",
  shield: "◈",
  spark: "✦",
  titan: "△",
  users: "◉",
};

export function RouteIconMark({ icon }: { icon: RouteIcon }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none"
    >
      {icons[icon]}
    </span>
  );
}
