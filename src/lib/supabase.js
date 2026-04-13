import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ── Load user's saved app data ── */
export async function loadUserData(userId) {
  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('Load error:', error);
  return data?.data ?? null;
}

/* ── Save user's app data (upsert) ── */
export async function saveUserData(userId, appData) {
  const { error } = await supabase
    .from('user_data')
    .upsert({ id: userId, data: appData, updated_at: new Date().toISOString() });
  if (error) console.error('Save error:', error);
}
