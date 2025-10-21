'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  LogOut,
  Home,
  Pill,
  FileText,
  BarChart
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function FarmaciaSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: 'Inicio',
      href: '/farmacia',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Inventario',
      href: '/farmacia/inventario',
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: 'Ventas',
      href: '/farmacia/ventas',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: 'Órdenes Médicas',
      href: '/farmacia/ordenes',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Productos',
      href: '/farmacia/productos',
      icon: <Pill className="h-5 w-5" />,
    },
    {
      title: 'Alertas',
      href: '/farmacia/alertas',
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      title: 'Reportes',
      href: '/farmacia/reportes',
      icon: <BarChart className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('clinica_session');
    window.location.href = '/auth';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-orange-600 to-orange-800 text-white">
      {/* Header */}
      <div className="p-6 border-b border-orange-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Farmacia</h2>
            <p className="text-xs text-orange-200">{userName}</p>
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
                  ? 'bg-white text-orange-800 shadow-lg'
                  : 'text-orange-100 hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-orange-500">
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span>Alertas de Stock</span>
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">3</span>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-orange-100 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
