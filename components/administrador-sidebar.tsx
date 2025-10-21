'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Shield, LayoutDashboard, Users, UserCog, Stethoscope, Package, BarChart3, FileText, Settings, LogOut, Activity, Menu } from 'lucide-react';
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
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdministradorSidebarProps extends React.ComponentProps<typeof Sidebar> {
  adminNombre: string;
}

export function AdministradorSidebar({ adminNombre, ...props }: AdministradorSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        onClick: () => router.push("/administrador"),
        icon: LayoutDashboard,
      },
    ],
    navGestionUsuarios: [
      {
        title: "Usuarios y Permisos",
        onClick: () => router.push("/administrador/usuarios"),
        icon: Users,
      },
      {
        title: "Doctores",
        onClick: () => router.push("/administrador/doctores"),
        icon: UserCog,
        badge: "12",
      },
      {
        title: "Especialidades",
        onClick: () => router.push("/administrador/especialidades"),
        icon: Stethoscope,
        badge: "15",
      },
    ],
    navOperaciones: [
      {
        title: "Inventario",
        onClick: () => router.push("/administrador/inventario"),
        icon: Package,
      },
      {
        title: "Reportes",
        onClick: () => router.push("/administrador/reportes"),
        icon: BarChart3,
      },
    ],
    navSistema: [
      {
        title: "Auditoría",
        onClick: () => router.push("/administrador/auditoria"),
        icon: FileText,
      },
      {
        title: "Configuración",
        onClick: () => router.push("/administrador/configuracion"),
        icon: Settings,
      },
    ],
    socialMedia: [
      {
        title: "Facebook",
        href: "https://facebook.com",
        icon: "/facebook.svg",
        color: "hover:text-blue-600",
      },
      {
        title: "X (Twitter)",
        href: "https://x.com",
        icon: "/x.svg",
        color: "hover:text-black dark:hover:text-white",
      },
      {
        title: "WhatsApp",
        href: "https://wa.me",
        icon: "/whatsapp.svg",
        color: "hover:text-green-600",
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('clinica_session');
    router.push('/auth');
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger className="md:hidden" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-muted/50 transition-colors duration-200"
              >
                <div 
                  onClick={() => router.push("/administrador")}
                  className="flex items-center justify-between w-full cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
                        <Shield className="size-5" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-primary">ADMINISTRACIÓN</span>
                      <span className="text-xs text-muted-foreground font-medium">{adminNombre}</span>
                    </div>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1">
        {/* Dashboard */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Principal
          </h3>
        </div>
        <div className="px-3 space-y-1 mb-4">
          {data.navMain.map((item) => (
            <button
              key={item.title}
              onClick={item.onClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                pathname === "/administrador" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <div className={`p-2 rounded-md transition-colors duration-200 ${
                pathname === "/administrador" 
                  ? "bg-primary-foreground/20" 
                  : "bg-muted/30 group-hover:bg-muted/60"
              }`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Gestión de Usuarios */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Gestión de Usuarios
          </h3>
        </div>
        <div className="px-3 space-y-1 mb-4">
          {data.navGestionUsuarios.map((item) => {
            const isActive = pathname.includes("/administrador/usuarios") || 
                           pathname.includes("/administrador/doctores") ||
                           pathname.includes("/administrador/especialidades");
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                  isActive
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className={`p-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-foreground/20" 
                    : "bg-muted/30 group-hover:bg-muted/60"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Operaciones */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Operaciones
          </h3>
        </div>
        <div className="px-3 space-y-1 mb-4">
          {data.navOperaciones.map((item) => {
            const isActive = pathname.includes("/administrador/inventario") || 
                           pathname.includes("/administrador/reportes");
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                  isActive
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className={`p-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-foreground/20" 
                    : "bg-muted/30 group-hover:bg-muted/60"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Sistema */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Sistema
          </h3>
        </div>
        <div className="px-3 space-y-1 mb-4">
          {data.navSistema.map((item) => {
            const isActive = pathname.includes("/administrador/auditoria") || 
                           pathname.includes("/administrador/configuracion");
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                  isActive
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className={`p-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-primary-foreground/20" 
                    : "bg-muted/30 group-hover:bg-muted/60"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1"></div>
        
        {/* Redes Sociales */}
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Redes Sociales
          </h3>
        </div>
        
        <div className="px-3 space-y-1 mb-4">
          {data.socialMedia.map((social) => (
            <a
              key={social.title}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
              aria-label={`Visitar ${social.title}`}
            >
              <div className={`p-2 rounded-md bg-muted/30 group-hover:bg-muted/60 transition-colors duration-200 ${social.color}`}>
                <Image
                  src={social.icon}
                  alt={`${social.title} icon`}
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
              <span className="font-medium">{social.title}</span>
            </a>
          ))}
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border/50">
        <div className="p-4 space-y-3">
          {/* Estado del sistema */}
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <Activity className="size-3" />
            <span>Sistema Operativo</span>
            <div className="ml-auto size-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          
          {/* Notificación de issues */}
          <div className="flex items-center gap-2 px-3 py-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>2 Issues</span>
            <button className="ml-auto text-red-500 hover:text-red-700">
              <span className="sr-only">Cerrar</span>
              ×
            </button>
          </div>
          
          {/* Botón de logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            <span>Cerrar Sesión</span>
          </Button>
          
          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground mb-2">
              Desarrollado por
            </p>
            <a
              href="https://monstruocreativo.com/software/?v=dd07de856139"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:scale-105"
              aria-label="Visitar sitio web de Monstruo Creativo"
            >
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Monstruo Creativo
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
