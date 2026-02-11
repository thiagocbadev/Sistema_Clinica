import { useState } from "react";
import { useClinic } from "@/contexts/ClinicContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function UserManagement() {
  const { patients, professionals, signUp, createPatient, registerProfessionalUser, updatePatient, deletePatient, deletePatientWithAppointments, updateProfessional, deleteProfessional } = useClinic();

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userType, setUserType] = useState<"patient" | "professional">("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    phone: "",
    specialty: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit dialog states
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    specialty: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.email || !formData.password || !formData.name) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        setIsSubmitting(false);
        return;
      }

      if (userType === "patient") {
        // Create patient
        await signUp(formData.email, formData.password);
        await createPatient({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          birthDate: "",
          cpf: formData.cpf || "",
        });
        toast.success("Paciente criado com sucesso!");
      } else {
        // Create professional
        if (!formData.specialty) {
          toast.error("Especialidade é obrigatória para profissionais");
          setIsSubmitting(false);
          return;
        }

        if (!formData.phone) {
          toast.error("Telefone é obrigatório para profissionais");
          setIsSubmitting(false);
          return;
        }

        await registerProfessionalUser(formData.email, formData.password, formData.name, formData.specialty, formData.phone);
        toast.success("Profissional criado com sucesso!");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        cpf: "",
        phone: "",
        specialty: "",
      });
      setIsCreatingUser(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit handlers
  const handleEditPatient = (patient: any) => {
    setEditingPatient(patient);
    setEditFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone || "",
      cpf: "",
      specialty: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditProfessional = (professional: any) => {
    setEditingProfessional(professional);
    setEditFormData({
      name: professional.name,
      email: professional.email,
      phone: professional.phone || "",
      cpf: "",
      specialty: professional.specialty || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSubmitting(true);
      if (editingPatient) {
        await updatePatient(editingPatient.id, {
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone || "",
        });
        toast.success("Paciente atualizado com sucesso!");
      } else if (editingProfessional) {
        await updateProfessional(editingProfessional.id, {
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone || "",
          specialty: editFormData.specialty || "",
        });
        toast.success("Profissional atualizado com sucesso!");
      }
      setIsEditDialogOpen(false);
      setEditingPatient(null);
      setEditingProfessional(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este paciente?\n\nTodas as consultas associadas também serão deletadas.")) {
      try {
        await deletePatientWithAppointments(id);
        toast.success("Paciente e suas consultas foram deletados com sucesso!");
      } catch (error: any) {
        const errorMessage = error.message || error.toString();
        toast.error(errorMessage || "Erro ao deletar paciente");
      }
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este profissional?")) {
      try {
        await deleteProfessional(id);
        toast.success("Profissional deletado com sucesso!");
      } catch (error: any) {
        toast.error(error.message || "Erro ao deletar profissional");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie pacientes e crie contas para profissionais
          </p>
        </div>
        <Dialog open={isCreatingUser} onOpenChange={setIsCreatingUser}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Selecione o tipo de usuário e preencha os dados
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Usuário</Label>
                <Select
                  value={userType}
                  onValueChange={(value) =>
                    setUserType(value as "patient" | "professional")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Paciente</SelectItem>
                    <SelectItem value="professional">Profissional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone {userType === "professional" && "*"}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 9999-9999"
                    required={userType === "professional"}
                  />
                </div>
              </div>

              {userType === "professional" && (
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="Cardiologia"
                    required
                  />
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingUser(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pacientes Tab */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <div>
              <CardTitle>Pacientes</CardTitle>
              <CardDescription>
                Total de {patients?.length || 0} pacientes cadastrados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {patients && patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.cpf || "-"}</TableCell>
                    <TableCell>{patient.phone || "-"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditPatient(patient)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum paciente cadastrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profissionais Tab */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <div>
              <CardTitle>Profissionais</CardTitle>
              <CardDescription>
                Total de {professionals?.length || 0} profissionais cadastrados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {professionals && professionals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell className="font-medium">
                      {professional.name}
                    </TableCell>
                    <TableCell>{professional.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {professional.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell>{professional.phone || "-"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditProfessional(professional)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => handleDeleteProfessional(professional.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum profissional cadastrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Editar {editingPatient ? "Paciente" : "Profissional"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
              />
            </div>

            {editingProfessional && (
              <div className="space-y-2">
                <Label htmlFor="edit-specialty">Especialidade</Label>
                <Input
                  id="edit-specialty"
                  value={editFormData.specialty}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      specialty: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
