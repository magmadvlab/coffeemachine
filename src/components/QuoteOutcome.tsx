"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function QuoteOutcome({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"accetta" | "rifiuta" | null>(null);
  const [isPending, startTransition] = useTransition();

  async function registra(azione: "accetta" | "rifiuta") {
    setError(null);
    setSaving(azione);
    try {
      const res = await fetch(`/api/riparazioni/${id}/preventivo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ azione }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Operazione non riuscita");
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mt-4 border-t border-coffee-100 pt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-coffee-400">
        Esito preventivo (deciso dal cliente)
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => registra("accetta")}
          disabled={Boolean(saving) || isPending}
          className="rounded-full bg-arancio px-4 py-3 text-sm font-semibold text-white active:scale-[0.99] disabled:opacity-60"
        >
          {saving === "accetta" ? "..." : "Accettato"}
        </button>
        <button
          type="button"
          onClick={() => registra("rifiuta")}
          disabled={Boolean(saving) || isPending}
          className="rounded-full border border-coffee-200 bg-white px-4 py-3 text-sm font-semibold text-coffee-700 active:scale-[0.99] disabled:opacity-60"
        >
          {saving === "rifiuta" ? "..." : "Rifiutato"}
        </button>
      </div>
      {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
