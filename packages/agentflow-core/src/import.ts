import * as yaml from "js-yaml";
import { AgentFlowYAMLSchema, type AgentFlowYAML } from "./schema";
import { autoLayout, type LayoutInput, type ConnectionInput } from "./layout";

// ---------- Result types ----------

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

interface CanvasNode {
  id: string;
  type: "agent" | "mcp" | "hook";
  position: { x: number; y: number };
  data: AgentNodeData | MCPNodeData;
}

interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: { x: number; y: number; zoom: number };
}

export interface ImportSuccess {
  ok: true;
  canvasName: string;
  state: CanvasState;
}

export interface ImportError {
  ok: false;
  errors: string[];
}

export type ImportResult = ImportSuccess | ImportError;

// ---------- Import engine ----------

/**
 * Parse a YAML string and convert it into a CanvasState.
 * Returns validation errors if the YAML doesn't match the AgentFlow schema.
 */
export function importYAMLToCanvas(yamlString: string): ImportResult {
  // 1. Parse YAML
  let raw: unknown;
  try {
    raw = yaml.load(yamlString);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid YAML syntax";
    return { ok: false, errors: [`YAML parse error: ${message}`] };
  }

  // 2. Validate against Zod schema
  const result = AgentFlowYAMLSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    );
    return { ok: false, errors };
  }

  const doc: AgentFlowYAML = result.data;

  // 3. Build layout inputs
  const layoutItems: LayoutInput[] = [];
  const layoutConnections: ConnectionInput[] = [];

  for (const agent of doc.agents) {
    layoutItems.push({ name: agent.name, kind: agent.type });
  }
  for (const mcp of doc.mcp_servers) {
    layoutItems.push({ name: mcp.name, kind: "mcp" });
  }
  for (const conn of doc.connections) {
    layoutConnections.push({ from: conn.from, to: conn.to });
  }

  const positions = autoLayout(layoutItems, layoutConnections);

  // 4. Build name → ID map
  const nameToId = new Map<string, string>();
  let idCounter = 1;
  for (const agent of doc.agents) {
    const id = `${agent.type}-${idCounter++}`;
    nameToId.set(agent.name, id);
  }
  for (const mcp of doc.mcp_servers) {
    const id = `mcp-${idCounter++}`;
    nameToId.set(mcp.name, id);
  }

  // 5. Convert agents → React Flow nodes
  const nodes: CanvasNode[] = [];

  for (const agent of doc.agents) {
    const id = nameToId.get(agent.name)!;
    const pos = positions[agent.name] ?? { x: 200, y: 200 };

    // Build tools record (enabled tools = true)
    const tools: Record<string, boolean> = {};
    for (const t of agent.allowed_tools) {
      tools[t] = true;
    }

    // Build hooks record
    const hooks: Record<string, boolean> = {};
    if (agent.hooks) {
      for (const hookType of Object.keys(agent.hooks)) {
        hooks[hookType] = true;
      }
    }

    nodes.push({
      id,
      type: "agent",
      position: pos,
      data: {
        nodeType: "agent",
        label: agent.name,
        agentType: agent.type,
        model: agent.model ?? "claude-sonnet-4-20250514",
        systemPrompt: agent.system_prompt,
        context: agent.context,
        tools,
        hooks,
      },
    });
  }

  // 6. Convert MCP servers → nodes
  for (const mcp of doc.mcp_servers) {
    const id = nameToId.get(mcp.name)!;
    const pos = positions[mcp.name] ?? { x: 400, y: 400 };

    nodes.push({
      id,
      type: "mcp",
      position: pos,
      data: {
        nodeType: "mcp",
        label: mcp.name,
        serverName: mcp.name,
        url: mcp.url,
        envVars: mcp.env,
      },
    });
  }

  // 7. Convert connections → edges
  const edges: CanvasEdge[] = doc.connections.map((conn, i) => {
    const sourceId = nameToId.get(conn.from) ?? conn.from;
    const targetId = nameToId.get(conn.to) ?? conn.to;
    return {
      id: `edge-${i + 1}`,
      source: sourceId,
      target: targetId,
      label: conn.via,
    };
  });

  return {
    ok: true,
    canvasName: doc.canvas_name,
    state: {
      nodes,
      edges,
      viewport: { x: 0, y: 0, zoom: 1 },
    },
  };
}
