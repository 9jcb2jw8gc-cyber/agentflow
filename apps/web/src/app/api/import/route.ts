import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { importYAMLToCanvas } from "@agentflow/core";
import { PLAN_LIMITS } from "@/types";
import type { Plan } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No YAML file provided" },
        { status: 400 }
      );
    }

    // Read file content
    const yamlString = await file.text();
    if (!yamlString.trim()) {
      return NextResponse.json(
        { error: "Uploaded file is empty" },
        { status: 400 }
      );
    }

    // Run import engine
    const result = importYAMLToCanvas(yamlString);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Validation failed", errors: result.errors },
        { status: 400 }
      );
    }

    // Get user's workspace
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 }
      );
    }

    const workspaceId = membership.workspace_id;

    // Check plan limits (free plan = max 3 canvases)
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("plan")
      .eq("id", workspaceId)
      .single();

    const plan = (workspace?.plan ?? "free") as Plan;
    const limits = PLAN_LIMITS[plan];

    const { count: canvasCount } = await supabase
      .from("canvases")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId);

    if ((canvasCount ?? 0) >= limits.maxCanvases) {
      return NextResponse.json(
        {
          error: `Free plan limit reached (${limits.maxCanvases} canvases). Upgrade to Pro for more.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // Create new canvas with imported state
    const { data: newCanvas, error: insertError } = await supabase
      .from("canvases")
      .insert({
        workspace_id: workspaceId,
        name: result.canvasName,
        state: result.state,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (insertError || !newCanvas) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create canvas" },
        { status: 500 }
      );
    }

    return NextResponse.json({ canvasId: newCanvas.id });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
