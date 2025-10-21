'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecepcionistaSidebar } from '@/components/recepcionista-sidebar';
import { isAuthenticated, getSession } from '@/lib/auth';
import { usuariosStorage } from '@/lib/storage';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function RecepcionistaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

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
    const usuario = usuariosStorage.getById(session.usuarioId);
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
    <SidebarProvider>
      <RecepcionistaSidebar recepcionistaNombre={userName} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Sistema de Clínica</span>
            <span>/</span>
            <span>Recepción</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
