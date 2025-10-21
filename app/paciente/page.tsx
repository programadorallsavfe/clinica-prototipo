'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DataTable, Columna } from '@/components/data-table';
import { getSession } from '@/lib/auth';
import { pacientesStorage, citasStorage, doctoresStorage, especialidadesStorage, ordenesStorage, registrosClinicosStorage, pagosStorage } from '@/lib/storage';
import { Orden } from '@/lib/types';
import { Calendar, FileText, ShoppingBag, User } from 'lucide-react';

export default function PacientePage() {
  const [paciente, setPaciente] = useState<{ id: string; nombres: string; apellidos: string; documento: string; telefono: string; email?: string; preferenciaContacto: string; usuarioId: string } | null>(null);
  const [proximaCita, setProximaCita] = useState<{ fecha: string; horaInicio: string; doctorNombre: string; especialidadNombre: string; estadoPago: string; precio: number } | null>(null);
  const [citas, setCitas] = useState<{ id: string; fecha: string; horaInicio: string; especialidadNombre: string; doctorNombre: string; estado: string; estadoPago: string }[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session?.userId) {
      cargarDatos(session.userId);
    }
  }, []);

  const cargarDatos = (usuarioId: string) => {
    // Buscar paciente por usuarioId
    const pac = pacientesStorage.findOne((p: { usuarioId: string }) => p.usuarioId === usuarioId);
    
    if (!pac) {
      setLoading(false);
      return;
    }

    setPaciente(pac);

    // Cargar citas del paciente
    const citasPaciente = citasStorage.find(c => c.pacienteId === pac.id)
      .sort((a, b) => {
        const fechaA = new Date(a.fecha + 'T' + a.horaInicio);
        const fechaB = new Date(b.fecha + 'T' + b.horaInicio);
        return fechaB.getTime() - fechaA.getTime();
      });

    // Enriquecer citas con datos relacionados
    const citasEnriquecidas = citasPaciente.map(cita => {
      const doctor = doctoresStorage.getById(cita.doctorId);
      const especialidad = especialidadesStorage.getById(cita.especialidadId);
      const registro = registrosClinicosStorage.findOne((r: { citaId: string }) => r.citaId === cita.id);
      const pago = pagosStorage.findOne((p: { citaId: string }) => p.citaId === cita.id);

      return {
        ...cita,
        doctorNombre: doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A',
        especialidadNombre: especialidad?.nombre || 'N/A',
        registroClinico: registro,
        pago,
      };
    });

    setCitas(citasEnriquecidas);

    // Encontrar próxima cita
    const ahora = new Date();
    const proxima = citasEnriquecidas
      .filter(c => {
        const fechaCita = new Date(c.fecha + 'T' + c.horaInicio);
        return fechaCita > ahora && c.estado === 'programada';
      })
      .sort((a, b) => {
        const fechaA = new Date(a.fecha + 'T' + a.horaInicio);
        const fechaB = new Date(b.fecha + 'T' + b.horaInicio);
        return fechaA.getTime() - fechaB.getTime();
      })[0];

    setProximaCita(proxima || null);

    // Cargar órdenes
    const ordenesPaciente = ordenesStorage.find((o: { pacienteId: string }) => o.pacienteId === pac.id);
    setOrdenes(ordenesPaciente);

    setLoading(false);
  };

  const getEstadoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      programada: 'bg-blue-100 text-blue-800',
      en_curso: 'bg-yellow-100 text-yellow-800',
      atendida: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      no_asistio: 'bg-gray-100 text-gray-800',
    };

    return <Badge className={colores[estado] || ''}>{estado.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getPagoBadge = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: 'bg-red-100 text-red-800',
      parcial: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-green-100 text-green-800',
      externo_validado: 'bg-blue-100 text-blue-800',
    };

    return <Badge className={colores[estado] || ''}>{estado.replace('_', ' ')}</Badge>;
  };

  const columnasCitas: Columna<{ id: string; fecha: string; horaInicio: string; especialidadNombre: string; doctorNombre: string; estado: string; estadoPago: string }>[] = [
    {
      key: 'fecha',
      titulo: 'Fecha',
      sortable: true,
      render: (cita: { fecha: string }) => new Date(cita.fecha).toLocaleDateString('es-PE'),
    },
    {
      key: 'horaInicio',
      titulo: 'Hora',
      render: (cita: { horaInicio: string }) => cita.horaInicio,
    },
    {
      key: 'especialidadNombre',
      titulo: 'Especialidad',
      sortable: true,
    },
    {
      key: 'doctorNombre',
      titulo: 'Doctor',
      sortable: true,
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (cita: { estado: string }) => getEstadoBadge(cita.estado),
    },
    {
      key: 'estadoPago',
      titulo: 'Pago',
      render: (cita: { estadoPago: string }) => getPagoBadge(cita.estadoPago),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sin Acceso</CardTitle>
            <CardDescription>No se encontró información del paciente</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {paciente.nombres}</h1>
          <p className="text-gray-600 mt-1">Gestiona tus citas y consulta tu información médica</p>
        </div>

        {/* Próxima Cita */}
        {proximaCita && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próxima Cita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha y Hora</p>
                  <p className="font-semibold text-lg">
                    {new Date(proximaCita.fecha).toLocaleDateString('es-PE')} a las {proximaCita.horaInicio}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-semibold">{proximaCita.doctorNombre}</p>
                  <p className="text-sm text-gray-500">{proximaCita.especialidadNombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado de Pago</p>
                  {getPagoBadge(proximaCita.estadoPago)}
                  <p className="text-lg font-semibold mt-2">S/ {proximaCita.precio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contenido Principal */}
        <Tabs defaultValue="historial" className="space-y-4">
          <TabsList>
            <TabsTrigger value="historial">
              <FileText className="h-4 w-4 mr-2" />
              Historial de Citas
            </TabsTrigger>
            <TabsTrigger value="perfil">
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </TabsTrigger>
            <TabsTrigger value="ordenes">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mis Órdenes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="historial">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Citas</CardTitle>
                <CardDescription>Todas tus citas médicas registradas</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={citas}
                  columnas={columnasCitas}
                  itemsPorPagina={10}
                  keyExtractor={(cita: { id: string }) => cita.id}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Mis Datos Personales</CardTitle>
                <CardDescription>Información de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre Completo</p>
                    <p className="font-semibold">{paciente.nombres} {paciente.apellidos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Documento</p>
                    <p className="font-semibold">{paciente.documento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-semibold">{paciente.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{paciente.email || 'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-semibold">{'No registrado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferencia de Contacto</p>
                    <Badge>{paciente.preferenciaContacto}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ordenes">
            <Card>
              <CardHeader>
                <CardTitle>Mis Órdenes</CardTitle>
                <CardDescription>Medicamentos y exámenes comprados</CardDescription>
              </CardHeader>
              <CardContent>
                {ordenes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tienes órdenes registradas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordenes.map((orden) => (
                      <div key={orden.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Orden #{orden.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(orden.fechaCreacion).toLocaleDateString('es-PE')}
                            </p>
                          </div>
                          <Badge>{orden.estado.replace('_', ' ')}</Badge>
                        </div>
                        <div className="space-y-1">
                          {orden.items?.map((item: { id: string; nombreProducto: string; cantidad: number; subtotal: number }) => (
                            <p key={item.id} className="text-sm">
                              {item.nombreProducto} x{item.cantidad} - S/ {item.subtotal}
                            </p>
                          ))}
                        </div>
                        <p className="font-semibold mt-2 text-right">Total: S/ {orden.total || orden.precio}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
