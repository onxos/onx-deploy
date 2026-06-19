import { db } from "@/server/db";
import { titanConversation } from "@/server/db/schema/titan-conversation";
import { retrieveKnowledge } from "./knowledge-retriever";
import { getDefaultPersona } from "./persona-loader";
import { synthesizeTitanResponse } from "./response-synthesizer";

export async function converseWithTitan(input: {
  sessionId: string;
  titanId: string;
  message: string;
}) {
  const persona = getDefaultPersona(input.titanId);
  const sources = await retrieveKnowledge(input.message);
  const result = synthesizeTitanResponse({
    prompt: input.message,
    persona,
    sources,
  });

  const [conversation] = await db
    .insert(titanConversation)
    .values({
      sessionId: input.sessionId,
      titanId: persona.titanId,
      userMessage: input.message,
      titanResponse: result.response,
      sourceRefs: result.sourceRefs,
      confidence: result.confidence,
    })
    .returning();

  return { ...result, conversationId: conversation?.id, persona };
}
