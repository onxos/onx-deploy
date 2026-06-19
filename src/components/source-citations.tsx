type SourceCitationsProps = {
  sources: string[];
};

export function SourceCitations({ sources }: SourceCitationsProps) {
  if (sources.length === 0) {
    return (
      <p className="text-sm text-[#5a6c7d]">No direct corpus citations.</p>
    );
  }

  return (
    <div className="space-y-2">
      {sources.map((source) => (
        <div
          key={source}
          className="rounded border bg-[#faf9f5] px-3 py-2 text-sm"
        >
          {source}
        </div>
      ))}
    </div>
  );
}
