"use client";

import { useState } from "react";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { SessionInfo } from "@/components/profile/session-info";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { isSaving, session, updateProfile, user } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your ONX identity, role, and active session.
        </p>
      </div>
      {isEditing ? (
        <ProfileForm
          isSaving={isSaving}
          onCancel={() => setIsEditing(false)}
          onSave={async (values) => {
            await updateProfile(values);
            setIsEditing(false);
            toast({ title: "Profile saved", variant: "success" });
          }}
          user={user}
        />
      ) : (
        <ProfileCard onEdit={() => setIsEditing(true)} user={user} />
      )}
      <SessionInfo session={session} />
    </main>
  );
}
