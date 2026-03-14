"use client";

import type { AgentFlowNode, AgentFlowEdge, AgentNodeData, MCPNodeData, HookNodeData } from "@/types";
import AgentInspector from "./AgentInspector";
import MCPInspector from "./MCPInspector";
import HookInspector from "./HookInspector";

interface NodeInspectorProps {
  node: AgentFlowNode;
  nodes: AgentFlowNode[];
  edges: AgentFlowEdge[];
  onChange: (id: string, data: AgentFlowNode["data"]) => void;
  onClose: () => void;
}

export default function NodeInspector({ node, nodes, edges, onChange, onClose }: NodeInspectorProps) {
  const { data } = node;

  const typeLabel =
    data.nodeType === "agent"
      ? "Agent"
      : data.nodeType === "mcp"
        ? "MCP Server"
        : "Hook";

  const typeBadge =
    data.nodeType === "agent"
      ? "bg-blue-100 text-blue-700"
      : data.nodeType === "mcp"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700";

  return (
    <aside className="w-72 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">Inspector</h3>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${typeBadge}`}>
            {typeLabel}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none shrink-0 ml-2"
          aria-label="Close inspector"
        >
          ×
        </button>
      </div>

      {/* Content — scrollable */}
      <div className="px-4 py-3 flex-1 overflow-y-auto">
        {data.nodeType === "agent" && (
          <AgentInspector
            data={data as AgentNodeData}
            onChange={(d) => onChange(node.id, d)}
          />
        )}

        {data.nodeType === "mcp" && (
          <MCPInspector
            data={data as MCPNodeData}
            nodeId={node.id}
            nodes={nodes}
            edges={edges}
            onChange={(d) => onChange(node.id, d)}
          />
        )}

        {data.nodeType === "hook" && (
          <HookInspector
            data={data as HookNodeData}
            nodeId={node.id}
            nodes={nodes}
            edges={edges}
            onChange={(d) => onChange(node.id, d)}
          />
        )}
      </div>
    </aside>
  );
}
