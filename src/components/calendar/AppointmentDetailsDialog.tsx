import { useClinic } from '@/contexts/ClinicContext';
import { AppointmentWithDetails, AppointmentStatus } from '@/types/clinic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  MapPin, 
  DollarSign,
  Check,
  Play,
  X,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentDetailsDialogProps {
  appointment: AppointmentWithDetails | null;
  onClose: () => void;
}

export function AppointmentDetailsDialog({ appointment, onClose }: AppointmentDetailsDialogProps) {
  const { updateAppointmentStatus } = useClinic();

  if (!appointment) return null;

  const handleStatusChange = async (status: AppointmentStatus) => {
    await updateAppointmentStatus(appointment.id, status);
    if (status === 'confirmado' || status === 'realizado' || status === 'cancelado' || status === 'faltou') {
      onClose();
    }
  };

  const statusActions: { status: AppointmentStatus; label: string; icon: React.ReactNode; variant: 'default' | 'outline' | 'destructive' }[] = [];

  switch (appointment.status) {
    case 'agendado':
      statusActions.push(
        { status: 'confirmado', label: 'Confirmar', icon: <Check className="h-4 w-4" />, variant: 'default' },
        { status: 'cancelado', label: 'Cancelar', icon: <X className="h-4 w-4" />, variant: 'destructive' }
      );
      break;
    case 'confirmado':
      statusActions.push(
        { status: 'realizado', label: 'Finalizar', icon: <CheckCircle className="h-4 w-4" />, variant: 'default' },
        { status: 'cancelado', label: 'Cancelar', icon: <X className="h-4 w-4" />, variant: 'destructive' }
      );
      break;
  }

  return (
    <Dialog open={!!appointment} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-semibold">Detalhes da Consulta</DialogTitle>
            <StatusBadge status={appointment.status} />
          </div>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Patient Info */}
          <div className="space-y-0.5 border-b border-border pb-3">
            <p className="font-medium text-sm text-foreground">{appointment.patient.name}</p>
            <p className="text-xs text-muted-foreground">{appointment.patient.phone}</p>
            <p className="text-xs text-muted-foreground">{appointment.patient.email}</p>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-3 border-b border-border pb-3">
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground">Data</div>
              <div className="text-xs text-foreground">{format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground">Horário</div>
              <div className="text-xs text-foreground">{appointment.startTime} - {appointment.endTime}</div>
            </div>
          </div>

          {/* Professional */}
          <div className="space-y-0.5 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div 
                className="h-1.5 w-1.5 flex-shrink-0"
                style={{ backgroundColor: appointment.professional.color }}
              />
              <span className="font-medium text-sm">{appointment.professional.name}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-3.5">{appointment.professional.specialty}</p>
          </div>

          {/* Service */}
          <div className="space-y-1 border-b border-border pb-3">
            <p className="text-xs font-medium text-foreground">{appointment.service.name}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Duração: {appointment.service.duration} min</span>
              <span className="font-semibold text-foreground">
                R$ {(appointment.totalValue || appointment.service.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-1 border-b border-border pb-3">
              <p className="text-xs font-medium text-muted-foreground">Observações</p>
              <p className="text-xs text-foreground">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          {statusActions.length > 0 && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {statusActions.map(action => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleStatusChange(action.status)}
                  className="flex-1"
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ))}
            </div>
          )}

          {appointment.status === 'realizado' && appointment.totalValue && (
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Valor Total</span>
                <span className="text-sm font-semibold text-foreground">
                  R$ {appointment.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
