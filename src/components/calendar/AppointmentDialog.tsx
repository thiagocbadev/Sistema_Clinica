import { useState, useEffect } from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: string;
  initialTime?: string;
  initialPatientId?: string;
  initialProfessionalId?: string;
  initialAppointment?: any; // Using any to avoid complex type imports for now, but should be AppointmentWithDetails
}

export function AppointmentDialog({
  open,
  onOpenChange,
  initialDate,
  initialTime,
  initialPatientId,
  initialProfessionalId,
  initialAppointment
}: AppointmentDialogProps) {
  const { patients, professionals, services, rooms, addAppointment, updateAppointment, getServiceById, currentUser } = useClinic();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    patientId: '',
    professionalId: '',
    serviceId: '',
    roomId: '',
    date: '',
    startTime: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      if (initialAppointment) {
        setFormData({
          patientId: initialAppointment.patientId,
          professionalId: initialAppointment.professionalId,
          serviceId: initialAppointment.serviceId,
          roomId: (initialAppointment as any).roomId || '',
          date: initialAppointment.date,
          startTime: initialAppointment.startTime,
          notes: initialAppointment.notes || '',
        });
      } else {
        setFormData(prev => ({
          ...prev,
          patientId: initialPatientId || '',
          professionalId: initialProfessionalId || '',
          date: initialDate || new Date().toISOString().split('T')[0],
          startTime: initialTime || '09:00',
        }));
      }
    }
  }, [open, initialDate, initialTime, initialPatientId, initialAppointment, initialProfessionalId]);

  const selectedService = formData.serviceId ? getServiceById(formData.serviceId) : null;

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return ${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) return;

    const endTime = calculateEndTime(formData.startTime, selectedService.duration);

    try {
      if (initialAppointment) {
        await updateAppointment(initialAppointment.id, {
          patientId: formData.patientId,
          professionalId: formData.professionalId,
          serviceId: formData.serviceId,
          roomId: formData.roomId || undefined,
          date: formData.date,
          startTime: formData.startTime,
          endTime,
          notes: formData.notes || undefined,
        } as any);
        
        // Wait a bit and then close
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: 'Sucesso',
          description: 'Consulta atualizada com sucesso!',
        });
        onOpenChange(false);
      } else {
        const added = await addAppointment({
          patientId: formData.patientId,
          professionalId: formData.professionalId,
          serviceId: formData.serviceId,
          roomId: formData.roomId || undefined,
          date: formData.date,
          startTime: formData.startTime,
          endTime,
          totalValue: selectedService.price,
          status: 'agendado',
          notes: formData.notes || undefined,
        } as any);

        if (!added) {
          toast({
            title: 'Erro',
            description: 'Não foi possível agendar. Verifique conflitos de horário e tente novamente.',
            variant: 'destructive',
          });
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        toast({
          title: 'Sucesso',
          description: 'Consulta agendada com sucesso!',
        });
        onOpenChange(false);
      }

      setFormData({
        patientId: '',
        professionalId: '',
        serviceId: '',
        roomId: '',
        date: '',
        startTime: '',
        notes: '',
      });
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar a consulta. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Filter services based on selected professional
  const availableServices = formData.professionalId
    ? services.filter(
      s => s.professionalIds?.includes(formData.professionalId)
    )
    : services;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle className="text-sm font-semibold">
            {initialAppointment ? 'Editar Consulta' : 'Nova Consulta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="date" className="text-xs font-medium">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="time" className="text-xs font-medium">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                className="h-8 text-sm"
              />
            </div>
          </div>

          {currentUser?.role !== 'patient' && (
            <div className="space-y-1">
              <Label className="text-xs font-medium">Paciente *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                required
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-medium">Profissional *</Label>
            <Select
              value={formData.professionalId}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                professionalId: value,
                serviceId: '', // Reset service when professional changes
              }))}
              required
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map(prof => (
                  <SelectItem key={prof.id} value={prof.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: prof.color }}
                      />
                      {prof.name} - {prof.specialty}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium">Serviço *</Label>
            <Select
              value={formData.serviceId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
              required
              disabled={!formData.professionalId}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder={
                  !formData.professionalId
                    ? "Selecione o profissional primeiro"
                    : availableServices.length === 0
                      ? "Este Profissional ainda não tem serviço"
                      : "Selecione o serviço"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableServices.length === 0 ? (
                  <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                    Este Profissional ainda não tem serviço
                  </div>
                ) : (
                  availableServices.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration}min - R$ {service.price.toFixed(2)})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes" className="text-xs font-medium">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Informações adicionais sobre a consulta..."
              rows={3}
              className="text-sm"
            />
          </div>

          {selectedService && (
            <div className="border border-border bg-muted/20 p-2.5 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-muted-foreground">Duração:</span>
                <span className="font-medium text-foreground">{selectedService.duration} min</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-medium text-foreground">R$ {selectedService.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {formData.startTime && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Término:</span>
                  <span className="font-medium text-foreground">
                    {calculateEndTime(formData.startTime, selectedService.duration)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={!formData.patientId || !formData.professionalId || !formData.serviceId}>
              {initialAppointment ? 'Salvar Alterações' : 'Agendar Consulta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
