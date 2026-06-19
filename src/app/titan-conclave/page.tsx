import { TitanConversationPanel } from "@/components/titan-conversation-panel";

export default function TitanConclavePage() {
  return (
    <main className="min-h-screen bg-[#faf9f5] px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c]">
            Gate 6
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1e2d3d]">
            Titan Conclave
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5a6c7d]">
            Consult ONX personas against the active civilization corpus and
            preserve each exchange for analytics.
          </p>
        </div>
        <TitanConversationPanel />
      </div>
    </main>
  );
}
