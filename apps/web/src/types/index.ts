// =============================================================
// AgentFlow — Core Type Definitions
// =============================================================

// ---- Enums & Literals ----

export type Plan = "free" | "pro" | "team" | "enterprise";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export type AgentType =
  | "conversational"
  | "coding"
  | "research"
  | "orchestrator"
  | "custom";

export type ContextType =
  | "file"
  | "url"
  | "text"
  | "repository"
  | "database";

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
  tools: string[];
  contextSources: { type: ContextType; uri: string }[];
  maxTurns?: number;
}

export interface MCPNodeData {
  nodeType: "mcp";
  label: string;
  serverName: string;
  command: string;
  args: string[];
  env: Record<string, string>;
}

export interface HookNodeData {
  nodeType: "hook";
  label: string;
  event: string;
  handler: string;
}

export interface AgentFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
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
