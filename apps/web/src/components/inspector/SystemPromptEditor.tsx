"use client";

import { useState, useCallback } from "react";
import Tooltip from "./Tooltip";

interface SystemPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SystemPromptEditor({ value, onChange }: SystemPromptEditorProps) {
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIAssist = useCallback(async () => {
    if (!value.trim()) return;
    setImproving(true);
    setError(null);

    try {
      const res = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let improved = "";

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        improved += decoder.decode(chunk, { stream: true });
        onChange(improved);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve prompt");
    } finally {
      setImproving(false);
    }
  }, [value, onChange]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="block text-xs font-medium text-gray-600">System Prompt</label>
          <Tooltip content="Instructions that define this agent's behavior and personality">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <button
          type="button"
          onClick={handleAIAssist}
          disabled={improving || !value.trim()}
          className="text-[10px] px-2 py-0.5 rounded bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {improving ? "Improving…" : "✨ AI assist"}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y leading-relaxed"
        placeholder="You are a helpful assistant that..."
      />

      {error && (
        <p className="text-[10px] text-red-600 px-1">{error}</p>
      )}
    </div>
  );
}
