'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, Columna } from '@/components/data-table';
import { Cronometro } from '@/components/cronometro';
import { getSession } from '@/lib/auth';
import { 
  citasStorage, pacientesStorage, especialidadesStorage, doctoresStorage,
  generateId, getCurrentTimestamp, logAuditoria
} from '@/lib/storage';
import { validarDoubleBooking, validarDisponibilidadDoctor } from '@/lib/validations';
import { Cita, Paciente } from '@/lib/types';
import { 
  Calendar, Plus, Search, Filter, Play, Pause, Square, Clock, 
  User, Stethoscope, DollarSign, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, Eye, Edit, Trash2, Phone, MessageSquare
} from 'lucide-react';

export default function CitasDiaPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string; precioBase: number }[]>([]);
  const [doctores, setDoctores] = useState<{ id: string; nombres: string; apellidos: string }[]>([]);
  
  // Estados para filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroDoctor, setFiltroDoctor] = useState<string>('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  
  // Estados para formularios
  const [showNuevaCita, setShowNuevaCita] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [showDetalleCita, setShowDetalleCita] = useState(false);
  const [showConfirmacionFinalizada, setShowConfirmacionFinalizada] = useState(false);
  const [citaFinalizada, setCitaFinalizada] = useState<{ duracion: number; paciente: string } | null>(null);
  
  const [sessionUser, setSessionUser] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = citasStorage.find(c => c.fecha === hoy);
    setCitas(citasHoy);
    setPacientes(pacientesStorage.getAll());
    setEspecialidades(especialidadesStorage.find(e => e.activo));
    setDoctores(doctoresStorage.find(d => d.activo));
  };

  const crearNuevaCita = (formData: FormData) => {
    const pacienteId = formData.get('pacienteId') as string;
    const doctorId = formData.get('doctorId') as string;
    const especialidadId = formData.get('especialidadId') as string;
    const fecha = formData.get('fecha') as string;
    const horaInicio = formData.get('horaInicio') as string;
    const duracionMinutos = parseInt(formData.get('duracionMinutos') as string || '30');
    const precio = parseFloat(formData.get('precio') as string);

    // Validar disponibilidad del doctor
    const validacionDisponibilidad = validarDisponibilidadDoctor(doctorId, fecha, horaInicio);
    if (!validacionDisponibilidad.valido) {
      alert('❌ ' + validacionDisponibilidad.mensaje);
      return;
    }

    // Calcular hora de fin
    const [h, m] = horaInicio.split(':').map(Number);
    const fechaFin = new Date();
    fechaFin.setHours(h, m + duracionMinutos);
    const horaFin = fechaFin.toTimeString().slice(0, 5);

    // Validar double booking
    const validacionBooking = validarDoubleBooking(doctorId, fecha, horaInicio, horaFin);
    if (!validacionBooking.valido) {
      alert(validacionBooking.mensaje);
      return;
    }

    const nuevaCita: Cita = {
      id: generateId('cita'),
      pacienteId,
      doctorId,
      especialidadId,
      fecha,
      horaInicio,
      horaFin,
      duracionMinutos,
      estado: 'programada',
      precio,
      estadoPago: 'pendiente',
      motivo: formData.get('motivo') as string || undefined,
      fechaCreacion: getCurrentTimestamp(),
      creadoPor: sessionUser?.userId || '',
    };

    citasStorage.create(nuevaCita);
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Crear cita', 'Cita', nuevaCita.id, undefined, nuevaCita as unknown as Record<string, unknown>);
    }
    
    alert('✅ Cita creada exitosamente');
    setShowNuevaCita(false);
    cargarDatos();
  };

  const handleIniciarCronometro = (citaId: string) => {
    const cita = citasStorage.getById(citaId);
    if (!cita) return;

    citasStorage.update(citaId, {
      horaInicioReal: getCurrentTimestamp(),
      estado: 'en_curso',
    });

    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Iniciar cronómetro', 'Cita', citaId, { estado: cita.estado }, { estado: 'en_curso', horaInicioReal: getCurrentTimestamp() });
    }
    cargarDatos();
  };

  const handleDetenerCronometro = (citaId: string, horaFin: string, duracionSegundos: number) => {
    const cita = citasStorage.getById(citaId);
    if (!cita) return;

    const duracionMinutos = Math.floor(duracionSegundos / 60);

    citasStorage.update(citaId, {
      horaFinReal: horaFin,
      duracionReal: duracionMinutos,
      estado: 'atendida',
    });

    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, 'Detener cronómetro', 'Cita', citaId, undefined, { horaFinReal: horaFin, duracionReal: duracionMinutos, estado: 'atendida' });
    }
    
    // Obtener nombre del paciente para el modal
    const paciente = pacientes.find(p => p.id === cita.pacienteId);
    const nombrePaciente = paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'Paciente';
    
    // Mostrar modal de confirmación
    setCitaFinalizada({
      duracion: duracionMinutos,
      paciente: nombrePaciente
    });
    setShowConfirmacionFinalizada(true);
    
    cargarDatos();
  };

  const actualizarEstadoCita = (citaId: string, nuevoEstado: 'cancelada') => {
    citasStorage.update(citaId, { estado: nuevoEstado });
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, `Actualizar estado cita a ${nuevoEstado}`, 'Cita', citaId, undefined, { estado: nuevoEstado });
    }
    cargarDatos();
  };

  const actualizarEstadoPago = (citaId: string, nuevoEstadoPago: 'pagado' | 'parcial') => {
    citasStorage.update(citaId, { estadoPago: nuevoEstadoPago });
    if (sessionUser) {
      logAuditoria(sessionUser.userId, sessionUser.username, `Actualizar estado pago a ${nuevoEstadoPago}`, 'Cita', citaId, undefined, { estadoPago: nuevoEstadoPago });
    }
    cargarDatos();
  };

  // Filtrar citas
  const citasFiltradas = citas.filter(cita => {
    const cumpleEstado = filtroEstado === 'todos' || cita.estado === filtroEstado;
    const cumpleDoctor = filtroDoctor === 'todos' || cita.doctorId === filtroDoctor;
    
    if (!cumpleEstado || !cumpleDoctor) return false;
    
    if (filtroBusqueda) {
      const paciente = pacientes.find(p => p.id === cita.pacienteId);
      const especialidad = especialidades.find(e => e.id === cita.especialidadId);
      const doctor = doctores.find(d => d.id === cita.doctorId);
      
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        paciente?.nombres.toLowerCase().includes(textoBusqueda) ||
        paciente?.apellidos.toLowerCase().includes(textoBusqueda) ||
        especialidad?.nombre.toLowerCase().includes(textoBusqueda) ||
        doctor?.nombres.toLowerCase().includes(textoBusqueda) ||
        doctor?.apellidos.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  // Estadísticas
  const estadisticas = {
    total: citas.length,
    programadas: citas.filter(c => c.estado === 'programada').length,
    enCurso: citas.filter(c => c.estado === 'en_curso').length,
    atendidas: citas.filter(c => c.estado === 'atendida').length,
    canceladas: citas.filter(c => c.estado === 'cancelada').length,
    noAsistio: 0, // No disponible en el tipo actual
  };

  const columnas: Columna<Cita>[] = [
    {
      key: 'horaInicio',
      titulo: 'Hora',
      sortable: true,
      width: '80px',
      render: (cita: Cita) => (
        <div className="text-center">
          <div className="font-medium">{cita.horaInicio}</div>
          <div className="text-xs text-muted-foreground">{cita.horaFin}</div>
        </div>
      ),
    },
    {
      key: 'paciente',
      titulo: 'Paciente',
      render: (cita: Cita) => {
        const paciente = pacientes.find(p => p.id === cita.pacienteId);
        return (
          <div>
            <div className="font-medium">{paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A'}</div>
            <div className="text-xs text-muted-foreground">{paciente?.telefono || 'N/A'}</div>
          </div>
        );
      },
    },
    {
      key: 'doctor',
      titulo: 'Doctor',
      render: (cita: Cita) => {
        const doctor = doctores.find(d => d.id === cita.doctorId);
        return doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A';
      },
    },
    {
      key: 'especialidad',
      titulo: 'Especialidad',
      render: (cita: Cita) => {
        const especialidad = especialidades.find(e => e.id === cita.especialidadId);
        return especialidad?.nombre || 'N/A';
      },
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (cita: Cita) => {
        const colores: Record<string, string> = {
          programada: 'bg-blue-100 text-blue-800',
          en_curso: 'bg-yellow-100 text-yellow-800',
          atendida: 'bg-green-100 text-green-800',
          cancelada: 'bg-red-100 text-red-800',
          no_asistio: 'bg-gray-100 text-gray-800',
        };
        return <Badge className={colores[cita.estado]}>{cita.estado.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'estadoPago',
      titulo: 'Pago',
      render: (cita: Cita) => {
        const colores: Record<string, string> = {
          pendiente: 'bg-orange-100 text-orange-800',
          pagado: 'bg-green-100 text-green-800',
          parcial: 'bg-yellow-100 text-yellow-800',
        };
        return <Badge className={colores[cita.estadoPago]}>{cita.estadoPago}</Badge>;
      },
    },
    {
      key: 'precio',
      titulo: 'Precio',
      render: (cita: Cita) => `S/ ${cita.precio}`,
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (cita: Cita) => {
        if (cita.estado === 'programada') {
          return (
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={() => handleIniciarCronometro(cita.id)}
              >
                <Play className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCitaSeleccionada(cita);
                  setShowDetalleCita(true);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          );
        }
        if (cita.estado === 'en_curso') {
          return (
            <Cronometro
              horaInicio={cita.horaInicioReal}
              onStop={(horaFin: string, duracionSegundos: number) => handleDetenerCronometro(cita.id, horaFin, duracionSegundos)}
              autoInicio
            />
          );
        }
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCitaSeleccionada(cita);
                setShowDetalleCita(true);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        );
      },
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
          <h1 className="text-3xl font-bold text-foreground">Citas del Día</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('es-PE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
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
          <Button onClick={() => setShowNuevaCita(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programadas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.programadas}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Curso</p>
                <p className="text-2xl font-bold text-yellow-600">{estadisticas.enCurso}</p>
              </div>
              <Play className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atendidas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.atendidas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.canceladas}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No Asistió</p>
                <p className="text-2xl font-bold text-gray-600">{estadisticas.noAsistio}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="programada">Programadas</SelectItem>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="atendida">Atendidas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Doctor</Label>
              <Select value={filtroDoctor} onValueChange={setFiltroDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {doctores.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.nombres} {doctor.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, especialidad o doctor..."
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
                  setFiltroDoctor('todos');
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

      {/* Tabla de Citas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
          <CardDescription>
            {citasFiltradas.length} cita{citasFiltradas.length !== 1 ? 's' : ''} encontrada{citasFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={citasFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={15}
            keyExtractor={(cita: Record<string, unknown>) => cita.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Nueva Cita */}
      {showNuevaCita && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Crear Nueva Cita</CardTitle>
              <CardDescription>Agendar una nueva cita médica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); crearNuevaCita(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Paciente</Label>
                    <Select name="pacienteId" required>
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
                    <Label>Fecha</Label>
                    <Input name="fecha" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div>
                    <Label>Hora</Label>
                    <Input name="horaInicio" type="time" required />
                  </div>
                  <div>
                    <Label>Duración (minutos)</Label>
                    <Input name="duracionMinutos" type="number" defaultValue="30" required />
                  </div>
                  <div>
                    <Label>Precio (S/)</Label>
                    <Input name="precio" type="number" step="0.01" required />
                  </div>
                </div>
                <div>
                  <Label>Motivo</Label>
                  <Input name="motivo" placeholder="Motivo de la consulta..." />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevaCita(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Cita</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Detalle Cita */}
      {showDetalleCita && citaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Detalle de Cita</CardTitle>
              <CardDescription>Información completa de la cita médica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">
                    <Badge className={
                      citaSeleccionada.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                      citaSeleccionada.estado === 'en_curso' ? 'bg-yellow-100 text-yellow-800' :
                      citaSeleccionada.estado === 'atendida' ? 'bg-green-100 text-green-800' :
                      citaSeleccionada.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {citaSeleccionada.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Paciente</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const paciente = pacientes.find(p => p.id === citaSeleccionada.pacienteId);
                      return paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Doctor</Label>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const doctor = doctores.find(d => d.id === citaSeleccionada.doctorId);
                      return doctor ? `Dr. ${doctor.nombres} ${doctor.apellidos}` : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Especialidad</Label>
                  <p className="text-sm text-muted-foreground">
                    {especialidades.find(e => e.id === citaSeleccionada.especialidadId)?.nombre || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha y Hora</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(citaSeleccionada.fecha).toLocaleDateString('es-PE')} {citaSeleccionada.horaInicio} - {citaSeleccionada.horaFin}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio</Label>
                  <p className="text-sm text-muted-foreground font-semibold">S/ {citaSeleccionada.precio}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado de Pago</Label>
                  <div className="mt-1">
                    <Badge className={
                      citaSeleccionada.estadoPago === 'pendiente' ? 'bg-orange-100 text-orange-800' :
                      citaSeleccionada.estadoPago === 'pagado' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {citaSeleccionada.estadoPago}
                    </Badge>
                  </div>
                </div>
              </div>
              {citaSeleccionada.motivo && (
                <div>
                  <Label className="text-sm font-medium">Motivo</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.motivo}</p>
                </div>
              )}
              {citaSeleccionada.duracionReal && (
                <div>
                  <Label className="text-sm font-medium">Duración Real</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.duracionReal} minutos</p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDetalleCita(false)}>
                  Cerrar
                </Button>
                {citaSeleccionada.estado === 'programada' && (
                  <>
                    <Button onClick={() => handleIniciarCronometro(citaSeleccionada.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </Button>
                    <Button variant="outline" onClick={() => actualizarEstadoCita(citaSeleccionada.id, 'cancelada')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                )}
                {citaSeleccionada.estadoPago === 'pendiente' && (
                  <Button onClick={() => actualizarEstadoPago(citaSeleccionada.id, 'pagado')}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Marcar Pagado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Confirmación - Cita Finalizada */}
      {showConfirmacionFinalizada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Cita Finalizada
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                La atención médica ha sido completada exitosamente.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="py-4">
              <div className="bg-accent/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Paciente:</span>
                  <span className="text-sm font-semibold text-foreground">{citaFinalizada?.paciente}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Duración:</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {citaFinalizada?.duracion} minutos
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                  <Badge className="bg-green-100 text-green-800">
                    Atendida
                  </Badge>
                </div>
              </div>
            </CardContent>

            <div className="px-6 pb-6">
              <Button 
                onClick={() => setShowConfirmacionFinalizada(false)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Entendido
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
