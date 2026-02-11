import { useState } from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import { Service } from '@/types/clinic';
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
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock,
  DollarSign,
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
import { ServiceDialog } from './ServiceDialog';

export function ServiceList() {
  const { services, professionals, deleteService } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProfessionalNames = (professionalIds: string[]) => {
    return professionalIds
      .map(id => professionals.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowDialog(true);
  };

  const handleDelete = () => {
    if (deletingService) {
      deleteService(deletingService.id);
      setDeletingService(null);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Serviços</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{services.length} cadastrados</p>
        </div>
        <Button onClick={() => setShowDialog(true)} size="sm" className="h-8">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Cadastrar
        </Button>
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
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Serviço</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Categoria</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Duração</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Preço</TableHead>
              <TableHead className="h-9 px-3 font-semibold text-xs text-foreground">Profissionais</TableHead>
              <TableHead className="w-[40px] px-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {searchQuery ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-muted/20 border-b border-border">
                  <TableCell className="py-2 px-3">
                    <div className="font-medium text-sm text-foreground">{service.name}</div>
                    {service.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[250px]">
                        {service.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-3">
                    <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                  </TableCell>
                  <TableCell className="py-2 px-3 text-xs">{service.duration} min</TableCell>
                  <TableCell className="py-2 px-3">
                    <div className="text-xs font-semibold text-foreground">
                      R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-3">
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {getProfessionalNames(service.professionalIds) || '—'}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => handleEdit(service)} className="text-xs">
                          <Edit2 className="h-3.5 w-3.5 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingService(service)}
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

      {/* Service Dialog */}
      <ServiceDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
        service={editingService}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingService} onOpenChange={() => setDeletingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Tem certeza que deseja excluir o serviço "{deletingService?.name}"? 
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
