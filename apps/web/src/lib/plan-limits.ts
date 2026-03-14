import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types";

// ---- PlanLimitError ----

export class PlanLimitError extends Error {
  feature: string;
  upgradeUrl: string;

  constructor(message: string, feature: string) {
    super(message);
    this.name = "PlanLimitError";
    this.feature = feature;
    this.upgradeUrl = "/pricing";
  }
}

// ---- Helper: get workspace plan ----

async function getWorkspacePlan(workspaceId: string): Promise<Plan> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId)
    .single();
  return (data?.plan as Plan) ?? "free";
}

// ---- Check functions ----

export async function checkCanvasLimit(workspaceId: string): Promise<void> {
  const plan = await getWorkspacePlan(workspaceId);
  if (plan !== "free") return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("canvases")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  if ((count ?? 0) >= 3) {
    throw new PlanLimitError(
      "You've reached the 3 canvas limit on the free plan. Upgrade to Pro for unlimited canvases.",
      "canvases"
    );
  }
}

export async function checkAgentLimit(
  canvasId: string,
  workspaceId: string
): Promise<void> {
  const plan = await getWorkspacePlan(workspaceId);
  if (plan !== "free") return;

  const supabase = await createClient();
  const { data } = await supabase
    .from("canvases")
    .select("state")
    .eq("id", canvasId)
    .single();

  if (!data?.state) return;

  const state = data.state as { nodes?: { type?: string }[] };
  const agentCount = (state.nodes ?? []).filter(
    (n) => n.type === "agent"
  ).length;

  if (agentCount >= 5) {
    throw new PlanLimitError(
      "You've reached the 5 agent limit per canvas on the free plan. Upgrade to Pro for unlimited agents.",
      "agents"
    );
  }
}

export async function checkVersionHistoryAccess(
  workspaceId: string
): Promise<void> {
  const plan = await getWorkspacePlan(workspaceId);
  if (plan === "free") {
    throw new PlanLimitError(
      "Version history is a Pro feature. Upgrade to access full version history.",
      "version_history"
    );
  }
}

export async function checkTestRunnerAccess(
  workspaceId: string
): Promise<void> {
  const plan = await getWorkspacePlan(workspaceId);
  if (plan === "free") {
    throw new PlanLimitError(
      "Test runner is a Pro feature. Upgrade to test your agent configurations.",
      "test_runner"
    );
  }
}

// ---- Client-side plan limit check (for API routes) ----

export function serializePlanLimitError(error: PlanLimitError) {
  return {
    error: "plan_limit",
    message: error.message,
    feature: error.feature,
    upgradeUrl: error.upgradeUrl,
  };
}
