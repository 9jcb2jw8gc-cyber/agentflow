import { z } from "zod";

// ---------- AgentFlow YAML Schema ----------
// Validates the structure of an AgentFlow YAML configuration file.

export const HookEntrySchema = z.record(z.string(), z.string());

export const AgentSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  type: z.enum(["coordinator", "specialist", "utility"]),
  context: z.enum(["fork", "inherit"]).default("fork"),
  model: z.string().optional(),
  system_prompt: z.string().min(1, "System prompt is required"),
  allowed_tools: z.array(z.string()).default([]),
  hooks: HookEntrySchema.optional().default({}),
});

export const MCPServerSchema = z.object({
  name: z.string().min(1, "MCP server name is required"),
  url: z.string().min(1, "MCP server URL is required"),
  env: z.record(z.string(), z.string()).optional().default({}),
});

export const ConnectionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  via: z.string().optional().default("Task"),
});

export const AgentFlowYAMLSchema = z.object({
  agentflow_version: z.literal("1.0"),
  canvas_name: z.string().min(1, "Canvas name is required"),
  exported_at: z.string().optional(),
  agents: z.array(AgentSchema).min(1, "At least one agent is required"),
  mcp_servers: z.array(MCPServerSchema).optional().default([]),
  connections: z.array(ConnectionSchema).optional().default([]),
});

export type AgentFlowYAML = z.infer<typeof AgentFlowYAMLSchema>;
export type AgentYAML = z.infer<typeof AgentSchema>;
export type MCPServerYAML = z.infer<typeof MCPServerSchema>;
export type ConnectionYAML = z.infer<typeof ConnectionSchema>;
