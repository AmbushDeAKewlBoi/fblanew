import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuntqrtwcgnekldphvxbs.supabase.co';
const supabaseAnonKey = 'sb_publishable_PBXZTxaA_OdKpLSkmDsr6A_VhrHMnel';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name for uploaded resources
export const STORAGE_BUCKET = 'resources';
