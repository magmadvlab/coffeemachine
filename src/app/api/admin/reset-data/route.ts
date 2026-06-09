import { NextResponse } from "next/server";
import { createServiceClient, hasServiceConfig } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/authz";

export const runtime = "nodejs";

async function deleteAll(db: any, table: string) {
  const { error } = await db.from(table).delete().not("id", "is", null);
  if (error) throw error;
}

export async function POST() {
  if (!hasServiceConfig()) {
    return NextResponse.json({ error: "Configurazione Supabase incompleta" }, { status: 503 });
  }

  const forbidden = await requireAdminApi("Solo un amministratore può azzerare i dati.");
  if (forbidden) return forbidden;

  const db = createServiceClient();

  const { error: rpcError } = await db.rpc("admin_reset_operational_data");
  if (!rpcError) {
    return NextResponse.json({ ok: true, resetNumbering: true });
  }

  const functionMissing = rpcError.code === "PGRST202" || rpcError.code === "42883";
  if (!functionMissing) {
    return NextResponse.json({ error: rpcError.message, details: rpcError.details, hint: rpcError.hint }, { status: 400 });
  }

  try {
    await deleteAll(db, "notifiche");
    await deleteAll(db, "foto_riparazione");
    await deleteAll(db, "riparazioni");
    await deleteAll(db, "macchine");
    await deleteAll(db, "clienti");
  } catch (e: any) {
    return NextResponse.json({ error: e.message, details: e.details, hint: e.hint }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    resetNumbering: false,
    warning: "Dati eliminati, ma la numerazione non è stata azzerata: esegui supabase/06_reset_operational_data.sql.",
  });
}
