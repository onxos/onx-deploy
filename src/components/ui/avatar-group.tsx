"use client";

export function AvatarGroup({
  avatars,
  max = 4,
}: {
  avatars: Array<{ name: string; image?: string }>;
  max?: number;
}) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((avatar) => (
        <div
          className="grid h-9 w-9 place-items-center rounded-full border bg-muted text-xs font-medium"
          key={avatar.name}
          title={avatar.name}
        >
          {avatar.name.slice(0, 2).toUpperCase()}
        </div>
      ))}
      {overflow > 0 ? (
        <div className="grid h-9 w-9 place-items-center rounded-full border bg-muted text-xs font-medium">
          +{overflow}
        </div>
      ) : null}
    </div>
  );
}
