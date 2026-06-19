export const gate6Features = {
  titanConclave: true,
  askInterface: true,
  knowledgeSynthesis: true,
  corpusBatch2: true,
  corpusBatch3: true,
  analyticsFoundation: true,
} as const;

export type Gate6Feature = keyof typeof gate6Features;
