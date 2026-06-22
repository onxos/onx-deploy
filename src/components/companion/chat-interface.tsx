"use client";

import { useCompanionChat } from "@/hooks/use-companion-chat";
import { CompanionAvatar } from "./companion-avatar";
import { CompanionSettings } from "./companion-settings";
import { GuidanceHistory } from "./guidance-history";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

export function ChatInterface() {
  const { draft, endRef, guidanceHistory, messages, sendMessage, setDraft } =
    useCompanionChat();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <CompanionAvatar />
          <CompanionSettings />
        </div>
        <MessageList endRef={endRef} messages={messages} />
        <MessageInput draft={draft} onChange={setDraft} onSend={sendMessage} />
      </section>
      <GuidanceHistory items={guidanceHistory} />
    </div>
  );
}
