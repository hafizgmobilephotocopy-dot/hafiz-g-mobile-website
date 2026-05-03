import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ylmpezbcqsvbacchtlke.supabase.co';
const supabaseAnonKey = 'sb_publishable_LCGQqz9LWo4WVLhtEXDmvA_6RPKi9zZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
