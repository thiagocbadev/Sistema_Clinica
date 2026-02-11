import { useClinic } from '@/contexts/ClinicContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TodayAppointments() {
  const { appointments, getAppointmentWithDetails } = useClinic();
  
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter(apt => apt.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .map(getAppointmentWithDetails);

  return (
    <div className="bg-card border border-border p-4">
      <div className="mb-3 border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Consultas de Hoje</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {todayAppointments.length} agendamento{todayAppointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
        {todayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhuma consulta agendada para hoje</p>
          </div>
        ) : (
          todayAppointments.map((apt) => (
            <div 
              key={apt.id}
              className={cn(
                'flex items-center gap-2.5 border-b border-border pb-2.5 last:border-b-0 last:pb-0'
              )}
            >
              <div 
                className="h-1.5 w-1.5 flex-shrink-0 mt-0.5"
                style={{ backgroundColor: apt.professional.color }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm text-foreground truncate">
                    {apt.patient.name}
                  </span>
                  <StatusBadge status={apt.status} size="sm" />
                </div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <span>{apt.startTime} - {apt.endTime}</span>
                  <span>•</span>
                  <span className="truncate">{apt.professional.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{apt.service.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
