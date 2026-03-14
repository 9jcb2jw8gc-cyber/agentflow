"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportButton() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else {
          setErrors([data.error ?? "Import failed"]);
        }
        setLoading(false);
        return;
      }

      // Success — redirect to new canvas
      router.push(`/canvas/${data.canvasId}`);
    } catch {
      setErrors(["Import failed — network error"]);
      setLoading(false);
    }

    // Reset file input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept=".yaml,.yml"
        onChange={handleFileChange}
        className="hidden"
        id="import-yaml"
      />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
      >
        {loading ? "Importing…" : "Import YAML"}
      </button>

      {errors.length > 0 && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-1">
            Import failed:
          </p>
          <ul className="text-xs text-red-700 space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
