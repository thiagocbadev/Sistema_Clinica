import { useState } from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProfessionalDialog } from './ProfessionalDialog';
import { Professional } from '@/types/clinic';

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function ProfessionalList() {
  const { professionals, appointments, deleteProfessional } = useClinic();
  const [showDialog, setShowDialog] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null);

  const getAppointmentCount = (professionalId: string) => {
    return appointments.filter(apt =>
      apt.professionalId === professionalId &&
      apt.status !== 'cancelado'
    ).length;
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setShowDialog(true);
  };

  const handleDelete = () => {
    if (deletingProfessional) {
      deleteProfessional(deletingProfessional.id);
      setDeletingProfessional(null);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingProfessional(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Profissionais</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{professionals.length} cadastrados</p>
        </div>
        <Button onClick={() => setShowDialog(true)} size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Novo Profissional
        </Button>
      </div>

      {/* Professional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="bg-card border border-border p-4 relative group"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => handleEdit(professional)} className="text-xs">
                    <Edit2 className="h-3.5 w-3.5 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeletingProfessional(professional)}
                    className="text-xs text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{ backgroundColor: professional.color }}
              >
                {professional.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h3 className="font-semibold text-sm text-foreground truncate">{professional.name}</h3>
                <p className="text-xs text-foreground font-medium mt-0.5">{professional.specialty}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1 border-t border-border pt-3">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Phone className="h-3 w-3" />
                {professional.phone}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                <Mail className="h-3 w-3" />
                {professional.email}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground mb-1.5 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all">Horário de Trabalho</div>
              <div className="flex flex-wrap gap-1">
                {professional.workingHours.map((wh) => (
                  <span
                    key={wh.dayOfWeek}
                    className="inline-flex items-center bg-muted px-1.5 py-0.5 text-[10px] text-foreground"
                    title={`${wh.start} - ${wh.end}`}
                  >
                    {dayNames[wh.dayOfWeek]}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Agendamentos</span>
              <span className="text-sm font-semibold text-foreground">
                {getAppointmentCount(professional.id)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ProfessionalDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
        professionalToEdit={editingProfessional}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProfessional} onOpenChange={() => setDeletingProfessional(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Tem certeza que deseja remover o profissional "{deletingProfessional?.name}"?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
