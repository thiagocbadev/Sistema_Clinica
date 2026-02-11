import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Briefcase,
  Settings,
  ChevronLeft,
  Activity,
  HeartPulse,
  LogOut
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useClinic } from '@/contexts/ClinicContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// settingsItems removed as we are replacing with static Logout button

export function AppSidebar() {
  const { state, open, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { currentUser, logout } = useClinic();

  const menuItems = (() => {
    // Base items - only for admin, not for professionals
    const items: any[] = [];

    // If admin, show full admin menu
    if (currentUser?.role === 'admin') {
      items.push(
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Agenda', url: '/agenda', icon: Calendar },
        { title: 'Pacientes', url: '/pacientes', icon: Users },
        { title: 'Profissionais', url: '/profissionais', icon: UserCog },
        { title: 'Serviços', url: '/servicos', icon: Briefcase },
        { title: 'Gestão de Usuários', url: '/usuarios', icon: Users }
      );
    }

    // If professional, show only services
    if (currentUser?.role === 'professional') {
      items.push({ title: 'Meus Serviços', url: '/profissional', icon: Briefcase });
    }

    return items;
  })();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar-background text-sidebar-foreground transition-all duration-300">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-white/5 mx-2">
        <div className={cn("flex items-center gap-2 transition-all duration-300 overflow-hidden", collapsed ? "w-8 justify-center" : "w-full")}>
          <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <HeartPulse className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white">ClickClin</span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Clinics Admin</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <div className={cn("mb-2 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider transition-opacity", collapsed && "opacity-0")}>
            Menu Principal
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                          isActive
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                        )}
                        <item.icon className={cn('h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110', isActive && 'text-white')} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <div className={cn("mb-2 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider transition-opacity", collapsed && "opacity-0")}>
            Sistema
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  tooltip="Sair"
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer w-full'
                  )}
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>Sair</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
