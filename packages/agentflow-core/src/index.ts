// AgentFlow Core
// Agent definition schema, export/import engines, and auto-layout

export const AGENTFLOW_VERSION = "1.0";

// Schema & validation
export {
  AgentFlowYAMLSchema,
  AgentSchema,
  MCPServerSchema,
  ConnectionSchema,
  HookEntrySchema,
} from "./schema";
export type {
  AgentFlowYAML,
  AgentYAML,
  MCPServerYAML,
  ConnectionYAML,
} from "./schema";

// Export engine
export { exportCanvasToYAML } from "./export";
export type { ExportOptions } from "./export";

// Import engine
export { importYAMLToCanvas } from "./import";
export type { ImportResult, ImportSuccess, ImportError } from "./import";

// Layout
export { autoLayout } from "./layout";
export type { LayoutInput, ConnectionInput, Position } from "./layout";
