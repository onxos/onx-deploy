# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # start dev server (Turbopack)
bun run build        # production build
bun run lint         # Biome check (no auto-fix)
bun run test         # staging readiness evidence file check
bun run test:staging # smoke test against ONX_BASE_URL or localhost:3000
bun run format       # Biome format with auto-fix

# Database (Drizzle + Neon)
bun run db:push      # push schema to DB without migrations
bun run db:generate  # generate migration files
bun run db:migrate   # run migrations
bun run db:studio    # open Drizzle Studio

# Corpus / seeding
bun run ingest:corpus          # upsert public/docs/**/*.md into DB
bun run seed:civilization      # seed titans and civilization data
```

`bun run build` performs the production Next.js compile and TypeScript check.

## Architecture

**ONX Civilization Platform** is a Next.js 16 App Router application modeling a "digital civilization" for veterinary medicine. It exposes a public-facing knowledge portal and a Gate 6 conversational AI layer backed by five Titan personas.

### Stack

- **Next.js 16** — App Router, React 19, React Compiler enabled, Turbopack in dev
- **tRPC v11** — all data fetching; API mounted at `/api/trpc/[trpc]`; client in `src/trpc/react.tsx`, routers in `src/server/api/routers/`
- **Drizzle ORM + Neon** — serverless PostgreSQL; all tables prefixed `onx_`; schema split across `src/server/db/schema/`
- **Better Auth** — email/password auth wired to Drizzle (configured in `src/server/auth.ts`); not yet used for admin route protection
- **TailwindCSS 4** — utility-first styles
- **Biome 2.2.0** — linter + formatter (2-space indents, auto import ordering)

### Path alias

`@/*` resolves to `src/*`.

### Data flow

Pages and Client Components call tRPC via `api` from `src/trpc/react.tsx`. Server-side calls go through routers in `src/server/api/`. All database access goes through `src/server/db/index.ts` (a Drizzle instance backed by `DATABASE_URL`).

### Authentication and authorization

Better Auth is wired through `src/server/auth.ts` and exposed at `/api/auth/[...all]`. Email/password sessions are stored in Postgres through Drizzle. App roles are `operator`, `admin`, and `founder`, with helpers in `src/server/auth/roles.ts`.

Protected route behavior:

- `/pulse` requires any authenticated session.
- `/registry`, `/gaps`, and `/admin` require `admin` or `founder`.
- tRPC `protectedProcedure` requires `admin` or `founder`.
- Unauthenticated protected route access redirects to `/login`.
- Insufficient role access redirects to `/forbidden`.

### AI / Titan layer (`src/lib/ai/`)

- **`knowledge-retriever.ts`** — keyword search against `onx_knowledge_article` in the DB (simple `LIKE` query on content)
- **`persona-loader.ts`** — five hard-coded Titan personas (SECH, Kimi, Hadeer, Founder, Atlas); each has `titanId`, `domain`, `style`, `traits`, and `systemPrompt`
- **`response-synthesizer.ts`** — assembles a Titan response from persona + retrieved sources
- **`synthesis-engine.ts`** — produces knowledge synthesis records (topic/comparative/gap-analysis)
- **`titan-conversation.ts`** — orchestrates a full conversation turn and persists it to `onx_titan_conversation`

Titan personas are also stored in `onx_titan_persona` (populated by `seed:civilization`) but the AI layer currently reads from the hard-coded list in `persona-loader.ts`.

### Corpus ingestion

`src/scripts/ingest-corpus.ts` scans `public/docs/**/*.md` and upserts records into `onx_knowledge_article`. Slug is derived from the relative file path; category and importance are inferred from the slug. Run after adding or updating docs.

### Feature flags

`src/config/gate6-features.ts` contains a static flags object. Gate 6 features (Titan Conclave, Ask interface, Knowledge Synthesis) are all enabled.

### DB schema files

| File | Tables |
|---|---|
| `schema/civilization.ts` | `knowledgeArticles`, `sechStatusLog`, `titanRegistry`, `gapClosureItem`, `visitorInteraction` |
| `schema/titan-persona.ts` | `titanPersona` |
| `schema/titan-conversation.ts` | `titanConversation` |
| `schema/knowledge-synthesis.ts` | knowledge synthesis records |

### Required environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Better Auth session secret |
| `BETTER_AUTH_URL` | Base URL for Better Auth |
| `ONX_FOUNDER_EMAIL` | One-time founder bootstrap email |
| `ONX_FOUNDER_PASSWORD` | One-time founder bootstrap password |

## ONX Unified Evidence Standard (`ONX_UNIFIED_EVIDENCE_STANDARD_v1.0`)

This standard is **binding** for all Execution Programs (EP-02 through EP-05). Every acceptance verification item must be backed by a concrete, reviewable artifact.

### Core principles

- **Tangible** — concrete artifact, not a verbal confirmation
- **Reviewable** — independently checkable by Kimi or Founder
- **Authentic** — actual system state, not mock/demo data
- **Timely** — collected within 7 days of the verification event
- **Traceable** — each file links to a specific verification item
- **Retained** — kept for minimum 90 days post-deployment

### Eight evidence categories

| Code | `EV-CODE_<WP-ID>_<YYYYMMDD>_<brief>.png\|txt\|url` |
|---|---|
| Test | `EV-TEST_<WP-ID>_<YYYYMMDD>_<brief>.html\|json\|png` |
| Security | `EV-SEC_<WP-ID>_<YYYYMMDD>_<brief>.pdf\|png\|txt` |
| Deployment | `EV-DEPL_<WP-ID>_<YYYYMMDD>_<brief>.txt\|png` |
| Runtime | `EV-RUN_<WP-ID>_<YYYYMMDD>_<brief>.json\|png\|html` |
| Monitoring | `EV-MON_<WP-ID>_<YYYYMMDD>_<brief>.png\|yaml\|json` |
| Acceptance | `EV-ACPT_<EP-ID>_<YYYYMMDD>_<brief>.docx\|pdf` |
| Closure | `EV-CLSR_<EP-ID>_<YYYYMMDD>_<brief>.docx\|txt` |

**Key quality thresholds:**
- Code: PR approved, CI green, merged to main/production
- Test: all tests pass, ≥ 80% coverage (per-EP threshold may vary)
- Security: zero critical vulnerabilities, all auth flows tested (pass + fail)
- Runtime: health check 200, P95 latency < 500 ms, 100 concurrent users with 0 errors
- Deployment: build exits 0, staging responds 200, rollback tested

### Evidence storage layout

```
/evidence/<EP-ID>/<YYYY-MM-DD>/<category>/<EV-*>
```

Every evidence submission must reference a git commit hash and be committed to the `/evidence/` directory.

### Submission workflow

1. Husam collects evidence per this standard and commits to `/evidence/`
2. GitHub PR references the WP ID and acceptance items
3. Kimi reviews for completeness, quality, and relevance
4. Kimi scores items in D02 (Acceptance Verification Checklist) → D04 (Scoring Framework)
5. All items pass → Kimi initiates D05 (Staging Readiness Certification)
6. Founder reviews and signs; evidence archived per retention policy
