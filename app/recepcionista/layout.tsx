'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecepcionistaSidebar } from '@/components/recepcionista-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { isAuthenticated, getSession } from '@/lib/auth';
import { usuariosStorage } from '@/lib/storage';
import { Menu } from 'lucide-react';

export default function RecepcionistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }

    const session = getSession();
    if (session?.rol !== 'recepcionista' && session?.rol !== 'administrador') {
      router.push('/auth');
      return;
    }

    // Obtener nombre del usuario
    const usuario = usuariosStorage.getById(session.userId);
    if (usuario) {
      setUserName(usuario.username);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <RecepcionistaSidebar 
        recepcionistaNombre={userName} 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 bg-card">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Sistema de Clínica</span>
            <span>/</span>
            <span>Recepción</span>
          </div>
          
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
