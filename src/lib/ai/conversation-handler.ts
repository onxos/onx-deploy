import { retrieveKnowledge } from "./knowledge-retriever";
import { getDefaultPersona } from "./persona-loader";
import { synthesizeTitanResponse } from "./response-synthesizer";

export async function answerCivilizationQuestion(query: string) {
  const sources = await retrieveKnowledge(query, 6);
  return synthesizeTitanResponse({
    prompt: query,
    persona: getDefaultPersona("atlas"),
    sources,
  });
}
