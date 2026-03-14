"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { AgentNodeData, AgentType } from "@/types";

const agentTypeColors: Record<AgentType, { badge: string; border: string; dot: string }> = {
  coordinator: {
    badge: "bg-purple-100 text-purple-800",
    border: "border-purple-500",
    dot: "bg-purple-500",
  },
  specialist: {
    badge: "bg-teal-100 text-teal-800",
    border: "border-teal-500",
    dot: "bg-teal-500",
  },
  utility: {
    badge: "bg-orange-100 text-orange-800",
    border: "border-orange-500",
    dot: "bg-orange-500",
  },
};

export default function AgentNode({ data, selected }: NodeProps) {
  const d = data as unknown as AgentNodeData;
  const colors = agentTypeColors[d.agentType] ?? agentTypeColors.utility;

  const enabledTools = d.tools
    ? Object.entries(d.tools)
        .filter(([, v]) => v)
        .map(([k]) => k)
    : [];

  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-sm min-w-[200px] ${
        selected ? `${colors.border} shadow-md` : "border-gray-200"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500" />
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`} />
        <span className="text-sm font-semibold truncate">{d.label || "Agent"}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colors.badge}`}>
          {d.agentType}
        </span>
      </div>
      <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
        <p>
          Model: <span className="text-gray-700">{d.model || "—"}</span>
        </p>
        {enabledTools.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {enabledTools.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600 font-medium"
              >
                {t}
              </span>
            ))}
            {enabledTools.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                +{enabledTools.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500" />
    </div>
  );
}
