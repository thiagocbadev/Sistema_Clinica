import { useOutletContext } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';
import { useToast } from '@/hooks/use-toast';
import { Patient, AppointmentWithDetails, AppointmentStatus } from '@/types/clinic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Plus } from 'lucide-react';
import { format, isAfter, parseISO, startOfDay, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { AppointmentDialog } from '@/components/calendar/AppointmentDialog';

interface OutletContextType {
    currentUser: Patient;
}

export default function PatientDashboard() {
    const { currentUser } = useOutletContext<OutletContextType>();
    const { appointments, getAppointmentWithDetails, updateAppointmentStatus } = useClinic();
    const { toast } = useToast();
    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null);

    // Reset selected appointment when dialog closes
    useEffect(() => {
        if (!showNewAppointment) {
            setSelectedAppointment(null);
        }
    }, [showNewAppointment]);

    const myAppointments = appointments
        .filter(apt => apt.patientId === currentUser.id)
        .map(getAppointmentWithDetails)
        .sort((a, b) => {
            // Sort by date/time
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateB.getTime() - dateA.getTime(); // Newest first
        });

    const upcomingAppointments = myAppointments.filter(apt =>
        !['cancelado', 'realizado', 'faltou'].includes(apt.status) &&
        !isBefore(parseISO(apt.date), startOfDay(new Date()))
    );

    const pastAppointments = myAppointments.filter(apt =>
        !upcomingAppointments.includes(apt)
    );

    const getStatusBadge = (status: AppointmentStatus) => {
        switch (status) {
            case 'confirmado': return <Badge className="bg-green-500 hover:bg-green-600">Confirmado</Badge>;
            case 'agendado': return <Badge variant="secondary">Agendado</Badge>;
            case 'realizado': return <Badge className="bg-gray-500 hover:bg-gray-600">Realizado</Badge>;
            case 'cancelado': return <Badge variant="destructive">Cancelado</Badge>;
            case 'faltou': return <Badge variant="destructive">Faltou</Badge>;
            default: return null;
        }
    };

    const handleCancel = async (id: string) => {
        // Confirmation dialog
        const confirmed = window.confirm('Tem certeza que deseja cancelar esta consulta?');
        if (!confirmed) return;

        try {
            await updateAppointmentStatus(id, 'cancelado');
            toast({
                title: 'Sucesso',
                description: 'Consulta cancelada com sucesso',
            });
        } catch (error) {
            console.error('Error canceling appointment:', error);
            toast({
                title: 'Erro',
                description: 'Erro ao cancelar a consulta. Tente novamente.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Minha Agenda</h1>
                    <p className="text-muted-foreground">Gerencie suas consultas e acompanhe seus horários.</p>
                </div>
                <Button onClick={() => setShowNewAppointment(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Consulta
                </Button>
            </div>

            {/* Upcoming Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Próximas Consultas</CardTitle>
                    <CardDescription>Consulte seus agendamentos futuros</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingAppointments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p>Você não tem consultas agendadas.</p>
                            <Button variant="link" onClick={() => setShowNewAppointment(true)}>
                                Agendar agora
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-l-4 bg-card hover:bg-muted/5 transition-colors"
                                    style={{ borderLeftColor: apt.professional.color }}
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                                        {/* Date Box */}
                                        <div className="flex flex-row sm:flex-col items-center sm:justify-center gap-2 sm:gap-0 min-w-[80px] sm:bg-muted/30 sm:p-2 sm:rounded-md">
                                            <span className="text-2xl font-bold text-foreground">
                                                {format(parseISO(apt.date), 'dd')}
                                            </span>
                                            <span className="text-xs uppercase font-semibold text-muted-foreground">
                                                {format(parseISO(apt.date), 'MMM', { locale: ptBR })}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-lg">{apt.service.name}</span>
                                                {getStatusBadge(apt.status)}
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{apt.startTime} - {apt.endTime}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>Dr(a). {apt.professional.name}</span>
                                                </div>
                                                {apt.room && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        <span>{apt.room.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-0 flex items-center gap-2 w-full md:w-auto">
                                        {/* Actions if needed */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full md:w-auto"
                                            onClick={() => {
                                                setSelectedAppointment(apt);
                                                setShowNewAppointment(true);
                                            }}
                                        >
                                            Remarcar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-destructive hover:text-destructive w-full md:w-auto"
                                            onClick={() => handleCancel(apt.id)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* History Section */}
            {pastAppointments.length > 0 && (
                <Card className="opacity-90">
                    <CardHeader>
                        <CardTitle className="text-lg">Histórico</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pastAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between py-3 border-b last:border-0 opacity-70">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <span className="text-sm font-medium w-32">
                                            {format(parseISO(apt.date), 'dd/MM/yyyy')}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{apt.service.name}</span>
                                            <span className="text-xs text-muted-foreground">Dr(a). {apt.professional.name}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {getStatusBadge(apt.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <AppointmentDialog
                open={showNewAppointment}
                onOpenChange={(open) => {
                    setShowNewAppointment(open);
                    if (!open) setSelectedAppointment(null);
                }}
                initialPatientId={currentUser.id}
                initialAppointment={selectedAppointment}
            />
        </div>
    );
}
