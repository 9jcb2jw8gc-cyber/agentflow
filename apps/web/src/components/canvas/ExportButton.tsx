"use client";

import { useState } from "react";

interface ExportButtonProps {
  canvasId: string;
  /** Render as a compact icon button when used in the toolbar */
  variant?: "toolbar" | "inspector";
}

export default function ExportButton({
  canvasId,
  variant = "toolbar",
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [yamlPreview, setYamlPreview] = useState("");
  const [fullYaml, setFullYaml] = useState("");
  const [toast, setToast] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasId }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Export failed");
        setLoading(false);
        return;
      }

      const yamlText = await res.text();
      setFullYaml(yamlText);

      // Show first 20 lines as preview
      const lines = yamlText.split("\n");
      const previewLines = lines.slice(0, 20).join("\n");
      setYamlPreview(
        previewLines + (lines.length > 20 ? `\n# ... (${lines.length - 20} more lines)` : "")
      );
      setShowPreview(true);
    } catch {
      alert("Export failed — network error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([fullYaml], { type: "application/x-yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agentflow-export.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowPreview(false);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const isToolbar = variant === "toolbar";

  return (
    <>
      <button
        onClick={handleExport}
        disabled={loading}
        className={
          isToolbar
            ? "px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            : "w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        }
      >
        {loading ? "Exporting…" : isToolbar ? "Export YAML" : "Export as YAML"}
      </button>

      {/* YAML Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Export Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &times;
              </button>
            </div>
            <div className="p-5">
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono text-gray-800 overflow-auto max-h-72 whitespace-pre-wrap">
                {yamlPreview}
              </pre>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Download .yaml
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow-lg animate-pulse">
          Exported!
        </div>
      )}
    </>
  );
}
