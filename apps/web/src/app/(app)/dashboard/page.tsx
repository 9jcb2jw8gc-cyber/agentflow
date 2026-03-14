import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CanvasActions from "./CanvasActions";
import ImportButton from "@/components/dashboard/ImportButton";

export default async function DashboardPage() {
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

  const workspaceId = membership?.workspace_id;

  // Get workspace plan
  const { data: workspace } = workspaceId
    ? await supabase
        .from("workspaces")
        .select("plan")
        .eq("id", workspaceId)
        .single()
    : { data: null };

  const plan = workspace?.plan ?? "free";

  // Get canvases
  const { data: canvases } = workspaceId
    ? await supabase
        .from("canvases")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("updated_at", { ascending: false })
    : { data: [] };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Canvases</h1>
        <div className="flex items-center gap-3">
          <ImportButton />
          {workspaceId && (
            <CanvasActions
              workspaceId={workspaceId}
              plan={plan}
              canvasCount={canvases?.length ?? 0}
            />
          )}
        </div>
      </div>

      {!canvases || canvases.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-2">No canvases yet.</p>
          <p className="text-sm text-gray-400">
            Create your first canvas to start building agent workflows.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {canvases.map((c) => (
            <Link
              key={c.id}
              href={`/canvas/${c.id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <h2 className="font-semibold text-gray-900 truncate">{c.name}</h2>
              {c.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {c.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-3">
                Updated {new Date(c.updated_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
