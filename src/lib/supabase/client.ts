"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./types"; // (add in Batch B if you want types)

export const supabase = createClientComponentClient<Database>();
