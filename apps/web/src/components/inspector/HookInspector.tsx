"use client";

import type { HookNodeData, HookType, AgentFlowNode, AgentFlowEdge } from "@/types";
import Tooltip from "./Tooltip";

interface HookInspectorProps {
  data: HookNodeData;
  nodeId: string;
  nodes: AgentFlowNode[];
  edges: AgentFlowEdge[];
  onChange: (data: HookNodeData) => void;
}

const HOOK_TYPES: { value: HookType; label: string; tip: string }[] = [
  {
    value: "PostToolUse",
    label: "PostToolUse",
    tip: "After tool call, before Claude sees result. Use for normalization.",
  },
  {
    value: "PreToolUse",
    label: "PreToolUse",
    tip: "Before tool call executes. Use for validation and ordering rules.",
  },
];

export default function HookInspector({ data, nodeId, nodes, edges, onChange }: HookInspectorProps) {
  const update = <K extends keyof HookNodeData>(key: K, value: HookNodeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  // Find agents connected to this hook node
  const connectedAgentIds = edges
    .filter((e) => e.source === nodeId || e.target === nodeId)
    .map((e) => (e.source === nodeId ? e.target : e.source));

  const connectedAgents = nodes.filter(
    (n) => connectedAgentIds.includes(n.id) && n.data.nodeType === "agent"
  );

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <Tooltip content="Display name for this hook on the canvas">
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

      {/* Hook Type */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Hook Type</label>
          <Tooltip content="When this hook fires during agent execution">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <select
          value={data.hookType}
          onChange={(e) => update("hookType", e.target.value as HookType)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {HOOK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {HOOK_TYPES.find((t) => t.value === data.hookType)?.tip}
        </p>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Description</label>
          <Tooltip content="Describe what this hook does in plain language">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <textarea
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y leading-relaxed"
          placeholder="Validates tool input before execution..."
        />
      </div>

      {/* Connected Agents */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Connected Agents</label>
          <Tooltip content="Agents this hook is attached to">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        {connectedAgents.length > 0 ? (
          <div className="space-y-1">
            {connectedAgents.map((a) => (
              <div
                key={a.id}
                className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-700 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                {a.data.label}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-gray-400">
            Connect to an agent node to attach this hook
          </p>
        )}
      </div>
    </div>
  );
}
