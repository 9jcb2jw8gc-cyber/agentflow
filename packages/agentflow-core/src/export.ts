import * as yaml from "js-yaml";

// ---------- Types (inline to avoid cross-package dep on web types) ----------

interface AgentNodeData {
  nodeType: "agent";
  label: string;
  agentType: "coordinator" | "specialist" | "utility";
  model: string;
  systemPrompt: string;
  context: "fork" | "inherit";
  tools: Record<string, boolean>;
  hooks: Record<string, boolean>;
}

interface MCPNodeData {
  nodeType: "mcp";
  label: string;
  serverName: string;
  url: string;
  envVars: Record<string, string>;
}

interface HookNodeData {
  nodeType: "hook";
  label: string;
  hookType: "PostToolUse" | "PreToolUse";
  description: string;
}

interface CanvasNode {
  id: string;
  type: "agent" | "mcp" | "hook";
  position: { x: number; y: number };
  data: AgentNodeData | MCPNodeData | HookNodeData;
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

// ---------- Helpers ----------

const ENV_VAR_PATTERN = /^\$\{[A-Z_][A-Z0-9_]*\}$/;

/**
 * Sanitise an env-var value so credentials never leak into YAML.
 * If the value already looks like `${VAR_NAME}`, keep it.
 * Otherwise replace it with `${VAR_NAME_PLACEHOLDER}`.
 */
function sanitiseEnvValue(key: string, value: string): string {
  if (ENV_VAR_PATTERN.test(value)) return value;
  // Derive a placeholder from the key name
  const safeKey = key
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, "_")
    .replace(/_+/g, "_");
  return `\${${safeKey}}`;
}

/**
 * Determine the "via" label for a connection between two nodes.
 */
function connectionVia(
  sourceNode: CanvasNode,
  targetNode: CanvasNode
): string {
  if (targetNode.type === "mcp") return "MCP";
  if (targetNode.type === "hook") return "Hook";
  // agent → agent: default to Task
  return "Task";
}

// ---------- Export Engine ----------

export interface ExportOptions {
  canvasName: string;
}

/**
 * Convert a CanvasState (React Flow nodes + edges) into an AgentFlow YAML string.
 *
 * IMPORTANT: No credential values will appear in the output — only `${VAR_NAME}` references.
 */
export function exportCanvasToYAML(
  state: CanvasState,
  options: ExportOptions
): string {
  const { nodes, edges } = state;

  // Separate node types
  const agentNodes = nodes.filter(
    (n): n is CanvasNode & { data: AgentNodeData } => n.type === "agent"
  );
  const mcpNodes = nodes.filter(
    (n): n is CanvasNode & { data: MCPNodeData } => n.type === "mcp"
  );

  // Build agent name → id lookup
  const nodeIdToName = new Map<string, string>();
  for (const n of nodes) {
    if (n.type === "agent") {
      nodeIdToName.set(n.id, (n.data as AgentNodeData).label);
    } else if (n.type === "mcp") {
      nodeIdToName.set(n.id, (n.data as MCPNodeData).serverName || (n.data as MCPNodeData).label);
    } else if (n.type === "hook") {
      nodeIdToName.set(n.id, (n.data as HookNodeData).label);
    }
  }

  // Build agents array
  const agents = agentNodes.map((n) => {
    const d = n.data;
    const enabledTools = Object.entries(d.tools)
      .filter(([, on]) => on)
      .map(([name]) => name);

    const enabledHooks: Record<string, string> = {};
    for (const [hookName, enabled] of Object.entries(d.hooks)) {
      if (enabled) enabledHooks[hookName] = hookName.toLowerCase();
    }

    const agent: Record<string, unknown> = {
      name: d.label,
      type: d.agentType,
      context: d.context,
      system_prompt: d.systemPrompt,
      allowed_tools: enabledTools,
    };
    if (d.model) agent.model = d.model;
    if (Object.keys(enabledHooks).length > 0) agent.hooks = enabledHooks;
    else agent.hooks = {};
    return agent;
  });

  // Build MCP servers array — credentials scrubbed
  const mcp_servers = mcpNodes.map((n) => {
    const d = n.data;
    const sanitisedEnv: Record<string, string> = {};
    for (const [k, v] of Object.entries(d.envVars)) {
      sanitisedEnv[k] = sanitiseEnvValue(k, v);
    }
    return {
      name: d.serverName || d.label,
      url: d.url,
      env: sanitisedEnv,
    };
  });

  // Build connections from edges
  const connections = edges.map((e) => ({
    from: nodeIdToName.get(e.source) ?? e.source,
    to: nodeIdToName.get(e.target) ?? e.target,
    via: connectionVia(
      nodes.find((n) => n.id === e.source)!,
      nodes.find((n) => n.id === e.target)!
    ),
  }));

  // Assemble top-level document
  const doc: Record<string, unknown> = {
    agentflow_version: "1.0",
    canvas_name: options.canvasName,
    exported_at: new Date().toISOString(),
    agents,
  };
  if (mcp_servers.length > 0) doc.mcp_servers = mcp_servers;
  if (connections.length > 0) doc.connections = connections;

  return yaml.dump(doc, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
}
