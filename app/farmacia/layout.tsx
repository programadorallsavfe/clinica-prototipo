'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FarmaciaSidebar } from '@/components/farmacia-sidebar';
import { isAuthenticated, getSession } from '@/lib/auth';
import { usuariosStorage } from '@/lib/storage';

export default function FarmaciaLayout({
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
    if (session?.rol !== 'administrador') {
      // Por ahora solo admin puede acceder a farmacia
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:block shadow-lg">
        <FarmaciaSidebar userName={userName} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
