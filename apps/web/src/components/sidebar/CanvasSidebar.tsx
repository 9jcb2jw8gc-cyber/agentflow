"use client";

import { type DragEvent } from "react";

interface NodeTemplate {
  type: "agent" | "mcp" | "hook";
  label: string;
  description: string;
  color: string;
}

const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: "agent",
    label: "Agent",
    description: "Claude AI agent node",
    color: "border-blue-400 bg-blue-50",
  },
  {
    type: "mcp",
    label: "MCP Server",
    description: "Model Context Protocol server",
    color: "border-emerald-400 bg-emerald-50",
  },
  {
    type: "hook",
    label: "Hook",
    description: "Lifecycle event hook",
    color: "border-amber-400 bg-amber-50",
  },
];

interface CanvasSidebarProps {
  canvasName: string;
  saving: boolean;
}

export default function CanvasSidebar({ canvasName, saving }: CanvasSidebarProps) {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/agentflow-node", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-60 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 truncate">{canvasName}</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {saving ? "Saving…" : "All changes saved"}
        </p>
      </div>

      {/* Node palette */}
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
          Drag to canvas
        </p>
        <div className="space-y-2">
          {NODE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.type}
              draggable
              onDragStart={(e) => onDragStart(e, tpl.type)}
              className={`border-2 rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing select-none ${tpl.color} hover:shadow-sm transition-shadow`}
            >
              <p className="text-sm font-medium text-gray-800">{tpl.label}</p>
              <p className="text-[11px] text-gray-500">{tpl.description}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
