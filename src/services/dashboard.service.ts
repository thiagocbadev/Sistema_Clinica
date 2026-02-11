import { supabase } from '@/lib/supabase';

export async function getMonthlyAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('start_time');

  if (error) throw error;

  // Agrupa por mês no front
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const result = Array(12).fill(0).map((_, i) => ({
    month: months[i],
    total: 0
  }));

  data.forEach(app => {
    const month = new Date(app.start_time).getMonth();
    result[month].total += 1;
  });

  return result;
}
