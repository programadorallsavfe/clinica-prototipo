'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Users, Calendar, FileText, ShoppingBag, CreditCard, ClipboardList, LogOut, Activity, UserPlus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecepcionistaSidebarProps {
  recepcionistaNombre: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function RecepcionistaSidebar({ recepcionistaNombre, isCollapsed, onToggleCollapse }: RecepcionistaSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        onClick: () => router.push("/recepcionista"),
        icon: LayoutDashboard,
      },
    ],
    navGestionPacientes: [
      {
        title: "Leads",
        onClick: () => router.push("/recepcionista/leads"),
        icon: Users,
        badge: "3",
      },
      {
        title: "Cotizaciones",
        onClick: () => router.push("/recepcionista/cotizaciones"),
        icon: FileText,
      },
      {
        title: "Citas del Día",
        onClick: () => router.push("/recepcionista/citas"),
        icon: Calendar,
        badge: "8",
      },
      {
        title: "Pacientes",
        onClick: () => router.push("/recepcionista/pacientes"),
        icon: UserPlus,
      },
    ],
    navOperaciones: [
      
      {
        title: "Órdenes",
        onClick: () => router.push("/recepcionista/ordenes"),
        icon: ClipboardList,
      },
      {
        title: "Ventas Auxiliares",
        onClick: () => router.push("/recepcionista/ventas"),
        icon: ShoppingBag,
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
    <aside className={`${isCollapsed ? 'w-16' : 'w-72'} h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}>
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-b border-sidebar-border`}>
        <div 
          onClick={() => router.push("/recepcionista")}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} cursor-pointer hover:bg-muted/50 transition-colors duration-200 rounded-lg ${isCollapsed ? 'p-2' : 'p-3'}`}
        >
          <img 
            src="/logo_feminis.webp" 
            alt="Logo Feminis" 
            className={`${isCollapsed ? 'w-8 h-8' : 'w-250 h-12'} object-contain`}
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-primary">RECEPCIÓN</span>
              <span className="text-xs text-muted-foreground">{recepcionistaNombre}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Dashboard */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Principal
            </h3>
          )}
          <div className="space-y-1">
            {data.navMain.map((item) => (
              <button
                key={item.title}
                onClick={item.onClick}
                title={isCollapsed ? item.title : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-2 py-3' : 'px-3 py-2.5'} rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                  pathname === "/recepcionista" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">{item.title}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Gestión de Pacientes */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Gestión de Pacientes
            </h3>
          )}
          <div className="space-y-1">
            {data.navGestionPacientes.map((item) => {
              // Determinar la ruta específica para cada elemento
              let targetPath = "";
              if (item.title === "Leads") {
                targetPath = "/recepcionista/leads";
              } else if (item.title === "Cotizaciones") {
                targetPath = "/recepcionista/cotizaciones";
              } else if (item.title === "Citas del Día") {
                targetPath = "/recepcionista/citas";
              } else if (item.title === "Pacientes") {
                targetPath = "/recepcionista/pacientes";
              }
              
              const isActive = pathname === targetPath;
              return (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  title={isCollapsed ? item.title : undefined}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-2 py-3' : 'px-3 py-2.5'} rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                    isActive
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operaciones */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Operaciones
            </h3>
          )}
          <div className="space-y-1">
            {data.navOperaciones.map((item) => {
              // Determinar la ruta específica para cada elemento
              let targetPath = "";
              if (item.title === "Pagos") {
                targetPath = "/recepcionista/pagos";
              } else if (item.title === "Órdenes") {
                targetPath = "/recepcionista/ordenes";
              } else if (item.title === "Ventas Auxiliares") {
                targetPath = "/recepcionista/ventas";
              }
              
              const isActive = pathname === targetPath;
              return (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  title={isCollapsed ? item.title : undefined}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-2 py-3' : 'px-3 py-2.5'} rounded-lg text-sm transition-all duration-200 group w-full text-left ${
                    isActive
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span className="font-medium">{item.title}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Redes Sociales
            </h3>
          )}
          <div className="space-y-1">
            {data.socialMedia.map((social) => (
              <a
                key={social.title}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={isCollapsed ? social.title : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-2 py-3' : 'px-3 py-2.5'} rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group`}
                aria-label={`Visitar ${social.title}`}
              >
                <Image
                  src={social.icon}
                  alt={`${social.title} icon`}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                {!isCollapsed && <span className="font-medium">{social.title}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className={`border-t border-sidebar-border ${isCollapsed ? 'p-2' : 'p-4'} space-y-3`}>
        {/* Estado de la clínica */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <Activity className="size-3" />
            <span>Clínica Operativa</span>
            <div className="ml-auto size-2 rounded-full bg-success animate-pulse" />
          </div>
        )}
        
        {/* Notificación de alertas médicas */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>2 Issues</span>
            <button className="ml-auto text-red-500 hover:text-red-700">
              <span className="sr-only">Cerrar</span>
              ×
            </button>
          </div>
        )}
        
        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          title={isCollapsed ? "Cerrar Sesión" : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} ${isCollapsed ? 'px-2 py-3' : 'px-3 py-2.5'} rounded-lg text-sm transition-all duration-200 group w-full text-left text-destructive hover:text-destructive hover:bg-destructive/10`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
        </button>
        
        {/* Footer */}
        {!isCollapsed && (
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
        )}
      </div>
    </aside>
  );
}
