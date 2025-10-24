'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DataTable, Columna } from '@/components/data-table';
import { getSession } from '@/lib/auth';
import { 
  cotizacionesStorage, leadsStorage, pacientesStorage, especialidadesStorage, 
  doctoresStorage, generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { Cotizacion, Lead, Paciente } from '@/lib/types';
import { 
  FileText, Plus, Search, Filter, Eye, CheckCircle, XCircle, 
  Clock, Calendar, User, DollarSign, MessageSquare, Send, RefreshCw
} from 'lucide-react';

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string; precioBase: number }[]>([]);
  const [doctores, setDoctores] = useState<{ id: string; nombres: string; apellidos: string }[]>([]);
  
  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  
  // Estados para formularios
  const [showNuevaCotizacion, setShowNuevaCotizacion] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState<Cotizacion | null>(null);
  const [showDetalleCotizacion, setShowDetalleCotizacion] = useState(false);
  
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    setCotizaciones(cotizacionesStorage.getAll());
    setLeads(leadsStorage.getAll());
    setPacientes(pacientesStorage.getAll());
    setEspecialidades(especialidadesStorage.find(e => e.activo));
    setDoctores(doctoresStorage.find(d => d.activo));
  };

  const crearNuevaCotizacion = (formData: FormData) => {
    const especialidadId = formData.get('especialidadId') as string;
    const doctorId = formData.get('doctorId') as string;
    const precio = parseFloat(formData.get('precio') as string);
    const leadId = formData.get('leadId') as string || undefined;
    const pacienteId = formData.get('pacienteId') as string || undefined;

    const fechaCaducidad = new Date();
    fechaCaducidad.setDate(fechaCaducidad.getDate() + 7); // Válida por 7 días

    const nuevaCotizacion: Cotizacion = {
      id: generateId('cot'),
      leadId,
      pacienteId,
      especialidadId,
      doctorId,
      fechaPropuesta: formData.get('fechaPropuesta') as string,
      horaPropuesta: formData.get('horaPropuesta') as string,
      precio,
      estado: 'enviada',
      comentarios: formData.get('comentarios') as string || undefined,
      fechaCaducidad: fechaCaducidad.toISOString(),
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
      fechaEnvio: getCurrentTimestamp(),
    };

    cotizacionesStorage.create(nuevaCotizacion);
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear cotización', 'Cotizacion', nuevaCotizacion.id, undefined, nuevaCotizacion as unknown as Record<string, unknown>);
    }
    
    alert('✅ Cotización creada exitosamente. En producción se enviaría por WhatsApp.');
    setShowNuevaCotizacion(false);
    cargarDatos();
  };

  const actualizarEstadoCotizacion = (cotizacionId: string, nuevoEstado: 'aceptada' | 'rechazada') => {
    cotizacionesStorage.update(cotizacionId, { estado: nuevoEstado });
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, `Actualizar estado cotización a ${nuevoEstado}`, 'Cotizacion', cotizacionId, undefined, { estado: nuevoEstado });
    }
    cargarDatos();
  };

  const reenviarCotizacion = (cotizacionId: string) => {
    cotizacionesStorage.update(cotizacionId, { 
      fechaEnvio: getCurrentTimestamp(),
      estado: 'enviada'
    });
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Reenviar cotización', 'Cotizacion', cotizacionId, undefined, { fechaEnvio: getCurrentTimestamp() });
    }
    alert('✅ Cotización reenviada. En producción se enviaría por WhatsApp.');
    cargarDatos();
  };

  // Filtrar cotizaciones
  const cotizacionesFiltradas = cotizaciones.filter(cotizacion => {
    const cumpleEstado = filtroEstado === 'todos' || cotizacion.estado === filtroEstado;
    
    if (!cumpleEstado) return false;
    
    if (filtroBusqueda) {
      const especialidad = especialidades.find(e => e.id === cotizacion.especialidadId);
      const doctor = doctores.find(d => d.id === cotizacion.doctorId);
      const lead = cotizacion.leadId ? leads.find(l => l.id === cotizacion.leadId) : null;
      const paciente = cotizacion.pacienteId ? pacientes.find(p => p.id === cotizacion.pacienteId) : null;
      
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        especialidad?.nombre.toLowerCase().includes(textoBusqueda) ||
        doctor?.nombres.toLowerCase().includes(textoBusqueda) ||
        doctor?.apellidos.toLowerCase().includes(textoBusqueda) ||
        lead?.nombre.toLowerCase().includes(textoBusqueda) ||
        paciente?.nombres.toLowerCase().includes(textoBusqueda) ||
        paciente?.apellidos.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  // Estadísticas
  const estadisticas = {
    total: cotizaciones.length,
    enviadas: cotizaciones.filter(c => c.estado === 'enviada').length,
    aceptadas: cotizaciones.filter(c => c.estado === 'aceptada').length,
    rechazadas: cotizaciones.filter(c => c.estado === 'rechazada').length,
    expiradas: cotizaciones.filter(c => c.estado === 'expirada').length,
  };

  const columnas: Columna<Cotizacion>[] = [
    {
      key: 'fechaCreacion',
      titulo: 'Fecha',
      sortable: true,
      render: (cotizacion: Cotizacion) => {
        const fecha = new Date(cotizacion.fechaCreacion);
        return fecha.toLocaleDateString('es-PE');
      },
    },
    {
      key: 'cliente',
      titulo: 'Cliente',
      render: (cotizacion: Cotizacion) => {
        if (cotizacion.leadId) {
          const lead = leads.find(l => l.id === cotizacion.leadId);
          return lead ? lead.nombre : 'N/A';
        } else if (cotizacion.pacienteId) {
          const paciente = pacientes.find(p => p.id === cotizacion.pacienteId);
          return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A';
        }
        return 'N/A';
      },
    },
    {
      key: 'especialidad',
      titulo: 'Especialidad',
      render: (cotizacion: Cotizacion) => {
        const especialidad = especialidades.find(e => e.id === cotizacion.especialidadId);
        return especialidad?.nombre || 'N/A';
      },
    },
    {
      key: 'doctor',
      titulo: 'Doctor',
      render: (cotizacion: Cotizacion) => {
        const doctor = doctores.find(d => d.id === cotizacion.doctorId);
        return doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A';
      },
    },
    {
      key: 'fechaPropuesta',
      titulo: 'Fecha Propuesta',
      render: (cotizacion: Cotizacion) => {
        const fecha = new Date(cotizacion.fechaPropuesta);
        return `${fecha.toLocaleDateString('es-PE')} ${cotizacion.horaPropuesta}`;
      },
    },
    {
      key: 'precio',
      titulo: 'Precio',
      render: (cotizacion: Cotizacion) => `S/ ${cotizacion.precio}`,
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (cotizacion: Cotizacion) => {
        const colores: Record<string, string> = {
          enviada: 'bg-blue-100 text-blue-800',
          aceptada: 'bg-green-100 text-green-800',
          rechazada: 'bg-red-100 text-red-800',
          expirada: 'bg-gray-100 text-gray-800',
        };
        return <Badge className={colores[cotizacion.estado]}>{cotizacion.estado}</Badge>;
      },
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (cotizacion: Cotizacion) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCotizacionSeleccionada(cotizacion);
              setShowDetalleCotizacion(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          {cotizacion.estado === 'enviada' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => reenviarCotizacion(cotizacion.id)}
              >
                <Send className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => actualizarEstadoCotizacion(cotizacion.id, 'aceptada')}
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => actualizarEstadoCotizacion(cotizacion.id, 'rechazada')}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!sessionUser) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cotizaciones</h1>
          <p className="text-muted-foreground">Gestión de propuestas de servicios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              cargarDatos();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowNuevaCotizacion(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cotización
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enviadas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.enviadas}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aceptadas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.aceptadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rechazadas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.rechazadas}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiradas</p>
                <p className="text-2xl font-bold text-gray-600">{estadisticas.expiradas}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="enviada">Enviadas</SelectItem>
                  <SelectItem value="aceptada">Aceptadas</SelectItem>
                  <SelectItem value="rechazada">Rechazadas</SelectItem>
                  <SelectItem value="expirada">Expiradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente, especialidad o doctor..."
                  value={filtroBusqueda}
                  onChange={(e) => setFiltroBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFiltroEstado('todos');
                  setFiltroBusqueda('');
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Cotizaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
          <CardDescription>
            {cotizacionesFiltradas.length} cotización{cotizacionesFiltradas.length !== 1 ? 'es' : ''} encontrada{cotizacionesFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={cotizacionesFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={10}
            keyExtractor={(cotizacion: Record<string, unknown>) => cotizacion.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Nueva Cotización */}
      {showNuevaCotizacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Crear Nueva Cotización</CardTitle>
              <CardDescription>Generar una propuesta de servicio para un cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevaCotizacion(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Cliente (Lead)</Label>
                    <Select name="leadId">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map(lead => (
                          <SelectItem key={lead.id} value={lead.id}>{lead.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cliente (Paciente)</Label>
                    <Select name="pacienteId">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {pacientes.map(paciente => (
                          <SelectItem key={paciente.id} value={paciente.id}>
                            {paciente.nombres} {paciente.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Especialidad</Label>
                    <Select name="especialidadId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map(especialidad => (
                          <SelectItem key={especialidad.id} value={especialidad.id}>
                            {especialidad.nombre} - S/{especialidad.precioBase}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Doctor</Label>
                    <Select name="doctorId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctores.map(doctor => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            Dr. {doctor.nombres} {doctor.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fecha Propuesta</Label>
                    <Input name="fechaPropuesta" type="date" required />
                  </div>
                  <div>
                    <Label>Hora Propuesta</Label>
                    <Input name="horaPropuesta" type="time" required />
                  </div>
                  <div>
                    <Label>Precio (S/)</Label>
                    <Input name="precio" type="number" step="0.01" required />
                  </div>
                </div>
                <div>
                  <Label>Comentarios</Label>
                  <Textarea name="comentarios" placeholder="Comentarios adicionales..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevaCotizacion(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Cotización</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detalle Cotización */}
      {showDetalleCotizacion && cotizacionSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Detalle de Cotización</CardTitle>
              <CardDescription>Información completa de la propuesta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm text-muted-foreground">{cotizacionSeleccionada.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">
                    <Badge className={
                      cotizacionSeleccionada.estado === 'enviada' ? 'bg-blue-100 text-blue-800' :
                      cotizacionSeleccionada.estado === 'aceptada' ? 'bg-green-100 text-green-800' :
                      cotizacionSeleccionada.estado === 'rechazada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {cotizacionSeleccionada.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cliente</Label>
                  <p className="text-sm text-muted-foreground">
                    {cotizacionSeleccionada.leadId ? 
                      leads.find(l => l.id === cotizacionSeleccionada.leadId)?.nombre :
                      cotizacionSeleccionada.pacienteId ?
                      (() => {
                        const paciente = pacientes.find(p => p.id === cotizacionSeleccionada.pacienteId);
                        return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A';
                      })() : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Especialidad</Label>
                  <p className="text-sm text-muted-foreground">
                    {especialidades.find(e => e.id === cotizacionSeleccionada.especialidadId)?.nombre || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Doctor</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const doctor = doctores.find(d => d.id === cotizacionSeleccionada.doctorId);
                      return doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha y Hora</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cotizacionSeleccionada.fechaPropuesta).toLocaleDateString('es-PE')} {cotizacionSeleccionada.horaPropuesta}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio</Label>
                  <p className="text-sm text-muted-foreground font-semibold">S/ {cotizacionSeleccionada.precio}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha de Envío</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cotizacionSeleccionada.fechaEnvio).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
              {cotizacionSeleccionada.comentarios && (
                <div>
                  <Label className="text-sm font-medium">Comentarios</Label>
                  <p className="text-sm text-muted-foreground">{cotizacionSeleccionada.comentarios}</p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDetalleCotizacion(false)}>
                  Cerrar
                </Button>
                {cotizacionSeleccionada.estado === 'enviada' && (
                  <>
                    <Button variant="outline" onClick={() => reenviarCotizacion(cotizacionSeleccionada.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      Reenviar
                    </Button>
                    <Button onClick={() => actualizarEstadoCotizacion(cotizacionSeleccionada.id, 'aceptada')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aceptar
                    </Button>
                    <Button variant="destructive" onClick={() => actualizarEstadoCotizacion(cotizacionSeleccionada.id, 'rechazada')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
