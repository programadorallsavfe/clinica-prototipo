'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdministradorSidebar } from '@/components/administrador-sidebar';
import { isAuthenticated, getSession } from '@/lib/auth';
import { usuariosStorage } from '@/lib/storage';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdministradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [adminNombre, setAdminNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }

    const session = getSession();
    if (session?.rol !== 'administrador') {
      router.push('/auth');
      return;
    }

    // Obtener nombre del admin
    const usuario = usuariosStorage.getById(session.usuarioId);
    if (usuario) {
      setAdminNombre(usuario.username);
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
      <AdministradorSidebar adminNombre={adminNombre} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Sistema de Clínica</span>
            <span>/</span>
            <span>Administración</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
