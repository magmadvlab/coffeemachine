import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getCurrentUser, isAdminEmail } from "@/lib/supabase/auth-server";
import { getSessionOperatore } from "@/lib/operator-server";

function hasAuthEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function isCurrentAdmin() {
  if (!hasAuthEnv()) return false;
  const user = await getCurrentUser();
  return isAdminEmail(user?.email);
}

export async function requireAdminPage() {
  if (!(await isCurrentAdmin())) redirect("/");
}

export async function requireAdminApi(message = "Solo un amministratore può eseguire questa operazione.") {
  if (await isCurrentAdmin()) return null;
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function hasRepairAccess(db: any) {
  const operatore = await getSessionOperatore(db).catch(() => null);
  if (operatore) return true;
  return isCurrentAdmin();
}
