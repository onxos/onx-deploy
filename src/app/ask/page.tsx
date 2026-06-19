import { ChatInterface } from "@/components/chat-interface";
import { SynthesisPanel } from "@/components/synthesis-panel";

export default function AskPage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">
            Gate 6
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1e2d3d]">
            Conversational ONX
          </h1>
        </div>
        <ChatInterface />
        <SynthesisPanel />
      </div>
    </main>
  );
}
