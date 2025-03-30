import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from 'react-native-dotenv';

export const supaase = createClient(SUPABASE_URL, SUPABASE_KEY); 

// import Config from 'react-native-config';
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = Config.SUPABASE_URL;
// const supabaseKey = Config.SUPABASE_KEY;

// export const supabase = createClient(supabaseUrl, supabaseKey);