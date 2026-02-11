
import { MetricCard } from '@/components/dashboard/MetricCard';
import { AppointmentsChart } from '@/components/dashboard/AppointmentsChart';
import { TodayAppointments } from '@/components/dashboard/TodayAppointments';
import { useClinic } from '@/contexts/ClinicContext';
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { appointments, patients } = useClinic();

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate metrics
  const appointmentsToday = appointments.filter(apt => apt.date === today).length;

  const monthlyAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.getMonth() === currentMonth &&
      aptDate.getFullYear() === currentYear &&
      apt.status === 'realizado';
  });

  const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + (apt.totalValue || 0), 0);

  const newPatientsThisMonth = patients.filter(p => {
    const createdDate = new Date(p.createdAt);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;

  const completedAppointments = appointments.filter(apt => apt.status === 'realizado').length;

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua clínica e agendamentos.</p>
        </div>
        <div className="flex items-center gap-2">

          <Button variant="outline" className="hidden sm:flex">
            <Calendar className="mr-2 h-4 w-4" />
            Últimos 30 dias
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Consultas Hoje"
          value={appointmentsToday}
          subtitle="Agendamentos confirmados"
          icon={Calendar}
          variant="primary"
          delay={100}
        />
        <MetricCard
          title="Faturamento Mensal"
          value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          variant="accent"
          trend={{ value: 12, isPositive: true }}
          delay={200}
        />
        <MetricCard
          title="Novos Pacientes"
          value={newPatientsThisMonth}
          subtitle="Cadastrados este mês"
          icon={Users}
          variant="success"
          trend={{ value: 5, isPositive: true }}
          delay={300}
        />
        <MetricCard
          title="Total Atendimentos"
          value={completedAppointments}
          subtitle="Histórico total"
          icon={TrendingUp}
          variant="warning"
          delay={400}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card rounded-xl p-1 shadow-sm">
            <AppointmentsChart />
          </div>
        </div>
        <div className="space-y-6">
          <TodayAppointments />
        </div>
      </div>
    </div>
  );
};

export default Index;
