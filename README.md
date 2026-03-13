# AgentFlow

Visual canvas for building Claude AI agents.

## Overview

AgentFlow is a SaaS product that provides a drag-and-drop canvas for building, managing, and exporting Claude Agent SDK configurations as portable YAML files.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Canvas:** React Flow
- **Database:** Supabase (Postgres + Auth + Realtime)
- **Payments:** Stripe
- **Hosting:** Vercel
- **Email:** Resend
- **Monorepo:** Turborepo + pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp apps/web/.env.local.example apps/web/.env.local

# Fill in your env vars, then start dev server
pnpm dev
```

### Project Structure

```
agentflow/
├── apps/
│   └── web/                        # Next.js 15 app (App Router)
├── packages/
│   ├── agentflow-core/             # Agent definition schema + export logic
│   └── agentflow-runtime/          # Runtime for importing YAML configs
├── supabase/
│   └── migrations/                 # Database migrations
├── .github/
│   └── workflows/
│       ├── ci.yml                  # PR checks
│       └── deploy.yml              # Production deploy
├── CLAUDE.md                       # AI assistant context
├── README.md
└── turbo.json
```

## Scripts

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build all packages and apps
pnpm typecheck    # Run TypeScript type checking
pnpm clean        # Clean build artifacts
```

## License

Private — All rights reserved.
