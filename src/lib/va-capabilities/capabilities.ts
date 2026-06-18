export interface Capability {
  id: string;
  name: string;
  description: string;
  status: "operational" | "deferred";
  exampleQuery: string;
  reasonDeferred: string | null;
}
export const operationalCapabilities: Capability[] = [
  {
    id: "c1",
    name: "Veterinary Q&A",
    description: "Answer veterinary questions using clinical knowledge base.",
    status: "operational",
    exampleQuery: "What are the symptoms of feline diabetes?",
    reasonDeferred: null,
  },
  {
    id: "c2",
    name: "Differential Diagnosis",
    description:
      "Suggest differential diagnoses based on symptoms and history.",
    status: "operational",
    exampleQuery: "My dog is limping and has a fever. What could it be?",
    reasonDeferred: null,
  },
  {
    id: "c3",
    name: "Drug Interaction Check",
    description: "Check drug-drug and drug-condition interactions.",
    status: "operational",
    exampleQuery: "Can metacam and rimadyl be given together?",
    reasonDeferred: null,
  },
  {
    id: "c4",
    name: "Treatment Protocols",
    description:
      "Recommend treatment protocols from the CPP clinical database.",
    status: "operational",
    exampleQuery: "What is the standard treatment for canine parvovirus?",
    reasonDeferred: null,
  },
  {
    id: "c5",
    name: "Document Analysis",
    description:
      "Analyze lab reports, medical records, and clinical documents.",
    status: "operational",
    exampleQuery: "Analyze this blood work report for abnormalities.",
    reasonDeferred: null,
  },
  {
    id: "c6",
    name: "Case Summarization",
    description: "Summarize complex cases for handoffs and referrals.",
    status: "operational",
    exampleQuery: "Summarize this patient's 6-month history.",
    reasonDeferred: null,
  },
  {
    id: "c7",
    name: "CME Content Generation",
    description: "Generate continuing medical education content.",
    status: "operational",
    exampleQuery: "Create a CME module on feline hypertension.",
    reasonDeferred: null,
  },
  {
    id: "c8",
    name: "Conversational Memory",
    description: "Remember conversation history within a session.",
    status: "operational",
    exampleQuery: "What did we discuss about my last case?",
    reasonDeferred: null,
  },
  {
    id: "c9",
    name: "Long-term Memory",
    description:
      "Vector-based memory across sessions. Recognizes returning users.",
    status: "operational",
    exampleQuery: "Remember that I prefer detailed explanations.",
    reasonDeferred: null,
  },
  {
    id: "c10",
    name: "Reasoning Chain",
    description:
      "Multi-step reasoning: symptom to differential to test to diagnosis.",
    status: "operational",
    exampleQuery: "Walk me through your diagnostic reasoning.",
    reasonDeferred: null,
  },
  {
    id: "c11",
    name: "Personalization",
    description: "Adapts communication style, depth, and focus to each user.",
    status: "operational",
    exampleQuery: "Explain this simply — I am a new veterinarian.",
    reasonDeferred: null,
  },
  {
    id: "c12",
    name: "Proactive Suggestions",
    description:
      "Suggests help before being asked. Presence layer observes context.",
    status: "operational",
    exampleQuery: "[ONX-VA suggests based on context]",
    reasonDeferred: null,
  },
  {
    id: "c13",
    name: "Arabic/English Bilingual",
    description:
      "Full bilingual support. Detects language and responds accordingly.",
    status: "operational",
    exampleQuery: "ما هي أعراض مرض السكري في القطط؟",
    reasonDeferred: null,
  },
  {
    id: "c14",
    name: "Companion Conversations",
    description:
      "Emotional support conversations, wellness check-ins, stress relief.",
    status: "operational",
    exampleQuery: "I had a difficult euthanasia today.",
    reasonDeferred: null,
  },
  {
    id: "c15",
    name: "Report Generation",
    description:
      "Generate medical reports, discharge instructions, communications.",
    status: "operational",
    exampleQuery: "Generate a discharge summary for this patient.",
    reasonDeferred: null,
  },
  {
    id: "c16",
    name: "Prescription Writing",
    description:
      "Generate prescription text. Veterinarian reviews before fulfillment.",
    status: "operational",
    exampleQuery: "Write a prescription for amoxicillin 50mg.",
    reasonDeferred: null,
  },
  {
    id: "c17",
    name: "Appointment Scheduling",
    description:
      "AI-assisted booking. Suggests optimal slots and handles rescheduling.",
    status: "operational",
    exampleQuery: "Schedule a follow-up for next Tuesday.",
    reasonDeferred: null,
  },
  {
    id: "c18",
    name: "Admin Support",
    description:
      "Answer admin questions about system usage and user management.",
    status: "operational",
    exampleQuery: "How do I add a new staff member?",
    reasonDeferred: null,
  },
  {
    id: "c19",
    name: "Owner Education",
    description:
      "Pet care education, symptom explanation, medication guidance.",
    status: "operational",
    exampleQuery: "How should I give my cat insulin injections?",
    reasonDeferred: null,
  },
];
export const deferredCapabilities: Capability[] = [
  {
    id: "d1",
    name: "Multi-Modal Image Analysis",
    description: "X-ray, ultrasound, and dermatology image interpretation.",
    status: "deferred",
    exampleQuery: "Interpret this chest X-ray.",
    reasonDeferred: "Requires regulatory approval for diagnostic AI",
  },
  {
    id: "d2",
    name: "Voice Interface",
    description: "Speech-to-text and text-to-speech for hands-free operation.",
    status: "deferred",
    exampleQuery: "Hey ONX, what are the side effects of prednisone?",
    reasonDeferred: "Text covers all v1 use cases",
  },
  {
    id: "d3",
    name: "Autonomous Task Execution",
    description: "ONX-VA performing actions without human confirmation.",
    status: "deferred",
    exampleQuery: "Order more rabies vaccines for the clinic.",
    reasonDeferred: "Safety concern at v1",
  },
  {
    id: "d4",
    name: "Real-Time External Data",
    description: "Live access to external veterinary databases.",
    status: "deferred",
    exampleQuery: "What are the latest canine influenza alerts?",
    reasonDeferred: "Requires API partnerships",
  },
  {
    id: "d5",
    name: "Advanced Personalization Engine",
    description: "Deep behavioral modeling predicting user needs.",
    status: "deferred",
    exampleQuery: "[ONX-VA predicts need based on behavior]",
    reasonDeferred: "Requires user base > 500",
  },
  {
    id: "d6",
    name: "Proactive Companion Intervention",
    description: "Companion AI initiating wellness interventions.",
    status: "deferred",
    exampleQuery: "[Companion checks in after detecting stress]",
    reasonDeferred: "Requires ethics review for privacy",
  },
];
export const allCapabilities = [
  ...operationalCapabilities,
  ...deferredCapabilities,
];
export default allCapabilities;
