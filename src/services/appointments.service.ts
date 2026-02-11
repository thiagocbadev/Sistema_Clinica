import { supabase } from '../lib/supabase';

export async function createAppointment(appointment: {
  professional_id: string;
  patient_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
}) {
  const { error } = await supabase
    .from('appointments')
    .insert(appointment);

  if (error) throw error;
}

export async function getAppointmentsByProfessional(professionalId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      id,
      start_time,
      end_time,
      patients(name),
      services(name)
    `)
    .eq('professional_id', professionalId);

  if (error) throw error;
  return data;
}