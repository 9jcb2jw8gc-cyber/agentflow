"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UpgradePrompt from "@/components/UpgradePrompt";

interface CanvasActionsProps {
  workspaceId: string;
  plan: string;
  canvasCount: number;
}

export default function CanvasActions({
  workspaceId,
  plan,
  canvasCount,
}: CanvasActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [creating, setCreating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const createCanvas = async () => {
    // Check canvas limit for free plan
    if (plan === "free" && canvasCount >= 3) {
      setShowUpgrade(true);
      return;
    }

    setCreating(true);
    const { data, error } = await supabase
      .from("canvases")
      .insert({
        workspace_id: workspaceId,
        name: `Canvas ${new Date().toLocaleDateString()}`,
        state: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
      })
      .select("id")
      .single();

    if (!error && data) {
      router.push(`/canvas/${data.id}`);
    }
    setCreating(false);
  };

  return (
    <>
      <button
        onClick={createCanvas}
        disabled={creating}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {creating ? "Creating…" : "+ New Canvas"}
      </button>

      {showUpgrade && (
        <UpgradePrompt
          message="You've reached the 3 canvas limit on the free plan. Upgrade to Pro for unlimited canvases."
          feature="canvases"
          workspaceId={workspaceId}
          onDismiss={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}
