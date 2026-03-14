// =============================================================
// AgentFlow — Core Type Definitions
// =============================================================

// ---- Enums & Literals ----

export type Plan = "free" | "pro" | "team" | "enterprise";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export type AgentType = "coordinator" | "specialist" | "utility";

export type ContextType = "fork" | "inherit";

export type HookType = "PostToolUse" | "PreToolUse";

// ---- Database Row Types ----

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  created_at: string;
}

export interface Canvas {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  state: CanvasState;
  is_template: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CanvasVersion {
  id: string;
  canvas_id: string;
  version: number;
  state: CanvasState;
  created_by: string | null;
  created_at: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  config: Record<string, unknown>;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Canvas / React Flow Types ----

export interface CanvasState {
  nodes: AgentFlowNode[];
  edges: AgentFlowEdge[];
  viewport: { x: number; y: number; zoom: number };
}

export type AgentFlowNode = {
  id: string;
  type: "agent" | "mcp" | "hook";
  position: { x: number; y: number };
  data: AgentNodeData | MCPNodeData | HookNodeData;
};

export interface AgentNodeData {
  nodeType: "agent";
  label: string;
  agentType: AgentType;
  model: string;
  systemPrompt: string;
  context: ContextType;
  tools: Record<string, boolean>;
  hooks: Record<string, boolean>;
}

export interface MCPNodeData {
  nodeType: "mcp";
  label: string;
  serverName: string;
  url: string;
  envVars: Record<string, string>;
}

export interface HookNodeData {
  nodeType: "hook";
  label: string;
  hookType: HookType;
  description: string;
}

export interface AgentFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

// ---- Tool Definitions ----

export interface ToolDefinition {
  name: string;
  description: string;
  /** Which agent types this tool is available to */
  availableTo: AgentType[];
}

export const COORDINATOR_TOOLS: ToolDefinition[] = [
  { name: "Task", description: "Delegate tasks to specialist agents", availableTo: ["coordinator"] },
  { name: "Bash", description: "Execute shell commands", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "AskUserQuestion", description: "Prompt the user for clarification", availableTo: ["coordinator"] },
  { name: "WebSearch", description: "Search the web for information", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "WebFetch", description: "Fetch content from a URL", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "Read", description: "Read files from the filesystem", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "Write", description: "Write files to the filesystem", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "Edit", description: "Edit existing files", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "Glob", description: "Find files by pattern", availableTo: ["coordinator", "specialist", "utility"] },
  { name: "Grep", description: "Search file contents with regex", availableTo: ["coordinator", "specialist", "utility"] },
];

export function getToolsForAgentType(agentType: AgentType): ToolDefinition[] {
  return COORDINATOR_TOOLS.filter((t) => t.availableTo.includes(agentType));
}

// ---- Plan Limits ----

export interface PlanLimits {
  maxCanvases: number;
  maxNodesPerCanvas: number;
  maxWorkspaceMembers: number;
  canExportYAML: boolean;
  canUseCustomMCPs: boolean;
  canUseVersionHistory: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxCanvases: 3,
    maxNodesPerCanvas: 10,
    maxWorkspaceMembers: 1,
    canExportYAML: false,
    canUseCustomMCPs: false,
    canUseVersionHistory: false,
  },
  pro: {
    maxCanvases: 25,
    maxNodesPerCanvas: 50,
    maxWorkspaceMembers: 1,
    canExportYAML: true,
    canUseCustomMCPs: true,
    canUseVersionHistory: true,
  },
  team: {
    maxCanvases: 100,
    maxNodesPerCanvas: 100,
    maxWorkspaceMembers: 10,
    canExportYAML: true,
    canUseCustomMCPs: true,
    canUseVersionHistory: true,
  },
  enterprise: {
    maxCanvases: Infinity,
    maxNodesPerCanvas: Infinity,
    maxWorkspaceMembers: Infinity,
    canExportYAML: true,
    canUseCustomMCPs: true,
    canUseVersionHistory: true,
  },
} as const;
