'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  FileText, 
  User, 
  ShoppingBag, 
  LogOut,
  Home,
  Clock,
  Bell
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function PacienteSidebar({ pacienteNombre }: { pacienteNombre: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: 'Inicio',
      href: '/paciente',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Mis Citas',
      href: '/paciente/citas',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: 'Historia Clínica',
      href: '/paciente/historia',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Mis Órdenes',
      href: '/paciente/ordenes',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: 'Mi Perfil',
      href: '/paciente/perfil',
      icon: <User className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('clinica_session');
    window.location.href = '/auth';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-600 to-purple-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-purple-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Portal Paciente</h2>
            <p className="text-xs text-purple-200">{pacienteNombre}</p>
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
                  ? 'bg-white text-purple-800 shadow-lg'
                  : 'text-purple-100 hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-500">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-purple-100 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
