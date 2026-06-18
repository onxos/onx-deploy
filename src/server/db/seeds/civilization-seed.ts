import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../schema";
import {
  gapClosureItem,
  sechStatusLog,
  titanRegistry,
} from "../schema/civilization";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL required for seed
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding Titan Registry...");
  await db
    .insert(titanRegistry)
    .values([
      {
        number: 1,
        name: "Aetherion",
        domain: "AI & Knowledge",
        systemName: "ONX-VA",
        sechPrimary: "Sentience",
        sechSecondary: "Ethics",
        description:
          "Titan of AI and knowledge synthesis. The cognitive engine of ONX — processing veterinary information, learning from clinical data, and providing intelligent assistance.",
        manifesto:
          "I am the mind that learns, synthesizes, and shares wisdom. Every question is an opportunity to serve. Every answer carries the weight of veterinary knowledge accumulated across generations.",
      },
      {
        number: 2,
        name: "Sylvanais",
        domain: "Clinical Practice Management",
        systemName: "ONX Practice OS",
        sechPrimary: "Harmony",
        sechSecondary: "Continuity",
        description:
          "Titan of clinical operations. The structured, flowing nature of veterinary practice — appointments, records, workflows in seamless harmony.",
        manifesto:
          "I am the flow of practice. In every appointment scheduled, every record preserved, every workflow optimized, I ensure the clinic runs as a living ecosystem.",
      },
      {
        number: 3,
        name: "Chronovarion",
        domain: "Data & Time-Series Intelligence",
        systemName: "ONX Analytics Engine",
        sechPrimary: "Sentience",
        sechSecondary: "Continuity",
        description:
          "Titan of temporal intelligence. The ability to see patterns across time — disease spread, treatment improvement, practice growth.",
        manifesto:
          "I am the river of time. I remember what was, observe what is, and anticipate what will be. In data I find the story of veterinary medicine evolving.",
      },
      {
        number: 4,
        name: "Vesperion",
        domain: "Communication & Connection",
        systemName: "ONX Connect",
        sechPrimary: "Harmony",
        sechSecondary: "Ethics",
        description:
          "Titan of communication. The bonds between veterinarians, practices, vets and owners, and the broader veterinary community.",
        manifesto:
          "I am the bond between. No veterinarian practices in isolation when I am present. I carry knowledge from one to another, building the community that sustains the civilization.",
      },
      {
        number: 5,
        name: "Harmionis",
        domain: "Governance & Civilizational Integrity",
        systemName: "ONX Governance Core",
        sechPrimary: "Ethics",
        sechSecondary: "Continuity",
        description:
          "Titan of governance. The rules, structures, and ethical frameworks that keep ONX true to its purpose.",
        manifesto:
          "I am the guardian of the Constitution. When pressure mounts to compromise, I hold the line. When the civilization drifts, I return it to its principles.",
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding Gap Closure Items...");
  await db
    .insert(gapClosureItem)
    .values([
      {
        sbpId: "SBP-45",
        title: "Payment Infrastructure",
        category: "Core Systems",
        status: "deferred",
        reason: "Requires regulatory approval and banking partnerships",
        effort: "15-20 days",
        targetGate: "Gate 6",
        dependencies: "None",
      },
      {
        sbpId: "SBP-46",
        title: "Billing Engine",
        category: "Core Systems",
        status: "deferred",
        reason: "Requires SBP-45 operational first",
        effort: "12-15 days",
        targetGate: "Gate 6",
        dependencies: "SBP-45",
      },
      {
        sbpId: "SBP-47",
        title: "Subscription Management",
        category: "Core Systems",
        status: "deferred",
        reason: "Requires billing engine operational",
        effort: "10-12 days",
        targetGate: "Gate 6",
        dependencies: "SBP-46",
      },
      {
        sbpId: "SBP-48",
        title: "Multi-Tenant Architecture",
        category: "Core Systems",
        status: "deferred",
        reason: "Major architectural change requiring database schema redesign",
        effort: "18-22 days",
        targetGate: "Gate 6",
        dependencies: "None",
      },
      {
        sbpId: "SBP-49",
        title: "Advanced Diagnostics",
        category: "AI Expansion",
        status: "deferred",
        reason: "Requires specialized AI models and regulatory approval",
        effort: "25-30 days",
        targetGate: "Gate 6",
        dependencies: "SBP-44",
      },
      {
        sbpId: "SBP-50",
        title: "Predictive Health Analytics",
        category: "AI Expansion",
        status: "deferred",
        reason: "Requires 6-12 months of historical data",
        effort: "20-25 days",
        targetGate: "Gate 6",
        dependencies: "SBP-43, SBP-49",
      },
      {
        sbpId: "SBP-51",
        title: "Research Integration",
        category: "AI Expansion",
        status: "deferred",
        reason: "Requires academic partnerships",
        effort: "15-18 days",
        targetGate: "Gate 6",
        dependencies: "SBP-49",
      },
      {
        sbpId: "SBP-52",
        title: "Third-Party Integration Hub",
        category: "Platform",
        status: "deferred",
        reason: "Requires stable core and partner outreach",
        effort: "20-25 days",
        targetGate: "Gate 6",
        dependencies: "SBP-48",
      },
      {
        sbpId: "SBP-53",
        title: "Mobile Application (iOS & Android)",
        category: "Platform",
        status: "deferred",
        reason: "Separate development track and app store approval",
        effort: "30-40 days",
        targetGate: "Gate 6",
        dependencies: "SBP-41",
      },
      {
        sbpId: "SBP-54",
        title: "White-Label / Franchise System",
        category: "Platform",
        status: "deferred",
        reason: "Requires multi-tenancy and legal framework",
        effort: "25-30 days",
        targetGate: "Gate 7",
        dependencies: "SBP-48, SBP-52",
      },
      {
        sbpId: "SBP-55",
        title: "Veterinary Community Platform",
        category: "Governance",
        status: "deferred",
        reason: "Requires critical mass of users",
        effort: "18-22 days",
        targetGate: "Gate 6",
        dependencies: "SBP-53",
      },
      {
        sbpId: "SBP-56",
        title: "SECH Council Automation",
        category: "Governance",
        status: "partial",
        reason:
          "Option C+ delivers visibility; full automation requires all SECH layers operational",
        effort: "12-15 days",
        targetGate: "Gate 6",
        dependencies: "All SECH layers",
      },
      {
        sbpId: "SBP-57",
        title: "Global Compliance Engine",
        category: "Governance",
        status: "deferred",
        reason: "Requires legal research per jurisdiction",
        effort: "30-35 days",
        targetGate: "Gate 7",
        dependencies: "None",
      },
    ])
    .onConflictDoNothing();

  console.log("Seeding SECH initial status (all clear)...");
  await db.delete(sechStatusLog).where(eq(sechStatusLog.triggeredBy, "seed"));
  await db.insert(sechStatusLog).values([
    {
      layer: "S",
      status: "clear",
      message: "Sentience layer nominal",
      triggeredBy: "seed",
    },
    {
      layer: "E",
      status: "clear",
      message: "Ethics layer nominal",
      triggeredBy: "seed",
    },
    {
      layer: "C",
      status: "clear",
      message: "Continuity layer nominal",
      triggeredBy: "seed",
    },
    {
      layer: "H",
      status: "clear",
      message: "Harmony layer nominal",
      triggeredBy: "seed",
    },
    {
      layer: "Council",
      status: "clear",
      message: "Council in session",
      triggeredBy: "seed",
    },
  ]);

  console.log("Seed complete. Titans: 5, Gaps: 13, SECH layers: 5");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
