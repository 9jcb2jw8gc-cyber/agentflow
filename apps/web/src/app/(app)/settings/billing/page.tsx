import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get user's workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) redirect("/dashboard");

  const workspaceId = membership.workspace_id;

  // Get workspace details
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, plan, stripe_customer_id, stripe_subscription_id")
    .eq("id", workspaceId)
    .single();

  if (!workspace) redirect("/dashboard");

  // Get canvas count
  const { count: canvasCount } = await supabase
    .from("canvases")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);

  // Get largest canvas agent count
  const { data: canvases } = await supabase
    .from("canvases")
    .select("state")
    .eq("workspace_id", workspaceId);

  let maxAgents = 0;
  if (canvases) {
    for (const c of canvases) {
      const state = c.state as { nodes?: { type?: string }[] } | null;
      const agentCount = (state?.nodes ?? []).filter(
        (n) => n.type === "agent"
      ).length;
      if (agentCount > maxAgents) maxAgents = agentCount;
    }
  }

  return (
    <BillingClient
      workspace={{
        id: workspace.id,
        name: workspace.name,
        plan: workspace.plan,
        stripeCustomerId: workspace.stripe_customer_id,
        stripeSubscriptionId: workspace.stripe_subscription_id,
      }}
      usage={{
        canvasCount: canvasCount ?? 0,
        maxAgentsInCanvas: maxAgents,
      }}
    />
  );
}
