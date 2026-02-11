import { useState, useEffect } from "react";
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

import { HeartPulse, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, currentUser } = useClinic();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);

  // When login succeeds and currentUser is loaded, redirect
  useEffect(() => {
    if (loginAttempted && currentUser) {
      if (currentUser.role === "admin") {
        navigate("/dashboard");
      } else if (currentUser.role === "professional") {
        navigate("/profissional");
      } else if (currentUser.role === "patient") {
        navigate("/portal/dashboard");
      } else {
        toast.error("Tipo de usuário não reconhecido.");
      }
      setLoginAttempted(false);
    }
  }, [loginAttempted, currentUser, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      setLoginAttempted(true);
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

      <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            ClickClin
          </span>
        </div>
        <p className="text-muted-foreground">
          Sistema Integrado de Saúde
        </p>
      </div>

      <Card className="w-full max-w-md border-primary/10 shadow-xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-2xl font-bold">
            Acessar Sistema
          </CardTitle>
          <CardDescription>
            Entre com seu e-mail para continuar
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-10 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/cadastro/paciente")}
            >
              Criar nova conta
            </Button>
          </CardFooter>
        </form>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-sm">
        Ao entrar, você concorda com nossos Termos de Serviço
        e Política de Privacidade.
      </p>
    </div>
  );
}
