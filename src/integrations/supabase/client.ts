// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pwwuptjrplhgkvgdodna.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3d3VwdGpycGxoZ2t2Z2RvZG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NDkzMzEsImV4cCI6MjA1MDQyNTMzMX0.PawYfsvbSn7SwGjtqBaN1ipEk70q7gm6ve3IrWn1_3c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);