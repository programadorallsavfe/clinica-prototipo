'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  ClipboardList, 
  LogOut, 
  Activity, 
  Stethoscope,
  FileSpreadsheet,
  Clock,
  User,
  Heart,
  Pill,
  TestTube,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MedicoSidebarProps {
  doctorNombre: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function MedicoSidebar({ doctorNombre, isCollapsed = false, onToggleCollapse }: MedicoSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        onClick: () => router.push("/medico"),
        icon: LayoutDashboard,
      },
    ],
    navAtencion: [
      {
        title: "Mi Agenda",
        onClick: () => router.push("/medico/agenda"),
        icon: Calendar,
        badge: "8",
      },
      {
        title: "Pacientes del Día",
        onClick: () => router.push("/medico/pacientes-dia"),
        icon: Users,
        badge: "5",
      },
      {
        title: "Historia Clínica",
        onClick: () => router.push("/medico/historia-clinica"),
        icon: FileText,
      },
      {
        title: "Plantillas",
        onClick: () => router.push("/medico/plantillas"),
        icon: FileSpreadsheet,
      },
    ],
    navEspecialidades: [
      {
        title: "Cardiología",
        onClick: () => router.push("/medico/cardiologia"),
        icon: Heart,
      },
      {
        title: "Medicina General",
        onClick: () => router.push("/medico/medicina-general"),
        icon: Stethoscope,
      },
      {
        title: "Farmacología",
        onClick: () => router.push("/medico/farmacologia"),
        icon: Pill,
      },
      {
        title: "Laboratorio",
        onClick: () => router.push("/medico/laboratorio"),
        icon: TestTube,
      },
    ],
    navReportes: [
      {
        title: "Mis Estadísticas",
        onClick: () => router.push("/medico/estadisticas"),
        icon: BarChart3,
      },
      {
        title: "Reportes Médicos",
        onClick: () => router.push("/medico/reportes"),
        icon: ClipboardList,
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
          onClick={() => router.push("/medico")}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} cursor-pointer hover:bg-muted/50 transition-colors duration-200 rounded-lg ${isCollapsed ? 'p-2' : 'p-3'}`}
        >
          <img 
            src="/logo_feminis.webp" 
            alt="Logo Feminis" 
            className={`${isCollapsed ? 'w-8 h-8' : 'w-250 h-12'} object-contain`}
          />
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
                  pathname === "/medico" 
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

        {/* Atención Médica */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Atención Médica
            </h3>
          )}
          <div className="space-y-1">
            {data.navAtencion.map((item) => {
              // Determinar la ruta específica para cada elemento
              let targetPath = "";
              if (item.title === "Mi Agenda") {
                targetPath = "/medico/agenda";
              } else if (item.title === "Pacientes del Día") {
                targetPath = "/medico/pacientes-dia";
              } else if (item.title === "Historia Clínica") {
                targetPath = "/medico/historia-clinica";
              } else if (item.title === "Plantillas") {
                targetPath = "/medico/plantillas";
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

        {/* Especialidades */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Especialidades
            </h3>
          )}
          <div className="space-y-1">
            {data.navEspecialidades.map((item) => {
              // Determinar la ruta específica para cada elemento
              let targetPath = "";
              if (item.title === "Cardiología") {
                targetPath = "/medico/cardiologia";
              } else if (item.title === "Medicina General") {
                targetPath = "/medico/medicina-general";
              } else if (item.title === "Farmacología") {
                targetPath = "/medico/farmacologia";
              } else if (item.title === "Laboratorio") {
                targetPath = "/medico/laboratorio";
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

        {/* Reportes */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Reportes
            </h3>
          )}
          <div className="space-y-1">
            {data.navReportes.map((item) => {
              // Determinar la ruta específica para cada elemento
              let targetPath = "";
              if (item.title === "Mis Estadísticas") {
                targetPath = "/medico/estadisticas";
              } else if (item.title === "Reportes Médicos") {
                targetPath = "/medico/reportes";
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
        {/* Estado del médico */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <Activity className="size-3" />
            <span>Dr. {doctorNombre}</span>
            <div className="ml-auto size-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}
        
        {/* Notificación de citas pendientes */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>5 Citas Pendientes</span>
            <button className="ml-auto text-blue-500 hover:text-blue-700">
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
