import { createServerSupabase } from "@/lib/supabase/auth-server";

/**
 * Operatore corrispondente all'utente loggato (collegato via auth_user_id).
 * Ritorna null se non c'è sessione o l'utente non è collegato a un operatore.
 */
export async function getSessionOperatore(db: any) {
  const sb = createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data, error } = await db
    .from("operatori")
    .select("id, nome, auth_user_id, attivo")
    .eq("auth_user_id", user.id)
    .eq("attivo", true)
    .limit(1);
  if (error) throw error;
  if (data?.[0]) return data[0];

  // Auto-provisioning: ogni utente loggato (es. l'admin creato a mano in
  // Supabase) viene collegato automaticamente a un operatore.
  const nomeBase =
    (user.user_metadata?.name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Operatore";

  const { data: created } = await db
    .from("operatori")
    .insert({ nome: nomeBase, auth_user_id: user.id })
    .select("id, nome, auth_user_id, attivo")
    .single();
  if (created) return created;

  // fallback se il nome è già usato: aggiunge un suffisso univoco
  const { data: retry } = await db
    .from("operatori")
    .insert({ nome: `${nomeBase}-${user.id.slice(0, 4)}`, auth_user_id: user.id })
    .select("id, nome, auth_user_id, attivo")
    .single();
  return retry ?? null;
}

export async function findOperatore(db: any, id?: string | null, nome?: string | null) {
  const cleanId = id?.trim();
  const cleanName = nome?.trim();
  if (!cleanId && !cleanName) return null;

  let query = db
    .from("operatori")
    .select("id, nome")
    .eq("attivo", true)
    .limit(1);

  if (cleanId) {
    query = query.eq("id", cleanId);
  } else {
    query = query.ilike("nome", cleanName ?? "");
  }

  const { data, error } = await query;
  if (error) throw error;

  return data?.[0] ?? null;
}

export async function createOperatore(db: any, nome?: string | null) {
  const cleanName = nome?.trim();
  if (!cleanName) throw new Error("Nome operatore obbligatorio");

  const existing = await findOperatore(db, null, cleanName);
  if (existing) return existing;

  const { data, error } = await db
    .from("operatori")
    .insert({ nome: cleanName })
    .select("id, nome")
    .single();

  if (error) throw error;
  return data;
}
