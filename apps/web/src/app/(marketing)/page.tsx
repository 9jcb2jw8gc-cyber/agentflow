import Link from "next/link";

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 text-orange-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

const problems = [
  {
    title: "Handwritten config buried in code",
    description:
      "Agent definitions live in Python files, scattered across repos. One typo breaks the whole chain.",
    icon: (
      <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "When something breaks, no one can see why",
    description:
      "Multi-agent systems are invisible. You can't visualize which agent calls which, or where the bottleneck is.",
    icon: (
      <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Non-technical teammates can't touch it",
    description:
      "Product managers and designers have great ideas for agent behavior — but they can't edit YAML files.",
    icon: (
      <svg className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const solutions = [
  {
    title: "Visual canvas",
    description:
      "Drag agents onto a canvas, connect them with edges, and see your entire multi-agent system at a glance. Coordinators, specialists, MCP servers — all visible.",
    image: "/screenshots/canvas.png",
  },
  {
    title: "Inspector panel",
    description:
      "Click any agent to configure it. Edit system prompts, toggle tools on and off, set context inheritance. AI-assisted prompt improvement built in.",
    image: "/screenshots/inspector.png",
  },
  {
    title: "One-line import",
    description:
      "Export a portable YAML file. Import it into any Claude Agent SDK project with a single line of code. No vendor lock-in, no proprietary formats.",
    code: `import yaml from 'js-yaml';
const config = yaml.load(
  fs.readFileSync('agents.yaml', 'utf8')
);`,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started building agents",
    features: [
      "3 canvases",
      "5 agents per canvas",
      "YAML export",
      "Community support",
    ],
    cta: "Start building free",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious agent builders",
    features: [
      "Unlimited canvases",
      "Unlimited agents",
      "Version history",
      "Test runner",
      "Priority support",
      "Team sharing (soon)",
    ],
    cta: "Start free trial",
    ctaHref: "/dashboard",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Audit logs",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact us",
    ctaHref: "mailto:james@agentflow.dev",
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0e0e0e]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-[#e8440a]">Agent</span>Flow
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <a
              href="https://github.com/9jcb2jw8gc-cyber/agentflow"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#e8440a] px-4 py-2 text-sm font-medium text-white hover:bg-[#d13d09] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#e8440a]/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Build Claude agents{" "}
            <span className="text-[#e8440a]">visually</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Drag, drop, and connect. Export a portable YAML file any app can
            import. No configuration code required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-[#e8440a] px-6 py-3 text-base font-semibold text-white hover:bg-[#d13d09] transition-colors"
            >
              Start building free
              <ArrowRightIcon />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 text-base font-medium text-gray-300 hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Canvas mockup */}
        <div className="relative mx-auto mt-16 max-w-5xl px-6">
          <div className="rounded-xl border border-white/10 bg-[#161616] p-2 shadow-2xl shadow-orange-500/5">
            <div className="rounded-lg bg-[#1a1a1a] p-8 min-h-[400px] flex items-center justify-center">
              <div className="flex items-center gap-12">
                {/* Coordinator node */}
                <div className="rounded-lg border border-orange-500/40 bg-[#1e1e1e] px-6 py-4 shadow-lg shadow-orange-500/10">
                  <div className="text-xs text-orange-400 font-medium mb-1">
                    Coordinator
                  </div>
                  <div className="text-sm text-white font-semibold">
                    orchestrator
                  </div>
                  <div className="mt-2 flex gap-1">
                    <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">
                      Task
                    </span>
                    <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">
                      Bash
                    </span>
                  </div>
                </div>

                {/* Connecting lines */}
                <div className="flex flex-col gap-6">
                  <div className="w-16 h-px bg-gradient-to-r from-orange-500/60 to-blue-500/60" />
                  <div className="w-16 h-px bg-gradient-to-r from-orange-500/60 to-green-500/60" />
                </div>

                {/* Specialist nodes */}
                <div className="flex flex-col gap-4">
                  <div className="rounded-lg border border-blue-500/40 bg-[#1e1e1e] px-6 py-4 shadow-lg shadow-blue-500/10">
                    <div className="text-xs text-blue-400 font-medium mb-1">
                      Specialist
                    </div>
                    <div className="text-sm text-white font-semibold">
                      researcher
                    </div>
                    <div className="mt-2 flex gap-1">
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                        WebSearch
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-green-500/40 bg-[#1e1e1e] px-6 py-4 shadow-lg shadow-green-500/10">
                    <div className="text-xs text-green-400 font-medium mb-1">
                      Specialist
                    </div>
                    <div className="text-sm text-white font-semibold">
                      writer
                    </div>
                    <div className="mt-2 flex gap-1">
                      <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                        Edit
                      </span>
                      <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                        Write
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">
            Agents today are a mess
          </h2>
          <p className="mt-4 text-center text-gray-400 max-w-xl mx-auto">
            Building multi-agent systems with the Claude Agent SDK is powerful — but the configuration experience is stuck in 2020.
          </p>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {problems.map((problem) => (
              <div
                key={problem.title}
                className="rounded-xl border border-white/10 bg-[#161616] p-8"
              >
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION / HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">
            A better way to build agents
          </h2>
          <p className="mt-4 text-center text-gray-400 max-w-xl mx-auto">
            AgentFlow gives you a visual canvas for the Claude Agent SDK. Design your system, configure every detail, and export production-ready YAML.
          </p>
          <div className="mt-20 space-y-24">
            {solutions.map((solution, i) => (
              <div
                key={solution.title}
                className={`flex flex-col ${
                  i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="text-sm text-[#e8440a] font-semibold mb-2">
                    Step {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
                <div className="flex-1">
                  {solution.code ? (
                    <div className="rounded-xl border border-white/10 bg-[#161616] p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        <span className="ml-2 text-xs text-gray-500">
                          index.ts
                        </span>
                      </div>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{solution.code}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-[#161616] p-2">
                      <div className="rounded-lg bg-[#1a1a1a] h-64 flex items-center justify-center text-gray-500 text-sm">
                        {solution.title} screenshot
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO VIDEO */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Build a multi-agent system in 5 minutes
          </h2>
          <p className="mt-4 text-gray-400">
            Watch a 3-minute walkthrough of the full AgentFlow workflow.
          </p>
          <div className="mt-10 rounded-xl border border-white/10 bg-[#161616] p-2">
            <div className="rounded-lg bg-[#1a1a1a] aspect-video flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-[#e8440a]/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="mt-4 text-sm text-gray-500">
                  Demo video — coming launch day
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-xl border border-white/10 bg-[#161616] p-10">
            <svg
              className="mx-auto mb-6 h-10 w-10 text-[#e8440a]/40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
            </svg>
            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-gray-200">
              I built my entire AI Coach multi-agent system in AgentFlow before
              writing a single line of SDK code.
            </blockquote>
            <div className="mt-6">
              <div className="font-semibold text-white">James</div>
              <div className="text-sm text-gray-400">Founder, 8BitJJ</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SUMMARY */}
      <section id="pricing" className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-center text-gray-400">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 ${
                  plan.highlighted
                    ? "border-[#e8440a] bg-[#e8440a]/5 ring-1 ring-[#e8440a]/20"
                    : "border-white/10 bg-[#161616]"
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className={`mt-8 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-[#e8440a] text-white hover:bg-[#d13d09]"
                      : "border border-white/20 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/pricing"
              className="text-sm text-[#e8440a] hover:underline"
            >
              See full pricing details and feature comparison &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <Link href="/" className="text-lg font-bold tracking-tight">
                <span className="text-[#e8440a]">Agent</span>Flow
              </Link>
              <p className="mt-1 text-sm text-gray-500">
                Visual canvas for the Claude Agent SDK
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing
              </Link>
              <a
                href="https://github.com/9jcb2jw8gc-cyber/agentflow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/agentflow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://discord.gg/agentflow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Discord
              </a>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} AgentFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
