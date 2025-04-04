import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from 'react-native-dotenv';

// Supabase URL and anon key from your Supabase project
// const supabaseUrl = 'https://gqfixxrmohkewqvyakez.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZml4eHJtb2hrZXdxdnlha2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyOTA2ODgsImV4cCI6MjA1ODg2NjY4OH0.ZB-tb4EGUSzFPkigApUC3GRlXi28HDSuA5R4_aMb-Q0';

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);