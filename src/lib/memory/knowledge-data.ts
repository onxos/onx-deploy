export interface KnowledgeItem {
  id: string;
  title: string;
  category:
    | "sbps"
    | "programs"
    | "decisions"
    | "corrections"
    | "approvals"
    | "standards";
  date: string;
  documentId: string;
  relatedItems: string[];
}
export const knowledgeCategories = [
  { key: "sbps" as const, label: "ONX Architecture (SBPs)", count: 60 },
  { key: "programs" as const, label: "Programs", count: 7 },
  { key: "decisions" as const, label: "Decisions", count: 43 },
  { key: "corrections" as const, label: "Corrections", count: 16 },
  { key: "approvals" as const, label: "Approvals", count: 10 },
  { key: "standards" as const, label: "Standards", count: 7 },
];
export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "sbps-40",
    title: "SBP-40: Intelligence Core (SECH)",
    category: "sbps",
    date: "2026-06-10",
    documentId: "SBP-40",
    relatedItems: ["dec-09", "app-08"],
  },
  {
    id: "sbps-45",
    title: "SBP-45: Civilization Core Protocol (CCP)",
    category: "sbps",
    date: "2026-06-10",
    documentId: "SBP-45",
    relatedItems: ["dec-01", "cor-04"],
  },
  {
    id: "sbps-va",
    title: "SBP-VA-01: ONX-VA Cognitive Assistant",
    category: "sbps",
    date: "2026-06-11",
    documentId: "SBP-VA-01",
    relatedItems: ["app-08"],
  },
  {
    id: "prog-cep",
    title: "CEP: Clinical Excellence Program",
    category: "programs",
    date: "2026-06-10",
    documentId: "CEP",
    relatedItems: ["sbps-50"],
  },
  {
    id: "dec-01",
    title: "D-01: ONX is global, not Saudi-only",
    category: "decisions",
    date: "2026-06-10",
    documentId: "CO-02",
    relatedItems: ["sbps-45"],
  },
  {
    id: "dec-09",
    title: "D-09: SECH is 5-layer intelligence core",
    category: "decisions",
    date: "2026-06-10",
    documentId: "CO-03",
    relatedItems: ["sbps-40"],
  },
  {
    id: "cor-04",
    title: "C-04: Canonical Correction Order (15 acronyms)",
    category: "corrections",
    date: "2026-06-12",
    documentId: "ONX-CCO-2026-001",
    relatedItems: ["dec-01"],
  },
  {
    id: "app-08",
    title: "APP-08: ONX-VA 5-Layer Model (POTAM)",
    category: "approvals",
    date: "2026-06-11",
    documentId: "SBP-VA-01",
    relatedItems: ["sbps-va"],
  },
  {
    id: "std-01",
    title: "Quality: Protection 10/10, Intelligence 10/10, Foundation 10/10",
    category: "standards",
    date: "2026-06-10",
    documentId: "QS-10-10-10",
    relatedItems: [],
  },
];
export default knowledgeItems;
