"use client";

import type { MCPNodeData, AgentFlowNode, AgentFlowEdge } from "@/types";
import Tooltip from "./Tooltip";

interface MCPInspectorProps {
  data: MCPNodeData;
  nodeId: string;
  nodes: AgentFlowNode[];
  edges: AgentFlowEdge[];
  onChange: (data: MCPNodeData) => void;
}

export default function MCPInspector({ data, nodeId, nodes, edges, onChange }: MCPInspectorProps) {
  const update = <K extends keyof MCPNodeData>(key: K, value: MCPNodeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  // Find agents connected to this MCP node
  const connectedAgentIds = edges
    .filter((e) => e.source === nodeId || e.target === nodeId)
    .map((e) => (e.source === nodeId ? e.target : e.source));

  const connectedAgents = nodes.filter(
    (n) => connectedAgentIds.includes(n.id) && n.data.nodeType === "agent"
  );

  const addEnvVar = () => {
    const key = `VAR_${Object.keys(data.envVars).length + 1}`;
    update("envVars", { ...data.envVars, [key]: "" });
  };

  const removeEnvVar = (key: string) => {
    const next = { ...data.envVars };
    delete next[key];
    update("envVars", next);
  };

  const renameEnvVar = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const next = { ...data.envVars };
    const val = next[oldKey] ?? "";
    delete next[oldKey];
    next[newKey] = val;
    update("envVars", next);
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <Tooltip content="Display name for this MCP server node">
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

      {/* Server Name */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Server Name</label>
          <Tooltip content="Identifier used in the Claude Agent SDK config">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <input
          type="text"
          value={data.serverName}
          onChange={(e) => update("serverName", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="my-mcp-server"
        />
      </div>

      {/* Server URL */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Server URL</label>
          <Tooltip content="The URL or command to connect to this MCP server">
            <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
          </Tooltip>
        </div>
        <input
          type="text"
          value={data.url}
          onChange={(e) => update("url", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="npx -y @mcp/server"
        />
      </div>

      {/* Environment Variables */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <label className="text-xs font-medium text-gray-600">Environment Variables</label>
            <Tooltip content="Actual values come from your environment — never stored here">
              <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
            </Tooltip>
          </div>
          <button
            type="button"
            onClick={addEnvVar}
            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            + Add
          </button>
        </div>

        <div className="space-y-1.5">
          {Object.entries(data.envVars).map(([key]) => (
            <div key={key} className="flex items-center gap-1">
              <input
                type="text"
                value={key}
                onChange={(e) => renameEnvVar(key, e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"))}
                className="flex-1 border border-gray-300 rounded px-1.5 py-0.5 text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-[10px] text-gray-400 shrink-0">${`{${key}}`}</span>
              <button
                type="button"
                onClick={() => removeEnvVar(key)}
                className="text-gray-400 hover:text-red-500 text-sm leading-none"
                aria-label={`Remove ${key}`}
              >
                ×
              </button>
            </div>
          ))}

          {Object.keys(data.envVars).length === 0 && (
            <p className="text-[10px] text-gray-400">No env vars configured</p>
          )}
        </div>
      </div>

      {/* Connected Agents */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label className="text-xs font-medium text-gray-600">Connected Agents</label>
          <Tooltip content="Agents that use this MCP server's tools">
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
            Connect an agent node to this MCP server
          </p>
        )}
      </div>
    </div>
  );
}
