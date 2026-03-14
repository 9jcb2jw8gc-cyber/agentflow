"use client";

import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  BackgroundVariant,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import type {
  AgentFlowNode,
  AgentFlowEdge,
  AgentNodeData,
  MCPNodeData,
  HookNodeData,
} from "@/types";

import AgentNode from "./AgentNode";
import MCPNode from "./MCPNode";
import HookNode from "./HookNode";
import CanvasSidebar from "../sidebar/CanvasSidebar";
import NodeInspector from "../inspector/NodeInspector";
import ExportButton from "./ExportButton";
import UpgradePrompt from "../UpgradePrompt";

// Register custom node types
const nodeTypes: NodeTypes = {
  agent: AgentNode,
  mcp: MCPNode,
  hook: HookNode,
};

// Default data factories
function defaultAgentData(): AgentNodeData {
  return {
    nodeType: "agent",
    label: "New Agent",
    agentType: "coordinator",
    model: "claude-sonnet-4-20250514",
    systemPrompt: "",
    context: "fork",
    tools: {},
    hooks: {},
  };
}

function defaultMCPData(): MCPNodeData {
  return {
    nodeType: "mcp",
    label: "New MCP Server",
    serverName: "",
    url: "",
    envVars: {},
  };
}

function defaultHookData(): HookNodeData {
  return {
    nodeType: "hook",
    label: "New Hook",
    hookType: "PostToolUse",
    description: "",
  };
}

function makeDefaultData(type: string) {
  switch (type) {
    case "agent":
      return defaultAgentData();
    case "mcp":
      return defaultMCPData();
    case "hook":
      return defaultHookData();
    default:
      return defaultAgentData();
  }
}

// ---------- Component ----------

interface CanvasBuilderProps {
  canvasId: string;
  canvasName: string;
  workspaceId: string;
  plan: string;
}

export default function CanvasBuilder({ canvasId, canvasName, workspaceId, plan }: CanvasBuilderProps) {
  const {
    nodes: savedNodes,
    edges: savedEdges,
    loading,
    saving,
    error,
    setNodes: persistNodes,
    setEdges: persistEdges,
  } = useCanvas(canvasId);

  // React Flow internal state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Sync loaded data → React Flow state (once)
  const initialized = useRef(false);
  useEffect(() => {
    if (!loading && savedNodes && !initialized.current) {
      setNodes(savedNodes as unknown as Node[]);
      setEdges(savedEdges as unknown as Edge[]);
      initialized.current = true;
    }
  }, [loading, savedNodes, savedEdges, setNodes, setEdges]);

  // Persist on change
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  // Persist whenever nodes / edges change (after initial load)
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!initialized.current) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      persistNodes(nodes as unknown as AgentFlowNode[]);
      persistEdges(edges as unknown as AgentFlowEdge[]);
    }, 300);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // Connect handler
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Drag-and-drop handler
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/agentflow-node");
      if (!type || !rfInstance || !reactFlowWrapper.current) return;

      // Check agent limit for free plan
      if (type === "agent" && plan === "free") {
        const agentCount = nodes.filter((n) => n.type === "agent").length;
        if (agentCount >= 5) {
          setShowUpgrade(true);
          return;
        }
      }

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: makeDefaultData(type) as unknown as Record<string, unknown>,
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes, nodes, plan]
  );

  // Node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Inspector update
  const handleInspectorChange = useCallback(
    (id: string, data: AgentFlowNode["data"]) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === id ? { ...n, data: { ...data } } : n))
      );
    },
    [setNodes]
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading canvas…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <CanvasSidebar canvasName={canvasName} saving={saving} />

      <div className="flex-1 h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
          <span className="text-sm font-medium text-gray-700 truncate">
            {canvasName}
          </span>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-xs text-gray-400">Saving…</span>
            )}
            <ExportButton canvasId={canvasId} variant="toolbar" />
          </div>
        </div>

        <div ref={reactFlowWrapper} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="!bg-white !border-gray-200"
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
        </div>
      </div>

      {selectedNode ? (
        <NodeInspector
          node={selectedNode as unknown as AgentFlowNode}
          nodes={nodes as unknown as AgentFlowNode[]}
          edges={edges as unknown as AgentFlowEdge[]}
          onChange={handleInspectorChange}
          onClose={() => setSelectedNodeId(null)}
        />
      ) : (
        <aside className="w-72 border-l border-gray-200 bg-white flex items-center justify-center">
          <p className="text-sm text-gray-400 text-center px-6">
            Click a node to inspect it
          </p>
        </aside>
      )}

      {showUpgrade && (
        <UpgradePrompt
          message="You've reached the 5 agent limit per canvas on the free plan. Upgrade to Pro for unlimited agents."
          feature="agents"
          workspaceId={workspaceId}
          onDismiss={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
