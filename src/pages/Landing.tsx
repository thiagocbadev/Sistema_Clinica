
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, User, ShieldCheck, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
            <div className="absolute h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none -z-10" />

            <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30">
                        <HeartPulse className="h-10 w-10" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    ClickClin <span className="text-primary">Clinics</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
                    Sistema integrado de gestão clínica e agendamento de consultas.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
                {/* Professional Area */}
                <Card className="group relative overflow-hidden border-muted-foreground/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Área Profissional</CardTitle>
                        <CardDescription>Acesso administrativo para médicos e recepção</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                            <li>Gestão de Pacientes</li>
                            <li>Controle de Agenda</li>
                            <li>Faturamento e Relatórios</li>
                        </ul>
                        <Button className="w-full group-hover:translate-y-0 transition-transform" variant="default">
                            Acessar Sistema
                            <UserCog className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Patient Area */}
                <Card className="group relative overflow-hidden border-muted-foreground/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer" onClick={() => navigate('/portal/login')}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <User className="w-6 h-6 text-blue-500" />
                        </div>
                        <CardTitle className="text-xl">Área do Paciente</CardTitle>
                        <CardDescription>Portal exclusivo para agendamento online</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                            <li>Marcar Consultas</li>
                            <li>Histórico de Atendimentos</li>
                            <li>Atualização Cadastral</li>
                        </ul>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" variant="default">
                            Acessar Portal
                            <User className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ClickClin Clinics. Todos os direitos reservados.
            </div>
        </div>
    );
}
