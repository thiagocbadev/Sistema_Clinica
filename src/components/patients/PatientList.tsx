import { useState } from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import { Patient } from '@/types/clinic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { PatientDialog } from './PatientDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PatientList() {
  const { patients, deletePatient } = useClinic();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.cpf.includes(searchQuery)
  );

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowDialog(true);
  };

  const handleSchedule = (patient: Patient) => {
    navigate('/agenda', { state: { preselectedPatientId: patient.id } });
  };

  const handleDelete = () => {
    if (deletingPatient) {
      deletePatient(deletingPatient.id);
      setDeletingPatient(null);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingPatient(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Pacientes</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{patients.length} cadastrados</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Table */}
      <div className="border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border">
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Nome</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Contato</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">CPF</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Nascimento</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Cadastro</TableHead>
              <TableHead className="w-[40px] px-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-muted/20 border-b border-border">
                  <TableCell className="py-2 px-3">
                    <div className="font-medium text-sm text-foreground">{patient.name}</div>
                    {patient.notes && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
                        {patient.notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-3">
                    <div className="space-y-0.5">
                      <div className="text-xs text-foreground">{patient.phone}</div>
                      <div className="text-xs text-muted-foreground">{patient.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs font-mono">{patient.cpf}</TableCell>
                  <TableCell className="py-2 px-3 text-xs">
                    {patient.birthDate ? (() => {
                      const date = new Date(patient.birthDate);
                      return !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy", { locale: ptBR }) : '-';
                    })() : '-'}
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs text-muted-foreground">
                    {patient.createdAt ? (() => {
                      const date = new Date(patient.createdAt);
                      return !isNaN(date.getTime()) ? format(date, 'dd/MM/yyyy') : '-';
                    })() : '-'}
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => handleSchedule(patient)} className="text-xs">
                          <Calendar className="h-3.5 w-3.5 mr-2" />
                          Agendar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(patient)} className="text-xs">
                          <Edit2 className="h-3.5 w-3.5 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingPatient(patient)}
                          className="text-xs text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Patient Dialog */}
      <PatientDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
        patient={editingPatient}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPatient} onOpenChange={() => setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Tem certeza que deseja excluir o paciente "{deletingPatient?.name}"?
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
