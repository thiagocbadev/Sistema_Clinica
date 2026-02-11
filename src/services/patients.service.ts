import { supabase } from '../lib/supabase';

export async function createPatient(patient: {
  name: string;
  phone: string;
}) {
  const { error } = await supabase
    .from('patients')
    .insert(patient);

  if (error) throw error;
}
