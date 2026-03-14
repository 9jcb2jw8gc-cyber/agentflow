"use client";

import type { AgentType } from "@/types";
import { getToolsForAgentType } from "@/types";
import Tooltip from "./Tooltip";

interface ToolTogglesProps {
  tools: Record<string, boolean>;
  agentType: AgentType;
  onChange: (tools: Record<string, boolean>) => void;
}

export default function ToolToggles({ tools, agentType, onChange }: ToolTogglesProps) {
  const availableTools = getToolsForAgentType(agentType);

  const toggle = (toolName: string) => {
    onChange({ ...tools, [toolName]: !tools[toolName] });
  };

  const showTaskWarning = agentType === "specialist" && tools["Task"];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <label className="block text-xs font-medium text-gray-600">Allowed Tools</label>
        <Tooltip content="Toggle tools this agent can use">
          <span className="text-gray-400 cursor-help text-[10px]">ⓘ</span>
        </Tooltip>
      </div>

      <div className="space-y-1">
        {availableTools.map((tool) => (
          <div
            key={tool.name}
            className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
          >
            <Tooltip content={tool.description}>
              <span className="text-xs text-gray-700 cursor-default">{tool.name}</span>
            </Tooltip>
            <button
              type="button"
              onClick={() => toggle(tool.name)}
              className={`relative w-8 h-4 rounded-full transition-colors ${
                tools[tool.name] ? "bg-green-500" : "bg-gray-300"
              }`}
              aria-label={`Toggle ${tool.name}`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                  tools[tool.name] ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}

        {/* Custom tool input for specialists */}
        {agentType === "specialist" && (
          <div className="pt-1 border-t border-gray-100 mt-1">
            <p className="text-[10px] text-gray-400 mb-1">
              Connected MCP tools appear automatically
            </p>
          </div>
        )}
      </div>

      {showTaskWarning && (
        <div className="flex items-start gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-700">
          <span className="shrink-0 mt-px">⚠️</span>
          <span>Task tool is typically for coordinator agents only</span>
        </div>
      )}
    </div>
  );
}
