"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { HookNodeData } from "@/types";

export default function HookNode({ data, selected }: NodeProps) {
  const d = data as unknown as HookNodeData;

  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-sm min-w-[200px] ${
        selected ? "border-amber-500 shadow-md" : "border-gray-200"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3" />
      <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <span className="text-sm font-semibold truncate">{d.label || "Hook"}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
          {d.hookType || "hook"}
        </span>
      </div>
      <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
        <p>Type: <span className="text-gray-700">{d.hookType || "—"}</span></p>
        {d.description && (
          <p className="text-gray-600 truncate">{d.description}</p>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3 !h-3" />
    </div>
  );
}
