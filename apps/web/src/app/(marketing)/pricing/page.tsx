"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "h-5 w-5 text-orange-500 shrink-0"}
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

function DashIcon() {
  return (
    <svg
      className="h-5 w-5 text-gray-600 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
  );
}

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started building agents",
    cta: "Start building free",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 290,
    description: "For serious agent builders",
    cta: "Start free trial",
    ctaHref: "/dashboard",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "For teams and organizations",
    cta: "Contact us",
    ctaHref: "mailto:james@agentflow.dev",
    highlighted: false,
  },
];

interface FeatureRow {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

const features: { category: string; items: FeatureRow[] }[] = [
  {
    category: "Canvas & Agents",
    items: [
      { name: "Canvases", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Agents per canvas", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "MCP server nodes", free: true, pro: true, enterprise: true },
      { name: "Hook nodes", free: true, pro: true, enterprise: true },
      { name: "Real-time auto-save", free: true, pro: true, enterprise: true },
    ],
  },
  {
    category: "Export & Import",
    items: [
      { name: "YAML export", free: true, pro: true, enterprise: true },
      { name: "YAML import", free: true, pro: true, enterprise: true },
      { name: "Version history", free: false, pro: true, enterprise: true },
      { name: "Export templates", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "AI Features",
    items: [
      { name: "AI prompt improvement", free: "5/day", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Test runner", free: false, pro: true, enterprise: true },
      { name: "Agent analytics", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Collaboration & Support",
    items: [
      { name: "Team sharing", free: false, pro: "Coming soon", enterprise: true },
      { name: "SSO / SAML", free: false, pro: false, enterprise: true },
      { name: "Audit logs", free: false, pro: false, enterprise: true },
      { name: "Community support", free: true, pro: true, enterprise: true },
      { name: "Priority support", free: false, pro: true, enterprise: true },
      { name: "Dedicated support", free: false, pro: false, enterprise: true },
      { name: "SLA guarantee", free: false, pro: false, enterprise: true },
    ],
  },
];

const faqs = [
  {
    question: "What is the Claude Agent SDK?",
    answer:
      "The Claude Agent SDK is Anthropic's framework for building multi-agent AI systems. It lets you create coordinators that delegate to specialist agents, each with their own tools and context. AgentFlow gives you a visual way to design these systems without writing configuration code by hand.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Not to design your agent system. AgentFlow's visual canvas lets anyone drag, drop, and connect agents. You'll need basic developer knowledge to import the exported YAML file into your project, but the import itself is just one line of code.",
  },
  {
    question: "What does the YAML export work with?",
    answer:
      "The exported YAML file is a portable configuration that works with any project using the Claude Agent SDK. It's plain text, version-controllable, and framework-agnostic. Import it in Python, TypeScript, or any language with a YAML parser.",
  },
  {
    question: "Can I use this with other LLMs?",
    answer:
      "AgentFlow is purpose-built for the Claude Agent SDK and its specific agent patterns (coordinators, specialists, MCP servers, hooks). The visual metaphors and YAML structure map directly to Claude's architecture. We may support other frameworks in the future.",
  },
  {
    question: "What happens when I hit a free plan limit?",
    answer:
      "You'll see a clear message explaining which limit you've reached and what upgrading unlocks. Your existing canvases and agents are never deleted. You can always export your work, even on the free plan.",
  },
];

function FeatureCell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm text-gray-300">{value}</span>;
  }
  return value ? (
    <CheckIcon className="h-5 w-5 text-orange-500 mx-auto" />
  ) : (
    <DashIcon />
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white">
      {/* NAV */}
      <nav className="border-b border-white/10 bg-[#0e0e0e]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-[#e8440a]">Agent</span>Flow
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#e8440a] px-4 py-2 text-sm font-medium text-white hover:bg-[#d13d09] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <section className="pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-lg mx-auto">
          Start free. Upgrade when you need more power.
        </p>

        {/* Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm ${!annual ? "text-white" : "text-gray-500"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              annual ? "bg-[#e8440a]" : "bg-gray-600"
            }`}
            role="switch"
            aria-checked={annual}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm ${annual ? "text-white" : "text-gray-500"}`}
          >
            Annual
          </span>
          {annual && (
            <span className="ml-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
              Save ~17%
            </span>
          )}
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price =
              plan.monthlyPrice === null
                ? "Custom"
                : annual
                  ? plan.annualPrice === 0
                    ? "$0"
                    : `$${plan.annualPrice}`
                  : `$${plan.monthlyPrice}`;

            const period =
              plan.monthlyPrice === null
                ? ""
                : plan.monthlyPrice === 0
                  ? "forever"
                  : annual
                    ? "/year"
                    : "/month";

            return (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 ${
                  plan.highlighted
                    ? "border-[#e8440a] bg-[#e8440a]/5 ring-1 ring-[#e8440a]/20"
                    : "border-white/10 bg-[#161616]"
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 text-xs font-semibold text-[#e8440a] uppercase tracking-wider">
                    Most popular
                  </div>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{price}</span>
                  {period && (
                    <span className="text-gray-400 text-sm">{period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {plan.description}
                </p>
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
            );
          })}
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="pb-20 border-t border-white/5 pt-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            Full feature comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 pr-8 text-sm font-medium text-gray-400">
                    Feature
                  </th>
                  <th className="pb-4 px-4 text-sm font-medium text-gray-400 text-center w-28">
                    Free
                  </th>
                  <th className="pb-4 px-4 text-sm font-medium text-[#e8440a] text-center w-28">
                    Pro
                  </th>
                  <th className="pb-4 pl-4 text-sm font-medium text-gray-400 text-center w-28">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((group) => (
                  <Fragment key={group.category}>
                    <tr>
                      <td
                        colSpan={4}
                        className="pt-8 pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.items.map((item) => (
                      <tr
                        key={item.name}
                        className="border-b border-white/5"
                      >
                        <td className="py-3 pr-8 text-sm text-gray-300">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <FeatureCell value={item.free} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <FeatureCell value={item.pro} />
                        </td>
                        <td className="py-3 pl-4 text-center">
                          <FeatureCell value={item.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 border-t border-white/5 pt-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold">Start building free</h2>
          <p className="mt-3 text-gray-400">
            No credit card required. Upgrade anytime.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center rounded-lg bg-[#e8440a] px-8 py-3 text-base font-semibold text-white hover:bg-[#d13d09] transition-colors"
          >
            Start building free
          </Link>
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
              <a href="https://github.com/agentflow" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://twitter.com/agentflow" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Twitter
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
