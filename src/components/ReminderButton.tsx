"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

export function ReminderButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function send() {
    setError(null);
    setSent(false);
    setSaving(true);
    try {
      const res = await fetch(`/api/riparazioni/${id}/sollecito`, { method: "POST" });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Invio sollecito non riuscito");
      setSent(true);
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={send}
        disabled={saving || isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-arancio px-4 py-3 text-sm font-semibold text-white active:scale-[0.99] disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {saving || isPending ? "Invio..." : "Invia sollecito"}
      </button>
      {sent && <p className="text-xs font-semibold text-green-700">Sollecito inviato.</p>}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
