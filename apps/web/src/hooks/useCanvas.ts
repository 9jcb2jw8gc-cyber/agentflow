"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Canvas, CanvasState, AgentFlowNode, AgentFlowEdge } from "@/types";

const AUTOSAVE_DELAY = 1500; // ms

const emptyState: CanvasState = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

export function useCanvas(canvasId: string) {
  const supabase = createClient();
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [nodes, setNodes] = useState<AgentFlowNode[]>([]);
  const [edges, setEdges] = useState<AgentFlowEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestStateRef = useRef<CanvasState>(emptyState);

  // ---------- Load ----------
  const loadCanvas = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("canvases")
      .select("*")
      .eq("id", canvasId)
      .single();

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    const c = data as Canvas;
    setCanvas(c);
    const state = (c.state ?? emptyState) as CanvasState;
    setNodes(state.nodes ?? []);
    setEdges(state.edges ?? []);
    latestStateRef.current = state;
    setLoading(false);
  }, [canvasId, supabase]);

  useEffect(() => {
    loadCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasId]);

  // ---------- Save ----------
  const saveCanvas = useCallback(
    async (state: CanvasState) => {
      setSaving(true);
      const { error: err } = await supabase
        .from("canvases")
        .update({ state, updated_at: new Date().toISOString() })
        .eq("id", canvasId);

      if (err) setError(err.message);
      setSaving(false);
    },
    [canvasId, supabase]
  );

  // ---------- Debounced auto-save ----------
  const scheduleSave = useCallback(
    (nextNodes: AgentFlowNode[], nextEdges: AgentFlowEdge[]) => {
      const state: CanvasState = {
        nodes: nextNodes,
        edges: nextEdges,
        viewport: latestStateRef.current.viewport,
      };
      latestStateRef.current = state;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveCanvas(state);
      }, AUTOSAVE_DELAY);
    },
    [saveCanvas]
  );

  // Wrapper setters that trigger auto-save
  const updateNodes = useCallback(
    (next: AgentFlowNode[]) => {
      setNodes(next);
      scheduleSave(next, latestStateRef.current.edges);
    },
    [scheduleSave]
  );

  const updateEdges = useCallback(
    (next: AgentFlowEdge[]) => {
      setEdges(next);
      scheduleSave(latestStateRef.current.nodes, next);
    },
    [scheduleSave]
  );

  const updateViewport = useCallback(
    (vp: { x: number; y: number; zoom: number }) => {
      latestStateRef.current = { ...latestStateRef.current, viewport: vp };
    },
    []
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        saveCanvas(latestStateRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    canvas,
    nodes,
    edges,
    loading,
    saving,
    error,
    setNodes: updateNodes,
    setEdges: updateEdges,
    updateViewport,
    saveNow: () => saveCanvas(latestStateRef.current),
  };
}
