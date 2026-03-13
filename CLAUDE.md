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
