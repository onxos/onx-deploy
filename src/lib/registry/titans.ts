export interface Titan {
  id: string;
  name: string;
  title: string;
  description: string;
  order: number;
  associatedSbps: string[];
  associatedDocs: string[];
}
export const titans: Titan[] = [
  {
    id: "titan-1",
    name: "Titan-1: Founding",
    title: "The Genesis Layer",
    description:
      "The origin of ONX — constitutional principles, founder vision, and the civilization mandate.",
    order: 1,
    associatedSbps: ["SBP-01"],
    associatedDocs: ["ONX Internal Constitution"],
  },
  {
    id: "titan-2",
    name: "Titan-2: Architecture",
    title: "The Structural Layer",
    description:
      "SECH, CCP, CPP, CAOS, RCRS — the core systems that form ONX structural backbone.",
    order: 2,
    associatedSbps: ["SBP-40", "SBP-45", "SBP-50", "SBP-51", "SBP-52"],
    associatedDocs: ["ONX Complete System Architecture"],
  },
  {
    id: "titan-3",
    name: "Titan-3: Community",
    title: "The Social Layer",
    description:
      "Hadeer tiers, CCOP, mentorship, events — the human fabric of the civilization.",
    order: 3,
    associatedSbps: ["SBP-55"],
    associatedDocs: ["ONX-HADEER-2026-001"],
  },
  {
    id: "titan-4",
    name: "Titan-4: Intelligence",
    title: "The Cognitive Layer",
    description:
      "ONX-VA 5-layer assistant, companion runtime, all AI capabilities. The brain of ONX.",
    order: 4,
    associatedSbps: ["SBP-VA-01"],
    associatedDocs: ["SBP-VA-01 Capstone"],
  },
  {
    id: "titan-5",
    name: "Titan-5: Continuity",
    title: "The Memory Layer",
    description:
      "Preservation systems, evolution mechanisms, institutional memory.",
    order: 5,
    associatedSbps: ["SBP-49"],
    associatedDocs: ["ONX Memory Vault v2.0"],
  },
];
export default titans;
