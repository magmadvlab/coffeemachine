import { createClient as createSupaClient } from "@supabase/supabase-js";

/**
 * Client server-side con service_role: usato solo nelle route API/azioni server.
 * NON importare in componenti client.
 */
export function createServiceClient() {
  return createSupaClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
