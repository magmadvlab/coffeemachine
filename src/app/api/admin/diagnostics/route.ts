import { NextResponse } from "next/server";
import { createServiceClient, hasServiceConfig } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth-server";
import { requireAdminApi } from "@/lib/authz";

export const runtime = "nodejs";

async function safeQuery<T>(label: string, fn: () => PromiseLike<{ data: T | null; error: any }>) {
  try {
    const { data, error } = await fn();
    if (error) {
      return {
        label,
        ok: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      };
    }
    return { label, ok: true, data };
  } catch (e: any) {
    return { label, ok: false, error: e.message ?? String(e) };
  }
}

export async function GET() {
  if (!hasServiceConfig()) {
    return NextResponse.json({ error: "Configurazione Supabase incompleta" }, { status: 503 });
  }

  const forbidden = await requireAdminApi("Solo un amministratore può leggere la diagnostica.");
  if (forbidden) return forbidden;

  const user = await getCurrentUser();
  const db = createServiceClient();
  const repairs = await safeQuery("riparazioni", () =>
    db
      .from("riparazioni")
      .select("id, numero_scheda, cliente_id, macchina_id, operatore_id, stato, data_ingresso, created_at, updated_at")
      .order("data_ingresso", { ascending: false })
      .limit(20),
  );

  const repairIds = repairs.ok
    ? ((repairs as any).data ?? []).map((row: any) => row.id).filter(Boolean)
    : [];
  const clienteIds = repairs.ok
    ? ((repairs as any).data ?? []).map((row: any) => row.cliente_id).filter(Boolean)
    : [];
  const macchinaIds = repairs.ok
    ? ((repairs as any).data ?? []).map((row: any) => row.macchina_id).filter(Boolean)
    : [];

  const [notifiche, foto, clienti, macchine] = await Promise.all([
    repairIds.length
      ? safeQuery("notifiche", () =>
          db.from("notifiche").select("id, riparazione_id, tipo, created_at").in("riparazione_id", repairIds),
        )
      : Promise.resolve({ label: "notifiche", ok: true, data: [] }),
    repairIds.length
      ? safeQuery("foto_riparazione", () =>
          db.from("foto_riparazione").select("id, riparazione_id, storage_path, created_at").in("riparazione_id", repairIds),
        )
      : Promise.resolve({ label: "foto_riparazione", ok: true, data: [] }),
    clienteIds.length
      ? safeQuery("clienti", () =>
          db.from("clienti").select("id, ragione_sociale, telefono, email, created_at").in("id", clienteIds),
        )
      : Promise.resolve({ label: "clienti", ok: true, data: [] }),
    macchinaIds.length
      ? safeQuery("macchine", () =>
          db.from("macchine").select("id, cliente_id, marca, modello, matricola, created_at").in("id", macchinaIds),
        )
      : Promise.resolve({ label: "macchine", ok: true, data: [] }),
  ]);

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    user: user?.email,
    repairs,
    related: { notifiche, foto, clienti, macchine },
  });
}
