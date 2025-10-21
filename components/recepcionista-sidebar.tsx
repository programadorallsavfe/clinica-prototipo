'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Users, Calendar, FileText, ShoppingBag, CreditCard, ClipboardList, LogOut, Activity, UserPlus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface RecepcionistaSidebarProps extends React.ComponentProps<typeof Sidebar> {
  recepcionistaNombre: string;
}

export function RecepcionistaSidebar({ recepcionistaNombre, ...props }: RecepcionistaSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navPrincipal = [
    {
      title: 'Dashboard',
      href: '/recepcionista',
      icon: Calendar,
    },
  ];

  const navGestionPacientes = [
    {
      title: 'Leads',
      href: '/recepcionista/leads',
      icon: Users,
      badge: '3',
    },
    {
      title: 'Cotizaciones',
      href: '/recepcionista/cotizaciones',
      icon: FileText,
    },
    {
      title: 'Citas del Día',
      href: '/recepcionista/citas',
      icon: Calendar,
      badge: '8',
    },
    {
      title: 'Pacientes',
      href: '/recepcionista/pacientes',
      icon: UserPlus,
    },
  ];

  const navOperaciones = [
    {
      title: 'Pagos',
      href: '/recepcionista/pagos',
      icon: CreditCard,
    },
    {
      title: 'Órdenes',
      href: '/recepcionista/ordenes',
      icon: ClipboardList,
    },
    {
      title: 'Ventas Auxiliares',
      href: '/recepcionista/ventas',
      icon: ShoppingBag,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('clinica_session');
    router.push('/auth');
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push('/recepcionista')}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-success text-success-foreground">
                <UserPlus className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">RECEPCIÓN</span>
                <span className="truncate text-xs text-muted-foreground">{recepcionistaNombre}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>PRINCIPAL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navPrincipal.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Gestión de Pacientes */}
        <SidebarGroup>
          <SidebarGroupLabel>GESTIÓN DE PACIENTES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navGestionPacientes.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <a href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        {/* Operaciones */}
        <SidebarGroup>
          <SidebarGroupLabel>OPERACIONES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navOperaciones.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <Activity className="size-3" />
              <span>Sistema Activo</span>
              <div className="ml-auto size-2 rounded-full bg-success animate-pulse" />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
