import { retrieveKnowledge } from "./knowledge-retriever";

export type SynthesisKind = "topic" | "comparative" | "gap-analysis";

export async function buildKnowledgeSynthesis(
  topic: string,
  type: SynthesisKind,
) {
  const sources = await retrieveKnowledge(topic, 8);
  const sourceRefs = sources.map((source) => source.slug);
  const confidence =
    sources.length >= 5 ? "high" : sources.length >= 2 ? "medium" : "low";

  const summary = [
    `Synthesis type: ${type}`,
    `Topic: ${topic}`,
    sources.length
      ? `Corpus basis:\n${sources.map((source) => `- ${source.title}: ${source.excerpt}`).join("\n")}`
      : "No direct corpus basis found. Mark as a knowledge gap candidate.",
  ].join("\n\n");

  return { summary, sourceRefs, confidence };
}
