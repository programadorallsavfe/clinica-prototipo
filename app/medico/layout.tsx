'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MedicoSidebar } from '@/components/medico-sidebar';
import { isAuthenticated, getSession } from '@/lib/auth';
import { doctoresStorage } from '@/lib/storage';

export default function MedicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [doctorNombre, setDoctorNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth');
      return;
    }

    const session = getSession();
    if (session?.rol !== 'medico' && session?.rol !== 'administrador') {
      router.push('/auth');
      return;
    }

    // Obtener nombre del doctor
    const doctor = doctoresStorage.findOne(d => d.usuarioId === session.usuarioId);
    if (doctor) {
      setDoctorNombre(`Dr. ${doctor.nombres} ${doctor.apellidos}`);
    } else {
      setDoctorNombre('Doctor');
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:block shadow-lg">
        <MedicoSidebar doctorNombre={doctorNombre} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
