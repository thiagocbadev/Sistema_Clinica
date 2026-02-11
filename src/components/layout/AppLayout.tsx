import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, Search, User, ChevronDown, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useClinic } from '@/contexts/ClinicContext';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { currentUser, logout } = useClinic();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans antialiased">
        <AppSidebar />

        <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          {/* Glassmorphism Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur-xl transition-all">
            <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" />


            <div className="flex items-center gap-3 ml-auto">
              {/* Notifications removed */}

              {/* User Menu - Premium Look */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 pl-1 pr-2 py-1 h-auto rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border/50">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={(currentUser as any)?.avatar || "https://github.com/shadcn.png"} alt={currentUser?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">{currentUser?.name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start gap-0.5">
                      <span className="text-sm font-semibold text-foreground leading-none">{currentUser?.name || "Usuário"}</span>
                      <span className="text-[10px] text-muted-foreground font-medium leading-none">
                        {currentUser?.role === 'admin' ? 'Administrador' : 'Paciente'}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/50 shadow-lg bg-card/95 backdrop-blur-sm">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2 bg-border/50" />

                  <DropdownMenuSeparator className="my-2 bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer">
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content with subtle gradient background */}
          <main className="flex-1 overflow-auto bg-muted/5 p-6 md:p-8">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
