
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Stethoscope, ArrowLeft } from 'lucide-react';

export default function RegisterSelection() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 p-4 relative">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

            <div className="w-full max-w-2xl mb-4">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Login
                </Button>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Criar sua conta</h1>
                <p className="text-muted-foreground">Como você deseja se cadastrar?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {/* Patient Option */}
                <Card
                    className="group cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg"
                    onClick={() => navigate('/cadastro/paciente')}
                >
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Paciente</CardTitle>
                        <CardDescription>Para marcar consultas e exames</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                        Acesse seu histórico, agende horários e gerencie seus tratamentos.
                    </CardContent>
                </Card>

                {/* Professional Option */}
                <Card
                    className="group cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg"
                    onClick={() => navigate('/cadastro/profissional')}
                >
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Profissional</CardTitle>
                        <CardDescription>Para médicos e equipe administrativa</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                        Gerencie sua agenda, prontuários e pacientes da clínica.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
