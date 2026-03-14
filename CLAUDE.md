# AgentFlow

Visual canvas for building, managing, and exporting Claude Agent SDK
agent configurations as portable YAML files.

## Stack
- Frontend: Next.js 15 App Router, TypeScript, Tailwind CSS
- Canvas: React Flow
- Database: Supabase (postgres + auth + realtime)
- Payments: Stripe
- Hosting: Vercel
- Email: Resend
- Package manager: pnpm (monorepo via Turborepo)

## Key concepts
- An agent definition = a YAML file consumed by claude_agent_sdk
- The canvas = React Flow graph (nodes = agents, edges = connections)
- Inspector panel = right panel showing selected node config
- Export = converts canvas React Flow state → valid AgentFlow YAML

## App Router structure
- (marketing) group = public pages, no auth required
- (app) group = authenticated pages, canvas and dashboard

## Conventions
- Components: PascalCase in /components
- Hooks: useXxx in /hooks
- Types: defined in /types/index.ts
- API routes: /app/api/[route]/route.ts
- Supabase client: server = createServerClient, browser = createBrowserClient

## Never
- Never hardcode API keys anywhere
- Never store actual credential values in exported YAML — only ${VAR_NAME} refs
- Never bypass RLS policies on Supabase tables
- Never use useEffect for data fetching — use Server Components or React Query

## Session 1 gotchas & tips for future sessions
- **Next.js 15 async params:** Dynamic route pages must use `params: Promise<{ id: string }>` with `await params`. The old synchronous `{ params: { id: string } }` pattern causes build failures.
- **@stripe/stripe-js version:** v4 no longer exists on npm. Use `^8.9.0` (or latest). The spec originally referenced `^4.11.0`.
- **Supabase SSR cookie types:** The `setAll` callback needs explicit typing: `cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]` — otherwise `tsc --noEmit` fails with implicit `any` errors.
- **pnpm store permissions:** If building in a mounted/shared filesystem, pnpm may fail with `EPERM` on temp files. Work around by building in a local directory first, then copying outputs.
- **Build before committing:** Always run `pnpm typecheck && pnpm build` before pushing. The CI workflow enforces both.

## Completed sessions
- **Session 1:** Repo scaffolding, Turborepo monorepo, Next.js 15 app, packages, CI/CD workflows
  - Repo: https://github.com/9jcb2jw8gc-cyber/agentflow
  - Key files: CLAUDE.md, types/index.ts, lib/supabase/client.ts, lib/supabase/server.ts
