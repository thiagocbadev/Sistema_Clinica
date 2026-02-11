import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppointmentWithDetails, AppointmentStatus } from '@/types/clinic';
import { AppointmentDialog } from './AppointmentDialog';
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00 to 19:00

interface WeeklyCalendarProps {
  lockedProfessionalId?: string;
}

export function WeeklyCalendar({ lockedProfessionalId }: WeeklyCalendarProps) {
  const { appointments, professionals, getAppointmentWithDetails } = useClinic();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Initialize with locked ID if provided
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(lockedProfessionalId || null);

  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);
  const [newAppointmentSlot, setNewAppointmentSlot] = useState<{ date: string; time: string } | null>(null);
  const [preselectedPatientId, setPreselectedPatientId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // If locked usage changes or initial load, ensure we respect the lock
    if (lockedProfessionalId) {
      setSelectedProfessional(lockedProfessionalId);
    }
  }, [lockedProfessionalId]);

  useEffect(() => {
    if (location.state && (location.state as any).preselectedPatientId) {
      setPreselectedPatientId((location.state as any).preselectedPatientId);
      setShowNewAppointment(true);
      // Clear state so it doesn't reopen on refresh/navigation? 
      // Actually standard react-router behavior preserves state.
      // We can clear it if we want, but for now let's leave it.
    }
  }, [location.state]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        if (selectedProfessional && apt.professionalId !== selectedProfessional) return false;
        const aptDate = new Date(apt.date);
        return weekDays.some(d => isSameDay(d, aptDate));
      })
      .map(getAppointmentWithDetails);
  }, [appointments, selectedProfessional, weekDays, getAppointmentWithDetails]);

  const getAppointmentsForSlot = (date: Date, hour: number) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(apt => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.startTime.split(':')[0]);
      return aptHour === hour;
    });
  };

  const handleCellClick = (date: Date, hour: number) => {
    setNewAppointmentSlot({
      date: format(date, 'yyyy-MM-dd'),
      time: `${hour.toString().padStart(2, '0')}:00`,
    });
    setShowNewAppointment(true);
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmado': return 'bg-status-confirmado/20 border-status-confirmado text-status-confirmado';
      case 'realizado': return 'bg-status-realizado/20 border-status-realizado text-status-realizado';
      case 'cancelado': return 'bg-status-cancelado/20 border-status-cancelado text-status-cancelado line-through opacity-50';
      case 'faltou': return 'bg-status-faltou/20 border-status-faltou text-status-faltou line-through opacity-70';
      default: return 'bg-muted border-muted-foreground/30 text-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-border pb-3">
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(d => addDays(d, -7))}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <h2 className="text-sm font-semibold text-foreground">
            {format(weekStart, "d 'de' MMMM", { locale: ptBR })} - {format(addDays(weekStart, 6), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </h2>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(d => addDays(d, 7))}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Professional Filter - Only show if not locked */}
          {!lockedProfessionalId && (
            <select
              value={selectedProfessional || ''}
              onChange={(e) => setSelectedProfessional(e.target.value || null)}
              className="h-8 border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos</option>
              {professionals.map(prof => (
                <option key={prof.id} value={prof.id}>{prof.name}</option>
              ))}
            </select>
          )}

          <Button onClick={() => setShowNewAppointment(true)} size="sm" className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Nova Consulta
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto border border-border bg-card">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-background z-10">
            <div className="p-2 text-center text-xs font-semibold text-foreground border-r border-border bg-muted/20">
              Horário
            </div>
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={i}
                  className={cn(
                    'p-2 text-center border-r border-border last:border-r-0 bg-muted/20',
                    isToday && 'bg-primary/5'
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={cn(
                    'text-xs font-semibold mt-0.5',
                    isToday ? 'text-primary' : 'text-foreground'
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0">
              <div className="p-1.5 text-center text-xs text-muted-foreground border-r border-border bg-muted/10 font-medium">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {weekDays.map((day, dayIndex) => {
                const slotAppointments = getAppointmentsForSlot(day, hour);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={dayIndex}
                    onClick={() => handleCellClick(day, hour)}
                    className={cn(
                      'border-r border-b border-border min-h-[60px] p-0.5 cursor-pointer relative',
                      isToday && 'bg-primary/[0.01]'
                    )}
                  >
                    {slotAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppointment(apt);
                        }}
                        className={cn(
                          'mb-0.5 border-l-2 text-xs p-1 cursor-pointer',
                          getStatusColor(apt.status)
                        )}
                        style={{ borderLeftColor: apt.professional.color }}
                      >
                        <div className="font-medium truncate text-[11px]">{apt.patient.name.split(' ')[0]}</div>
                        <div className="text-[10px] opacity-70 truncate">
                          {apt.startTime} - {apt.service.name}
                        </div>
                      </div>
                    ))}
                    {slotAppointments.length === 0 && selectedProfessional && (
                      <div className="h-full w-full flex items-center justify-center">
                        {(() => {
                          const prof = professionals.find(p => p.id === selectedProfessional);
                          const dayOfWeek = day.getDay();
                          // Convert hour to HH:mm string for comparison (simplified)
                          const currentHourPadded = hour.toString().padStart(2, '0');

                          const isWorkingHour = prof?.workingHours.some(wh => {
                            if (wh.dayOfWeek !== dayOfWeek) return false;
                            const startHour = parseInt(wh.start.split(':')[0]);
                            const endHour = parseInt(wh.end.split(':')[0]);
                            return hour >= startHour && hour < endHour;
                          });

                          if (isWorkingHour) {
                            return (
                              <div className="text-[10px] text-emerald-600 font-medium bg-emerald-50/50 px-1 rounded border border-emerald-100/50">
                                Livre
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* New Appointment Dialog */}
      <AppointmentDialog
        open={showNewAppointment}
        onOpenChange={(open) => {
          setShowNewAppointment(open);
          if (!open) {
            setNewAppointmentSlot(null);
            setPreselectedPatientId(undefined); // Reset when closed
          }
        }}
        initialDate={newAppointmentSlot?.date}
        initialTime={newAppointmentSlot?.time}
        initialPatientId={preselectedPatientId}
        initialProfessionalId={lockedProfessionalId}
      />

      {/* Appointment Details Dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
