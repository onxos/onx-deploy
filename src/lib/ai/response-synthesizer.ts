import type { TitanPersonaSeed } from "./persona-loader";

export type SynthesisInput = {
  prompt: string;
  persona: TitanPersonaSeed;
  sources: Array<{ title: string; slug: string; excerpt: string }>;
};

export type SynthesisOutput = {
  response: string;
  sourceRefs: string[];
  confidence: "low" | "medium" | "high";
};

export function synthesizeTitanResponse(
  input: SynthesisInput,
): SynthesisOutput {
  const sourceRefs = input.sources.map((source) => source.slug);
  const confidence =
    input.sources.length >= 3
      ? "high"
      : input.sources.length > 0
        ? "medium"
        : "low";
  const evidence = input.sources
    .slice(0, 3)
    .map((source) => `- ${source.title}: ${source.excerpt}`)
    .join("\n");

  return {
    response: `${input.persona.displayName} assessment\n\n${input.persona.systemPrompt}\n\nPrompt: ${input.prompt}\n\n${evidence || "No direct corpus source matched. This answer should be treated as provisional until the corpus is expanded."}`,
    sourceRefs,
    confidence,
  };
}
