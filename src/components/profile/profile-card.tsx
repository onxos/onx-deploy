"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ProfileUser } from "@/hooks/use-profile";
import { AvatarDisplay } from "./avatar-display";
import { RoleBadge } from "./role-badge";

export function ProfileCard({
  user,
  onEdit,
}: {
  user: ProfileUser;
  onEdit: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <AvatarDisplay name={user.name} size="lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {user.createdAt.toLocaleDateString()}
            </p>
          </div>
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={onEdit}
            type="button"
          >
            Edit profile
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
