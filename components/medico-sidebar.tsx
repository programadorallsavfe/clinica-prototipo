'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  FileText, 
  Users, 
  ClipboardList, 
  LogOut,
  Home,
  Stethoscope,
  FileSpreadsheet,
  Clock
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function MedicoSidebar({ doctorNombre }: { doctorNombre: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: 'Inicio',
      href: '/medico',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Mi Agenda',
      href: '/medico/agenda',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Pacientes del Día',
      href: '/medico/pacientes-dia',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Historia Clínica',
      href: '/medico/historia-clinica',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Plantillas',
      href: '/medico/plantillas',
      icon: <FileSpreadsheet className="h-5 w-5" />,
    },
    {
      title: 'Mis Estadísticas',
      href: '/medico/estadisticas',
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('clinica_session');
    window.location.href = '/auth';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Panel Médico</h2>
            <p className="text-xs text-blue-200">{doctorNombre}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-500">
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Citas hoy:</span>
            </div>
            <span className="font-semibold">5</span>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
