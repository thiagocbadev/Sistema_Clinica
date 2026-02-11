import { supabase } from '../lib/supabase';

export async function getProfessionals() {
  const { data, error } = await supabase
    .from('professionals')
    .select('*');

  if (error) throw error;
  return data;
}
