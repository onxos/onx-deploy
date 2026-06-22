"use client";

import { ModalDialog } from "@/components/ui/modal-dialog";
import type { InstitutionMember } from "@/hooks/use-institution";
import { ActivityIndicator } from "./activity-indicator";

export function MemberDrawer({
  member,
  onClose,
}: {
  member: InstitutionMember | null;
  onClose: () => void;
}) {
  return (
    <ModalDialog
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open={Boolean(member)}
      title="Member details"
    >
      {member ? (
        <div className="space-y-2">
          <p className="text-lg font-semibold">{member.name}</p>
          <p className="text-muted-foreground">{member.email}</p>
          <p className="capitalize">Role: {member.role}</p>
          <p className="flex items-center gap-2">
            <ActivityIndicator status={member.status} /> {member.status}
          </p>
          <p className="text-sm text-muted-foreground">
            Last active: {member.lastActive}
          </p>
        </div>
      ) : null}
    </ModalDialog>
  );
}
