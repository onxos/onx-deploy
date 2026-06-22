"use client";

import { useState } from "react";
import { AccountSection } from "@/components/settings/account-section";
import { DangerZone } from "@/components/settings/danger-zone";
import { NotificationSection } from "@/components/settings/notification-section";
import { SessionsList } from "@/components/settings/sessions-list";
import { SettingsNav } from "@/components/settings/settings-nav";
import { ThemeSection } from "@/components/settings/theme-section";

export default function SettingsPage() {
  const [active, setActive] = useState("Theme");
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings and Preferences</h1>
        <p className="text-muted-foreground">
          Configure theme, notifications, account access, and sessions.
        </p>
      </div>
      <SettingsNav active={active} onChange={setActive} />
      <div className="grid gap-4">
        <ThemeSection />
        <NotificationSection />
        <AccountSection />
        <SessionsList />
        <DangerZone />
      </div>
    </main>
  );
}
