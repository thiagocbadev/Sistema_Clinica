
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClinic } from '@/contexts/ClinicContext';
import { LogOut, Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Patient } from '@/types/clinic';

export function PatientLayout() {
    const navigate = useNavigate();
    const { currentUser, logout, loading } = useClinic();

    // Wait for loading to complete, then check authentication
    useEffect(() => {
        if (!loading && (!currentUser || currentUser.role !== 'patient')) {
            navigate('/');
        }
    }, [currentUser, loading, navigate]);

    if (loading || !currentUser) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            SC
                        </div>
                        <span className="font-semibold text-lg hidden sm:block">Portal do Paciente</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                            <User className="h-4 w-4" />
                            <span className="font-medium text-foreground">{currentUser.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container py-6 px-4">
                <Outlet context={{ currentUser }} />
            </main>
        </div>
    );
}
