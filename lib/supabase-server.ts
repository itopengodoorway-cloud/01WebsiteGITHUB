import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: cookieStore,
  });
}
