export async function getOrCreateOperatore(db: any, nome?: string | null) {
  const cleanName = nome?.trim();
  if (!cleanName) return null;

  const { data: existing, error: findError } = await db
    .from("operatori")
    .select("id, nome")
    .ilike("nome", cleanName)
    .eq("attivo", true)
    .limit(1);

  if (findError) throw findError;
  if (existing?.[0]) return existing[0];

  const { data, error } = await db
    .from("operatori")
    .insert({ nome: cleanName })
    .select("id, nome")
    .single();

  if (error) throw error;
  return data;
}
