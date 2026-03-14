// ---------- Auto-layout algorithm ----------
// Positions imported nodes on the React Flow canvas.
//
// Rules (from spec):
//   - Coordinator nodes:  y = 50,  centered horizontally
//   - Specialist nodes:   y = 220, spread with 180px gap
//   - Utility nodes:      y = 220, placed after specialists
//   - MCP nodes:          y = 400, centered below connected specialists
//   - Hook nodes:         same y as connected agent, x = agent.x + 160

export interface LayoutInput {
  /** Agent / MCP / Hook name */
  name: string;
  /** Node kind */
  kind: "coordinator" | "specialist" | "utility" | "mcp" | "hook";
}

export interface ConnectionInput {
  from: string;
  to: string;
}

export interface Position {
  x: number;
  y: number;
}

const COORD_Y = 50;
const SPECIALIST_Y = 220;
const MCP_Y = 400;
const H_GAP = 180;
const HOOK_X_OFFSET = 160;
const CANVAS_CENTER_X = 400;

/**
 * Compute React Flow positions for a set of nodes and connections.
 * Returns a map of name → {x, y}.
 */
export function autoLayout(
  items: LayoutInput[],
  connections: ConnectionInput[]
): Record<string, Position> {
  const positions: Record<string, Position> = {};

  // Separate by kind
  const coordinators = items.filter((i) => i.kind === "coordinator");
  const specialists = items.filter(
    (i) => i.kind === "specialist" || i.kind === "utility"
  );
  const mcps = items.filter((i) => i.kind === "mcp");
  const hooks = items.filter((i) => i.kind === "hook");

  // ---- Coordinators: y = 50, centered ----
  const coordTotalWidth = (coordinators.length - 1) * H_GAP;
  const coordStartX = CANVAS_CENTER_X - coordTotalWidth / 2;
  coordinators.forEach((c, i) => {
    positions[c.name] = { x: coordStartX + i * H_GAP, y: COORD_Y };
  });

  // ---- Specialists: y = 220, spread horizontally ----
  const specTotalWidth = (specialists.length - 1) * H_GAP;
  const specStartX = CANVAS_CENTER_X - specTotalWidth / 2;
  specialists.forEach((s, i) => {
    positions[s.name] = { x: specStartX + i * H_GAP, y: SPECIALIST_Y };
  });

  // ---- MCP nodes: y = 400, centered below connected specialists ----
  mcps.forEach((mcp) => {
    // Find specialists connected to this MCP
    const connectedSpecNames = connections
      .filter((c) => c.to === mcp.name)
      .map((c) => c.from)
      .filter((name) => positions[name] !== undefined);

    if (connectedSpecNames.length > 0) {
      const avgX =
        connectedSpecNames.reduce((sum, n) => sum + positions[n].x, 0) /
        connectedSpecNames.length;
      positions[mcp.name] = { x: avgX, y: MCP_Y };
    } else {
      // No connections — place at center
      positions[mcp.name] = { x: CANVAS_CENTER_X, y: MCP_Y };
    }
  });

  // ---- Hook nodes: same y as connected agent, x = agent.x + 160 ----
  hooks.forEach((hook) => {
    // Find the agent this hook connects to
    const conn = connections.find(
      (c) => c.to === hook.name || c.from === hook.name
    );
    const agentName = conn
      ? conn.from === hook.name
        ? conn.to
        : conn.from
      : undefined;

    if (agentName && positions[agentName]) {
      positions[hook.name] = {
        x: positions[agentName].x + HOOK_X_OFFSET,
        y: positions[agentName].y,
      };
    } else {
      positions[hook.name] = { x: CANVAS_CENTER_X + HOOK_X_OFFSET, y: SPECIALIST_Y };
    }
  });

  return positions;
}
