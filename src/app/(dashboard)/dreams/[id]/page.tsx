"use client";

import { DreamDetail } from "@/components/dreams/dream-detail";
import { useDreams } from "@/hooks/use-dreams";

export default function DreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dreams = useDreams();
  const dream = dreams.useDream("dream-1");

  void params;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <DreamDetail
        dream={dream}
        onArchive={() => dreams.archiveDream(dream.id)}
      />
    </main>
  );
}
