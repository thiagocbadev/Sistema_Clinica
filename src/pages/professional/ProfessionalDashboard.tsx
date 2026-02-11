import { useEffect, useState } from 'react';
import { useClinic } from '@/contexts/ClinicContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';

export default function ProfessionalDashboard() {
  const { currentUser, services, loadServices, createService, updateService, appointments, loadAppointments } = useClinic();
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', description: '', duration: 30, price: 0 });

  useEffect(() => {
    loadServices();
    loadAppointments();
  }, []);

  function resetForm() {
    setForm({ name: '', description: '', duration: 30, price: 0 });
    setEditing(null);
  }

  const handleSubmit = async (e: any) => {
    e?.preventDefault();
    try {
      if (editing) {
        await updateService(editing.id, { name: form.name, description: form.description, duration: form.duration, price: form.price });
        toast.success('Serviço atualizado');
      } else {
        await createService({ name: form.name, description: form.description, duration: form.duration, price: form.price, category: 'Geral', professionalIds: currentUser ? [currentUser.id] : [], createdAt: new Date().toISOString() });
        toast.success('Serviço criado');
      }
      resetForm();
      setIsCreating(false);
    } catch (err: any) {
      toast.error(err.message || 'Erro');
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Área do Profissional</h1>
            <p className="text-muted-foreground">Gerencie seus serviços e veja sua agenda</p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Editar Serviço' : 'Criar Serviço'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Duração (min)</Label>
                    <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Preço</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => { resetForm(); setIsCreating(false); }}>Cancelar</Button>
                  <Button type="submit">{editing ? 'Salvar' : 'Criar'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meus Serviços</CardTitle>
            <CardDescription>Serviços que você oferece</CardDescription>
          </CardHeader>
          <CardContent>
            {services && services.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.filter(s => !s.professionalIds || s.professionalIds.includes(currentUser?.id || '')).map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.duration} min</TableCell>
                      <TableCell>R$ {s.price}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description || '', duration: s.duration, price: s.price }); setIsCreating(true); }}>
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">Nenhum serviço encontrado</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda Completa</CardTitle>
            <CardDescription>Visualize e gerencie sua agenda semanal</CardDescription>
          </CardHeader>
          <CardContent className="h-[600px] p-0">
            <div className="h-full p-2">
              <WeeklyCalendar lockedProfessionalId={currentUser?.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

