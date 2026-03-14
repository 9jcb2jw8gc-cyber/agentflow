import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exportCanvasToYAML } from "@agentflow/core";

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

    const body = await request.json();
    const { canvasId } = body as { canvasId?: string };
    if (!canvasId) {
      return NextResponse.json(
        { error: "canvasId is required" },
        { status: 400 }
      );
    }

    // Fetch canvas (RLS ensures user has access)
    const { data: canvas, error: dbError } = await supabase
      .from("canvases")
      .select("*")
      .eq("id", canvasId)
      .single();

    if (dbError || !canvas) {
      return NextResponse.json(
        { error: "Canvas not found" },
        { status: 404 }
      );
    }

    // Run export engine — use whichever field name the DB returns
    const canvasState = canvas.state ?? canvas.canvas_state;
    const yamlString = exportCanvasToYAML(canvasState, {
      canvasName: canvas.name,
    });

    // Return YAML as file download
    const fileName = `${canvas.name.replace(/[^a-zA-Z0-9_-]/g, "_")}.yaml`;

    return new Response(yamlString, {
      status: 200,
      headers: {
        "Content-Type": "application/x-yaml",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
