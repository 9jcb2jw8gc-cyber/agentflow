import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CanvasBuilder from "@/components/canvas/CanvasBuilder";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: canvas, error } = await supabase
    .from("canvases")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !canvas) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Canvas not found.
      </div>
    );
  }

  // Get workspace plan for limit enforcement
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("plan")
    .eq("id", canvas.workspace_id)
    .single();

  const plan = workspace?.plan ?? "free";

  return (
    <div className="h-screen w-full">
      <CanvasBuilder
        canvasId={canvas.id}
        canvasName={canvas.name}
        workspaceId={canvas.workspace_id}
        plan={plan}
      />
    </div>
  );
}
