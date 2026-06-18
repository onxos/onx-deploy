export interface Gap {
  id: string;
  name: string;
  code: string;
  status: "closed" | "roadmap";
  closureDocument: string | null;
  triggerCondition: string | null;
  targetDate: string | null;
}
export const gaps: Gap[] = [
  {
    id: "g1",
    name: "AI Architecture Consolidation",
    code: "SBP-AI-01",
    status: "closed",
    closureDocument: "SBP-AI-01",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g2",
    name: "Veterinary Data Intelligence",
    code: "SBP-VDI",
    status: "closed",
    closureDocument: "SBP-VDI",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g3",
    name: "Zero Trust Architecture",
    code: "SBP-ZTA",
    status: "closed",
    closureDocument: "SBP-ZTA",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g4",
    name: "Cognitive Native Architecture",
    code: "SBP-CNA",
    status: "closed",
    closureDocument: "SBP-CNA",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g5",
    name: "SECH Full Implementation",
    code: "SECH-COMPLETE",
    status: "closed",
    closureDocument: "SBP-40",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g6",
    name: "Constitutional Compiler",
    code: "CCP-RUNTIME",
    status: "closed",
    closureDocument: "SBP-45",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g7",
    name: "Knowledge Preservation System",
    code: "CCMR-LIVE",
    status: "closed",
    closureDocument: "ONX-KPLR-2026-001",
    triggerCondition: null,
    targetDate: null,
  },
  {
    id: "g8",
    name: "Advanced Multi-Agent AI",
    code: "SBP-AI-05",
    status: "roadmap",
    closureDocument: null,
    triggerCondition: "100+ active clinics",
    targetDate: "Q3 2027",
  },
  {
    id: "g9",
    name: "Cross-System Intelligence",
    code: "SBP-AI-06",
    status: "roadmap",
    closureDocument: null,
    triggerCondition: "5+ systems coordinating",
    targetDate: "Q3 2027",
  },
  {
    id: "g10",
    name: "Federated Data Intelligence",
    code: "SBP-VDI-02",
    status: "roadmap",
    closureDocument: null,
    triggerCondition: "Multi-clinic data sharing",
    targetDate: "Q4 2027",
  },
  {
    id: "g11",
    name: "Quantum-Resistant Cryptography",
    code: "SBP-ZTA-02",
    status: "roadmap",
    closureDocument: null,
    triggerCondition: "Regulatory requirement",
    targetDate: "Q2 2028",
  },
  {
    id: "g12",
    name: "Cognitive Autonomy Layer",
    code: "SBP-CNA-02",
    status: "roadmap",
    closureDocument: null,
    triggerCondition: "AI safety framework maturity",
    targetDate: "Q2 2028",
  },
  {
    id: "g13",
    name: "Civilization Dream Engine",
    code: "SBP-CNA-03",
    status: "roadmap",
    closureDocument: null,
    triggerCondition: "Long-term R&D initiative",
    targetDate: "2028",
  },
];
export default gaps;
