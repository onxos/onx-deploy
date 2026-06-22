"use client";

import { ChatInterface } from "@/components/companion/chat-interface";

export default function CompanionPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Companion Center</h1>
        <p className="text-muted-foreground">
          Chat with the ONX companion, review guidance history, and tune
          settings.
        </p>
      </div>
      <ChatInterface />
    </main>
  );
}
