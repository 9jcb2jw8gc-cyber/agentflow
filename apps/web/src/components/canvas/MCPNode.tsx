"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { MCPNodeData } from "@/types";

export default function MCPNode({ data, selected }: NodeProps) {
  const d = data as unknown as MCPNodeData;

  const envCount = d.envVars ? Object.keys(d.envVars).length : 0;

  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-sm min-w-[200px] ${
        selected ? "border-emerald-500 shadow-md" : "border-gray-200"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-3 !h-3" />
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-sm font-semibold truncate">{d.label || "MCP Server"}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
          mcp
        </span>
      </div>
      <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
        <p>Server: <span className="text-gray-700">{d.serverName || "—"}</span></p>
        <p>URL: <span className="text-gray-700 font-mono truncate block">{d.url || "—"}</span></p>
        {envCount > 0 && (
          <p className="text-[10px] text-gray-400">{envCount} env var{envCount !== 1 ? "s" : ""}</p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-3 !h-3" />
    </div>
  );
}
