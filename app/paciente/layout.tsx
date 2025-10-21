'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PacienteSidebar } from '@/components/paciente-sidebar';
import { isAuthenticated, getSession } from '@/lib/auth';
import { pacientesStorage } from '@/lib/storage';

export default function PacienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [loading, setLoading] = useState(true);

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
    const paciente = pacientesStorage.findOne(p => p.usuarioId === session.usuarioId);
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:block shadow-lg">
        <PacienteSidebar pacienteNombre={pacienteNombre} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
