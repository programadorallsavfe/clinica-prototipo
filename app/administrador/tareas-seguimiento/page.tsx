'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  Bell, 
  Stethoscope,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react';
import { TareaSeguimiento } from '@/lib/types';
import { AddTareaSeguimientoModal } from '@/components/modals/add-tarea-seguimiento-modal';
import { TareasSeguimientoCard } from '@/components/tareas-seguimiento-card';
import { AlertasTareasPendientes } from '@/components/alertas-tareas-pendientes';
import { GoogleCalendarSimulator } from '@/components/google-calendar-simulator';

// Mock data para tareas de seguimiento
const mockTareas: TareaSeguimiento[] = [
  {
    id: '1',
    pacienteId: '1',
    citaId: '1',
    tipo: 'llamada_telefonica',
    titulo: 'Llamada de seguimiento post-consulta',
    descripcion: 'Llamar al paciente para verificar cómo se siente después de la consulta y si tiene alguna pregunta sobre el tratamiento.',
    fechaProgramada: '2024-01-22',
    horaProgramada: '14:00',
    estado: 'pendiente',
    prioridad: 'alta',
    servicioRelacionado: 'Consulta Ginecológica',
    responsable: 'Dr. María González',
    fechaCreacion: '2024-01-21T10:00:00',
    observaciones: 'Paciente con ansiedad, ser muy empático',
    googleCalendarEventId: undefined,
    sincronizadoConGoogle: false,
    alertaActiva: true,
    fechaAlerta: '2024-01-22'
  },
  {
    id: '2',
    pacienteId: '2',
    citaId: '2',
    tipo: 'envio_correo',
    titulo: 'Envío de resultados de laboratorio',
    descripcion: 'Enviar por correo los resultados del perfil hormonal solicitado.',
    fechaProgramada: '2024-01-23',
    horaProgramada: '09:00',
    estado: 'en_progreso',
    prioridad: 'media',
    servicioRelacionado: 'Laboratorio',
    responsable: 'Lic. Ana Rodríguez',
    fechaCreacion: '2024-01-21T11:00:00',
    observaciones: 'Adjuntar PDF con explicación de resultados',
    googleCalendarEventId: 'gc_event_123',
    sincronizadoConGoogle: true,
    alertaActiva: true,
    fechaAlerta: '2024-01-23'
  },
  {
    id: '3',
    pacienteId: '3',
    citaId: '3',
    tipo: 'recordatorio_cita',
    titulo: 'Recordatorio de cita de control',
    descripcion: 'Recordar al paciente sobre su cita de control prenatal programada para mañana.',
    fechaProgramada: '2024-01-21',
    horaProgramada: '16:00',
    estado: 'completada',
    prioridad: 'alta',
    servicioRelacionado: 'Control Prenatal',
    responsable: 'Dra. Carmen López',
    fechaCreacion: '2024-01-20T15:00:00',
    fechaCompletada: '2024-01-21T16:30:00',
    observaciones: 'Paciente confirmó asistencia',
    googleCalendarEventId: 'gc_event_124',
    sincronizadoConGoogle: true,
    alertaActiva: false
  },
  {
    id: '4',
    pacienteId: '4',
    citaId: '4',
    tipo: 'seguimiento_tratamiento',
    titulo: 'Seguimiento de tratamiento hormonal',
    descripcion: 'Verificar cómo está respondiendo el paciente al tratamiento hormonal prescrito.',
    fechaProgramada: '2024-01-25',
    horaProgramada: '10:00',
    estado: 'pendiente',
    prioridad: 'urgente',
    servicioRelacionado: 'Tratamiento Hormonal',
    responsable: 'Dr. Carlos Mendoza',
    fechaCreacion: '2024-01-21T12:00:00',
    observaciones: 'Paciente con efectos secundarios leves',
    googleCalendarEventId: undefined,
    sincronizadoConGoogle: false,
    alertaActiva: true,
    fechaAlerta: '2024-01-25'
  },
  {
    id: '5',
    pacienteId: '5',
    citaId: '5',
    tipo: 'envio_pdf',
    titulo: 'Envío de informe ecográfico',
    descripcion: 'Enviar el informe de la ecografía transvaginal realizada.',
    fechaProgramada: '2024-01-24',
    horaProgramada: '11:00',
    estado: 'pendiente',
    prioridad: 'media',
    servicioRelacionado: 'Ecografía',
    responsable: 'Tec. Patricia Vargas',
    fechaCreacion: '2024-01-21T13:00:00',
    observaciones: 'Incluir imágenes en alta resolución',
    googleCalendarEventId: undefined,
    sincronizadoConGoogle: false,
    alertaActiva: true,
    fechaAlerta: '2024-01-24'
  }
];

export default function TareasSeguimientoPage() {
  const [tareas, setTareas] = useState<TareaSeguimiento[]>(mockTareas);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: 'todos',
    estado: 'todos',
    prioridad: 'todos',
    responsable: 'todos'
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtrar tareas
  const tareasFiltradas = tareas.filter(tarea => {
    const coincideBusqueda = !filtros.busqueda || 
      tarea.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      tarea.responsable.toLowerCase().includes(filtros.busqueda.toLowerCase());
    
    const coincideTipo = filtros.tipo === 'todos' || tarea.tipo === filtros.tipo;
    const coincideEstado = filtros.estado === 'todos' || tarea.estado === filtros.estado;
    const coincidePrioridad = filtros.prioridad === 'todos' || tarea.prioridad === filtros.prioridad;
    const coincideResponsable = filtros.responsable === 'todos' || tarea.responsable === filtros.responsable;

    return coincideBusqueda && coincideTipo && coincideEstado && coincidePrioridad && coincideResponsable;
  });

  // Estadísticas
  const estadisticas = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    enProgreso: tareas.filter(t => t.estado === 'en_progreso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length,
    sincronizadas: tareas.filter(t => t.sincronizadoConGoogle).length,
    alertas: tareas.filter(t => t.alertaActiva && t.estado === 'pendiente').length
  };

  const handleUpdateEstado = (tareaId: string, nuevoEstado: TareaSeguimiento['estado']) => {
    setTareas(prev => prev.map(tarea => 
      tarea.id === tareaId 
        ? { 
            ...tarea, 
            estado: nuevoEstado,
            fechaCompletada: nuevoEstado === 'completada' ? new Date().toISOString() : undefined
          }
        : tarea
    ));
  };

  const handleSincronizarGoogle = (tareaId: string) => {
    setTareas(prev => prev.map(tarea => 
      tarea.id === tareaId 
        ? { 
            ...tarea, 
            sincronizadoConGoogle: true,
            googleCalendarEventId: `gc_event_${Date.now()}`
          }
        : tarea
    ));
  };

  const handleDesincronizarGoogle = (tareaId: string) => {
    setTareas(prev => prev.map(tarea => 
      tarea.id === tareaId 
        ? { 
            ...tarea, 
            sincronizadoConGoogle: false,
            googleCalendarEventId: undefined
          }
        : tarea
    ));
  };

  const handleVerDetalles = (tareaId: string) => {
    console.log('Ver detalles de tarea:', tareaId);
  };

  const handleMarcarComoVista = (tareaId: string) => {
    setTareas(prev => prev.map(tarea => 
      tarea.id === tareaId 
        ? { ...tarea, alertaActiva: false }
        : tarea
    ));
  };

  const handleAddTarea = (nuevaTarea: Omit<TareaSeguimiento, 'id'>) => {
    const tarea: TareaSeguimiento = {
      ...nuevaTarea,
      id: (tareas.length + 1).toString()
    };
    setTareas(prev => [...prev, tarea]);
  };

  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case 'llamada_telefonica': return 'Llamada Telefónica';
      case 'envio_correo': return 'Envío de Correo';
      case 'envio_enlace_video': return 'Envío de Enlace de Video';
      case 'envio_pdf': return 'Envío de PDF';
      case 'recordatorio_cita': return 'Recordatorio de Cita';
      case 'seguimiento_tratamiento': return 'Seguimiento de Tratamiento';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Tareas de Seguimiento
        </h1>
        <p className="text-muted-foreground text-lg">
          Gestión de tareas de seguimiento y recordatorios para pacientes
        </p>
      </div>

      {/* Alertas de Tareas Pendientes */}
      <AlertasTareasPendientes
        tareas={tareas}
        onVerTarea={handleVerDetalles}
        onMarcarComoVista={handleMarcarComoVista}
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tareas</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tareas registradas
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.pendientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por realizar
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Progreso</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-200">
              <Stethoscope className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.enProgreso}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En ejecución
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completadas</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.completadas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Finalizadas
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sincronizadas</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-200">
              <RefreshCw className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.sincronizadas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Con Google Calendar
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.alertas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gestión */}
      <Tabs defaultValue="tareas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tareas">Gestión de Tareas</TabsTrigger>
          <TabsTrigger value="calendario">Google Calendar</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        {/* Tab Gestión de Tareas */}
        <TabsContent value="tareas" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros de Búsqueda
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Filtra y busca tareas específicas
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Tarea
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Búsqueda</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tareas..."
                      value={filtros.busqueda}
                      onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tipo</label>
                  <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="llamada_telefonica">Llamada Telefónica</SelectItem>
                      <SelectItem value="envio_correo">Envío de Correo</SelectItem>
                      <SelectItem value="envio_enlace_video">Envío de Enlace de Video</SelectItem>
                      <SelectItem value="envio_pdf">Envío de PDF</SelectItem>
                      <SelectItem value="recordatorio_cita">Recordatorio de Cita</SelectItem>
                      <SelectItem value="seguimiento_tratamiento">Seguimiento de Tratamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estado</label>
                  <Select value={filtros.estado} onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_progreso">En Progreso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Prioridad</label>
                  <Select value={filtros.prioridad} onValueChange={(value) => setFiltros(prev => ({ ...prev, prioridad: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas las prioridades</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Responsable</label>
                  <Select value={filtros.responsable} onValueChange={(value) => setFiltros(prev => ({ ...prev, responsable: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los responsables</SelectItem>
                      <SelectItem value="Dr. María González">Dr. María González</SelectItem>
                      <SelectItem value="Lic. Ana Rodríguez">Lic. Ana Rodríguez</SelectItem>
                      <SelectItem value="Dra. Carmen López">Dra. Carmen López</SelectItem>
                      <SelectItem value="Dr. Carlos Mendoza">Dr. Carlos Mendoza</SelectItem>
                      <SelectItem value="Tec. Patricia Vargas">Tec. Patricia Vargas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Tareas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tareasFiltradas.map((tarea) => (
              <TareasSeguimientoCard
                key={tarea.id}
                tarea={tarea}
                onUpdateEstado={handleUpdateEstado}
                onSincronizarGoogle={handleSincronizarGoogle}
                onVerDetalles={handleVerDetalles}
              />
            ))}
          </div>

          {tareasFiltradas.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No se encontraron tareas</h3>
                <p className="text-sm text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Google Calendar */}
        <TabsContent value="calendario" className="space-y-6">
          <GoogleCalendarSimulator
            tareas={tareas}
            onSincronizarTarea={handleSincronizarGoogle}
            onDesincronizarTarea={handleDesincronizarGoogle}
          />
        </TabsContent>

        {/* Tab Configuración */}
        <TabsContent value="configuracion" className="space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configuración de Tareas de Seguimiento
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configura los parámetros del sistema de tareas de seguimiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-3">Configuración de Alertas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alertas por email:</span>
                      <span className="text-foreground">Activado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recordatorios:</span>
                      <span className="text-foreground">24 horas antes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Notificaciones push:</span>
                      <span className="text-foreground">Activado</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-medium text-foreground mb-3">Integración Google Calendar</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <span className="text-green-500">Conectado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sincronización:</span>
                      <span className="text-foreground">Automática</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calendario:</span>
                      <span className="text-foreground">Clínica Feminis</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para agregar tareas */}
      <AddTareaSeguimientoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTarea}
      />
    </div>
  );
}
