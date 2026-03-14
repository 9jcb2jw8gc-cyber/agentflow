"use client";

import type { AgentNodeData, AgentType, ContextType } from "@/types";
import Tooltip from "./Tooltip";
import ToolToggles from "./ToolToggles";
import SystemPromptEditor from "./SystemPromptEditor";

interface AgentInspectorProps {
  data: AgentNodeData;
  onChange: (data: AgentNodeData) => void;
}

const AGENT_TYPES: { value: AgentType; label: string; tip: string }[] = [
  { value: "coordinator", label: "Coordinator", tip: "Orchestrates other agents using Task tool" },
  { value: "specialist", label: "Specialist", tip: "Focused expert — receives tasks from coordinator" },
  { value: "utility", label: "Utility", tip: "Shared helper agent for common operations" },
];

const CONTEXT_OPTIONS: { value: ContextType; label: string; tip: string }[] = [
  { value: "fork", label: "Fork", tip: "Isolated context — agent starts fresh" },
  { value: "inherit", label: "Inherit", tip: "Sees parent conversation history" },
];

export default function AgentInspector({ data, onChange }: AgentInspectorProps) {
  const update = <K extends keyof AgentNodeData>(key: K, value: AgentNodeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const handleExport = () => {
    const yaml = [
      `name: ${data.label}`,
      `type: ${data.agentType}`,
      `model: ${data.model}`,
      `context: ${data.context}`,
      `system_prompt: |`,
      ...data.systemPrompt.split("\n").map((l) => `  ${l}`),
      `tools:`,
      ...Object.entries(data.tools)
        .filter(([, v]) => v)
        .map(([k]) => `  - ${k}`),
      ...(Object.keys(data.hooks).length > 0
        ? [`hooks:`, ...Object.entries(data.hooks).filter(([, v]) => v).map(([k]) => `  - ${k}`)]
        : []),
    ].join("\n");

    const blob = new Blob([yaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.label.toLowerCase().replace(/\s+/g, "-")}-agent.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <Tooltip content="Display name for this agent on the canvas">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <input
          type="text"
          value={data.label}
          onChange={(e) => update("label", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Agent Type */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Agent Type</label>
          <Tooltip content="Determines available tools and behavior patterns">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <select
          value={data.agentType}
          onChange={(e) => update("agentType", e.target.value as AgentType)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {AGENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {AGENT_TYPES.find((t) => t.value === data.agentType)?.tip}
        </p>
      </div>

      {/* System Prompt */}
      <SystemPromptEditor
        value={data.systemPrompt}
        onChange={(v) => update("systemPrompt", v)}
      />

      {/* Context */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Context</label>
          <Tooltip content="How this agent receives conversation history">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <select
          value={data.context}
          onChange={(e) => update("context", e.target.value as ContextType)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {CONTEXT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {CONTEXT_OPTIONS.find((o) => o.value === data.context)?.tip}
        </p>
      </div>

      {/* Tool Toggles */}
      <ToolToggles
        tools={data.tools}
        agentType={data.agentType}
        onChange={(tools) => update("tools", tools)}
      />

      {/* Hooks */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Hooks</label>
          <Tooltip content="Lifecycle hooks that fire during agent execution">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <div className="space-y-1">
          {(["PostToolUse", "PreToolUse"] as const).map((hook) => (
            <div
              key={hook}
              className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
            >
              <Tooltip
                content={
                  hook === "PostToolUse"
                    ? "Fires after a tool call, before Claude sees the result"
                    : "Fires before a tool call executes"
                }
              >
                <span className="text-xs text-gray-700 cursor-default">{hook}</span>
              </Tooltip>
              <button
                type="button"
                onClick={() =>
                  update("hooks", { ...data.hooks, [hook]: !data.hooks[hook] })
                }
                className={`relative w-8 h-4 rounded-full transition-colors ${
                  data.hooks[hook] ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-label={`Toggle ${hook} hook`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                    data.hooks[hook] ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Export Agent */}
      <button
        type="button"
        onClick={handleExport}
        className="w-full py-1.5 px-3 text-xs font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        ↓ Export agent YAML
      </button>
    </div>
  );
}
