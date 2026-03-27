import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // The default Web Locks API implementation causes NavigatorLockAcquireTimeoutError
    // when React StrictMode mounts effects twice or when rapid navigation triggers
    // concurrent auth operations. This pass-through is safe for single-tab apps.
    lock: async (_name, _acquireTimeout, fn) => fn(),
  },
});
