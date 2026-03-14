// supabase/functions/on-user-signup/index.ts
// Deno Edge Function — triggered by auth.users INSERT via Database Webhook
// Creates: workspace → owner membership → starter canvas

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

interface WebhookPayload {
  type: "INSERT";
  table: "users";
  record: {
    id: string;
    email?: string;
    raw_user_meta_data?: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
  schema: "auth";
}

serve(async (req: Request) => {
  try {
    const payload: WebhookPayload = await req.json();
    const user = payload.record;

    // Use service role key so we can bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const displayName =
      user.raw_user_meta_data?.full_name ??
      user.raw_user_meta_data?.user_name ??
      user.email?.split("@")[0] ??
      "User";

    // Generate a URL-safe slug from the display name + random suffix
    const slug =
      displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8);

    // 1. Create workspace
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        name: `${displayName}'s Workspace`,
        slug,
        plan: "free",
      })
      .select("id")
      .single();

    if (wsError) throw wsError;

    // 2. Add user as workspace owner
    const { error: memberError } = await supabase
      .from("workspace_members")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      });

    if (memberError) throw memberError;

    // 3. Create a starter canvas
    const { error: canvasError } = await supabase.from("canvases").insert({
      workspace_id: workspace.id,
      name: "My First Canvas",
      description: "Get started by dragging agent nodes onto the canvas.",
      state: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
      created_by: user.id,
    });

    if (canvasError) throw canvasError;

    return new Response(
      JSON.stringify({
        message: "Workspace created",
        workspace_id: workspace.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("on-user-signup error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
