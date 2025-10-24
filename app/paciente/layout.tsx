'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PacienteSidebar } from '@/components/paciente-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { isAuthenticated, getSession } from '@/lib/auth';
import { pacientesStorage } from '@/lib/storage';
import { Menu } from 'lucide-react';

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }

    const session = getSession();
    if (session?.rol !== 'paciente') {
      router.push('/auth');
      return;
    }

    // Obtener nombre del paciente
    const paciente = pacientesStorage.findOne(p => p.usuarioId === session.userId);
    if (paciente) {
      setPacienteNombre(`${paciente.nombres} ${paciente.apellidos}`);
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <PacienteSidebar pacienteNombre={pacienteNombre} isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
            aria-label={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
            title={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Sistema de Clínica</span>
            <span>/</span>
            <span>Paciente</span>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
