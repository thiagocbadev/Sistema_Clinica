
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Stethoscope, ArrowLeft } from 'lucide-react';

export default function RegisterProfessional() {
    const navigate = useNavigate();
    const { registerProfessionalUser } = useClinic();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.name || !formData.email || !formData.password || !formData.service) {
            toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
            setIsLoading(false);
            return;
        }

        try {
            await registerProfessionalUser(formData.email, formData.password, formData.name);
            toast({ title: 'Sucesso', description: 'Cadastro realizado! Faça login para continuar.', variant: 'default' });
            navigate('/');
        } catch (err: any) {
            toast({ title: 'Erro', description: err.message || 'Erro ao criar conta.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4 relative">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

            <div className="w-full max-w-md mb-4">
                <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary" onClick={() => navigate('/cadastro')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <Card className="w-full max-w-md border-primary/10 shadow-xl shadow-primary/5">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                        <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Cadastro Profissional</CardTitle>
                    <CardDescription>
                        Acesso administrativo para equipe clínica
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service">Serviço / Especialidade</Label>
                            <Input
                                id="service"
                                placeholder="Ex: Cardiologista, Recepcionista..."
                                value={formData.service}
                                onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail Profissional</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="doutor@clinica.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Criando conta...' : 'Criar Conta Profissional'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
