import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClinic } from "@/contexts/ClinicContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { HeartPulse, ArrowLeft } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, createPatient } = useClinic();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    try {
      // 1️⃣ Criar usuário no Supabase Auth
      await signUp(formData.email, formData.password);

      // 2️⃣ Criar paciente no banco
      await createPatient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      toast.success("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar cadastro");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4 relative">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

      <div className="w-full max-w-md mb-4">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Login
        </Button>
      </div>

      <Card className="w-full max-w-md border-primary/10 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
            <HeartPulse className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Criar Conta
          </CardTitle>
          <CardDescription>
            Junte-se ao ClickClin Clinics
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </div>


            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Finalizar Cadastro
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
