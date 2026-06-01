"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export function PhotoUploadForm({ id }: { id: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function upload() {
    if (!file) return;
    setError(null);
    setSaving(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("momento", "uscita");

      const res = await fetch(`/api/riparazioni/${id}/foto`, {
        method: "POST",
        body: form,
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Upload non riuscito");
      setFile(null);
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-coffee-400">
          Foto lavoro / uscita
        </span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-coffee-600"
        />
      </label>
      <button
        type="button"
        onClick={upload}
        disabled={!file || saving || isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-coffee-200 bg-white px-4 py-3 text-sm font-semibold text-coffee-700 active:scale-[0.99] disabled:opacity-60"
      >
        <Camera className="h-4 w-4" />
        {saving || isPending ? "Caricamento..." : "Aggiungi foto"}
      </button>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
