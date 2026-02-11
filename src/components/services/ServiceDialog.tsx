import { useState, useEffect } from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import { Service } from '@/types/clinic';
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
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
}

export function ServiceDialog({ open, onOpenChange, service }: ServiceDialogProps) {
  const { addService, updateService, professionals } = useClinic();
  const isEditing = !!service;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    category: '',
    professionalIds: [] as string[],
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        duration: service.duration,
        price: service.price,
        category: service.category,
        professionalIds: service.professionalIds,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        category: '',
        professionalIds: [],
      });
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && service) {
      updateService(service.id, formData);
    } else {
      addService(formData);
    }

    onOpenChange(false);
  };

  const toggleProfessional = (professionalId: string) => {
    setFormData(prev => ({
      ...prev,
      professionalIds: prev.professionalIds.includes(professionalId)
        ? prev.professionalIds.filter(id => id !== professionalId)
        : [...prev.professionalIds, professionalId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle className="text-sm font-semibold">
            {isEditing ? 'Editar Serviço' : 'Cadastrar Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">Nome do Serviço *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Consulta Clínica Geral"
              required
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs font-medium">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição detalhada do serviço oferecido"
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="duration" className="text-xs font-medium">Duração (min) *</Label>
              <Input
                id="duration"
                type="number"
                min={5}
                step={5}
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                required
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price" className="text-xs font-medium">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="category" className="text-xs font-medium">Categoria *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Ex: Consulta, Procedimento, Terapia"
              required
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Profissionais que realizam este serviço *</Label>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto border border-border p-2.5 bg-muted/10">
              {professionals.map((professional) => (
                <div key={professional.id} className="flex items-center gap-2">
                  <Checkbox
                    id={professional.id}
                    checked={formData.professionalIds.includes(professional.id)}
                    onCheckedChange={() => toggleProfessional(professional.id)}
                  />
                  <label
                    htmlFor={professional.id}
                    className="flex items-center gap-1.5 text-xs cursor-pointer flex-1"
                  >
                    <div
                      className="h-1.5 w-1.5 flex-shrink-0"
                      style={{ backgroundColor: professional.color }}
                    />
                    <span className="font-medium">{professional.name}</span>
                    <span className="text-muted-foreground">- {professional.specialty}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={formData.professionalIds.length === 0}>
              {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
