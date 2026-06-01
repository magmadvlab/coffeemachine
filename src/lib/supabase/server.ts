import { createClient as createSupaClient } from "@supabase/supabase-js";

export function hasServiceConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Client server-side con service_role: usato solo nelle route API/azioni server.
 * NON importare in componenti client.
 */
export function createServiceClient() {
  if (!hasServiceConfig()) {
    throw new Error("Supabase non configurato: mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupaClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
