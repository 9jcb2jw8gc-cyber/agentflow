"use client";

import { useState } from "react";

interface UpgradePromptProps {
  message: string;
  feature: string;
  workspaceId: string;
  onDismiss: () => void;
}

const PRO_BENEFITS = [
  "Unlimited canvases",
  "Unlimited agents per canvas",
  "Version history",
  "Test runner",
  "YAML export",
  "Custom MCP servers",
  "Priority support",
];

export default function UpgradePrompt({
  message,
  feature,
  workspaceId,
  onDismiss,
}: UpgradePromptProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
          workspaceId,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Upgrade to Pro
          </h2>
        </div>

        {/* Limit message */}
        <p className="text-gray-600 mb-4">{message}</p>

        {/* Pro benefits */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Pro includes:
          </p>
          <ul className="space-y-1.5">
            {PRO_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "Redirecting to checkout…"
              : "Upgrade to Pro — $29/month"}
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
