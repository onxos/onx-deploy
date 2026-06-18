export interface Principle {
  id: string;
  number: number;
  title: string;
  description: string;
  enforcedIn: string[];
  relatedSbps: string[];
}
export const principles: Principle[] = [
  {
    id: "p1",
    number: 1,
    title: "Civilization Over Software",
    description:
      "ONX is a digital civilization for veterinary medicine, not a SaaS product. Every decision must serve the civilization first.",
    enforcedIn: ["Governance Layer", "CCP"],
    relatedSbps: ["SBP-45"],
  },
  {
    id: "p2",
    number: 2,
    title: "Global Scope",
    description:
      "ONX serves the global veterinary community. Saudi Arabia is the starting point, not the boundary.",
    enforcedIn: ["Analytics Layer", "Deployment Layer"],
    relatedSbps: ["SBP-45"],
  },
  {
    id: "p3",
    number: 3,
    title: "Maximum Quality Standard",
    description:
      "Protection, Intelligence, and Foundation are all 10/10. Nothing less is acceptable.",
    enforcedIn: ["COS-R2", "SECH", "Monitoring Layer"],
    relatedSbps: ["SBP-45", "SBP-48"],
  },
  {
    id: "p4",
    number: 4,
    title: "Founder Authority",
    description:
      "Mohammed Shaheen is the sole authority on ONX scope, identity, and direction.",
    enforcedIn: ["Governance Layer", "Admin Dashboard"],
    relatedSbps: ["SBP-45"],
  },
  {
    id: "p5",
    number: 5,
    title: "Knowledge Preservation",
    description:
      "Every decision, correction, approval, and discovery is preserved. ONX must never lose its own knowledge.",
    enforcedIn: ["CCMR", "Knowledge Center"],
    relatedSbps: ["SBP-49", "SBP-55"],
  },
  {
    id: "p6",
    number: 6,
    title: "Transparency and Honesty",
    description:
      "ONX operates with radical transparency. Scope gaps are reported, not hidden.",
    enforcedIn: ["Audit Logging", "Memory Vault"],
    relatedSbps: ["SBP-45"],
  },
  {
    id: "p7",
    number: 7,
    title: "Execution Over Discussion",
    description:
      "After Founder approval, the only authorized activity is execution. Build what is approved.",
    enforcedIn: ["Governance Layer", "Task Board"],
    relatedSbps: ["SBP-45"],
  },
];
export default principles;
