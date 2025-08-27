import { cookies } from "next/headers";
import {
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "./types"; // add later

export const getServerSupabase = () =>
  createServerComponentClient<Database>({ cookies });

export const getRouteSupabase = () =>
  createRouteHandlerClient<Database>({ cookies });
