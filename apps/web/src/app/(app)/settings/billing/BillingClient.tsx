"use client";

import { useState } from "react";
import Link from "next/link";

interface BillingClientProps {
  workspace: {
    id: string;
    name: string;
    plan: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  };
  usage: {
    canvasCount: number;
    maxAgentsInCanvas: number;
  };
}

export default function BillingClient({
  workspace,
  usage,
}: BillingClientProps) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const isPro = workspace.plan === "pro";

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: workspace.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to open portal");
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async () => {
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
          workspaceId: workspace.id,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to start checkout");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Billing &amp; Plan
      </h1>

      {/* Current Plan */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Current Plan
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPro
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isPro ? "Pro" : "Free"}
              </span>
              <span className="text-sm text-gray-500">
                {workspace.name}
              </span>
            </div>
          </div>
          {isPro ? (
            <button
              onClick={handleManageSubscription}
              disabled={loadingPortal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {loadingPortal ? "Opening…" : "Manage subscription"}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loadingCheckout}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loadingCheckout ? "Redirecting…" : "Upgrade to Pro"}
            </button>
          )}
        </div>

        {isPro && (
          <p className="text-sm text-gray-500">
            Your Pro subscription is active. Manage billing, update payment
            method, or cancel via the Stripe Customer Portal.
          </p>
        )}

        {!isPro && (
          <p className="text-sm text-gray-500">
            Upgrade to Pro for unlimited canvases, unlimited agents, version
            history, test runner, and more.{" "}
            <span className="font-medium text-gray-700">$29/month</span> or{" "}
            <span className="font-medium text-gray-700">
              $290/year (save 17%)
            </span>
            .
          </p>
        )}
      </div>

      {/* Usage Stats */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Canvases</span>
              <span className="text-sm font-medium text-gray-900">
                {usage.canvasCount}
                {!isPro && " / 3"}
              </span>
            </div>
            {!isPro && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    usage.canvasCount >= 3 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min((usage.canvasCount / 3) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">
                Max agents in a canvas
              </span>
              <span className="text-sm font-medium text-gray-900">
                {usage.maxAgentsInCanvas}
                {!isPro && " / 5"}
              </span>
            </div>
            {!isPro && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    usage.maxAgentsInCanvas >= 5 ? "bg-red-500" : "bg-blue-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (usage.maxAgentsInCanvas / 5) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Version history</span>
            <span
              className={`text-sm font-medium ${
                isPro ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isPro ? "Enabled" : "Pro only"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Test runner</span>
            <span
              className={`text-sm font-medium ${
                isPro ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isPro ? "Enabled" : "Pro only"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">YAML export</span>
            <span
              className={`text-sm font-medium ${
                isPro ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isPro ? "Enabled" : "Pro only"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
