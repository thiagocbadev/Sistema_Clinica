import { AppointmentStatus } from '@/types/clinic';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  'agendado': {
    label: 'Agendado',
    className: 'status-agendado'
  },
  'confirmado': {
    label: 'Confirmado',
    className: 'status-confirmado'
  },
  'realizado': {
    label: 'Realizado',
    className: 'status-realizado'
  },
  'cancelado': {
    label: 'Cancelado',
    className: 'status-cancelado'
  },
  'faltou': {
    label: 'Faltou',
    className: 'status-faltou'
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-md font-medium',
      size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs',
      config.className
    )}>
      {config.label}
    </span>
  );
}
