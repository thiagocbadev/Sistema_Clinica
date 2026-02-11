
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PatientLogin() {
    const navigate = useNavigate();
    const { patients } = useClinic();
    const [identifier, setIdentifier] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple mock authentication using CPF or Email
        const patient = patients.find(p => p.email === identifier);

        if (patient) {
            toast.success(`Bem-vindo(a), ${patient.name}!`);
            // In a real app, we'd set a session token here.
            // For this mock, we'll pass the patient ID via navigation state or just assume 'current user'
            // Ideally, we should add a 'currentUser' to the context, but passing ID via URL/state is simpler for now.
            // Let's use localStorage for a simple persistence
            localStorage.setItem('clinic_patient_id', patient.id);
            navigate('/portal/dashboard');
        } else {
            toast.error('Paciente não encontrado. Verifique seu CPF ou e-mail.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Área do Paciente</CardTitle>
                    <CardDescription>
                        Entre com seus dados para acessar sua agenda
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="identifier">CPF ou E-mail</Label>
                            <Input
                                id="identifier"
                                placeholder="000.000.000-00 ou email@exemplo.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full">Entrar</Button>
                        <Button
                            type="button"
                            variant="link"
                            className="w-full text-sm text-muted-foreground"
                            onClick={() => navigate('/portal/cadastro')}
                        >
                            Não tem cadastro? Crie sua conta
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => navigate('/')}
                        >
                            Voltar ao início
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
