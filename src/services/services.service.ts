import { supabase } from '../lib/supabase';

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*');

  if (error) throw error;
  return data;
}
