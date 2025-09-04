// lib/supabase/server.ts
import { cookies } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "./types";

export const getServerSupabase = () =>
  createServerComponentClient<Database>({ cookies: () => cookies() });

export const getRouteSupabase = () =>
  createRouteHandlerClient<Database>({ cookies: () => cookies() });
