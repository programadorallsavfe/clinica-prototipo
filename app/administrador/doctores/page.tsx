'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession } from '@/lib/auth';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Stethoscope,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Star,
  Award,
  Users,
  BarChart3
} from 'lucide-react';

// Tipos de datos para doctores
interface Doctor {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  especialidad: string;
  subespecialidad?: string;
  consultorio: string;
  estado: 'activo' | 'inactivo' | 'vacaciones';
  fechaRegistro: string;
  ultimaActividad: string;
  experiencia: number; // años
  calificacion: number; // 1-5
  pacientesAtendidos: number;
  citasHoy: number;
  horarioTrabajo: {
    inicio: string;
    fin: string;
    dias: string[];
  };
  credenciales: {
    universidad: string;
    colegiatura: string;
    certificaciones: string[];
  };
}

interface EstadisticasDoctor {
  totalDoctores: number;
  doctoresActivos: number;
  especialidades: number;
  citasHoy: number;
  promedioCalificacion: number;
  doctoresDisponibles: number;
}

export default function DoctoresPage() {
  const [sessionUser, setSessionUser] = useState<{ username: string; rol: string } | null>(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    especialidad: 'todos',
    estado: 'todos',
    consultorio: 'todos',
    calificacion: 'todos',
    experiencia: 'todos',
    disponibilidad: 'todos'
  });

  // Datos de ejemplo (en un proyecto real vendrían de una API)
  const [doctores] = useState<Doctor[]>([
    {
      id: '1',
      nombre: 'Juan Carlos',
      apellidos: 'Pérez González',
      email: 'juan.perez@clinica.com',
      telefono: '+51 987 654 321',
      especialidad: 'Cardiología',
      subespecialidad: 'Cardiología Intervencionista',
      consultorio: 'A-101',
      estado: 'activo',
      fechaRegistro: '2024-01-15',
      ultimaActividad: '2024-12-20',
      experiencia: 15,
      calificacion: 4.8,
      pacientesAtendidos: 1250,
      citasHoy: 8,
      horarioTrabajo: {
        inicio: '08:00',
        fin: '17:00',
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
      },
      credenciales: {
        universidad: 'Universidad Nacional Mayor de San Marcos',
        colegiatura: 'CPM-12345',
        certificaciones: ['Cardiología Intervencionista', 'Ecocardiografía']
      }
    },
    {
      id: '2',
      nombre: 'María Elena',
      apellidos: 'Rodríguez Silva',
      email: 'maria.rodriguez@clinica.com',
      telefono: '+51 987 654 322',
      especialidad: 'Neurología',
      consultorio: 'A-102',
      estado: 'activo',
      fechaRegistro: '2024-02-10',
      ultimaActividad: '2024-12-20',
      experiencia: 12,
      calificacion: 4.9,
      pacientesAtendidos: 980,
      citasHoy: 6,
      horarioTrabajo: {
        inicio: '09:00',
        fin: '18:00',
        dias: ['Lunes', 'Miércoles', 'Viernes', 'Sábado']
      },
      credenciales: {
        universidad: 'Universidad Peruana Cayetano Heredia',
        colegiatura: 'CPM-12346',
        certificaciones: ['Neurología Clínica', 'Electroencefalografía']
      }
    },
    {
      id: '3',
      nombre: 'Carlos Alberto',
      apellidos: 'López Martínez',
      email: 'carlos.lopez@clinica.com',
      telefono: '+51 987 654 323',
      especialidad: 'Pediatría',
      subespecialidad: 'Neonatología',
      consultorio: 'B-201',
      estado: 'vacaciones',
      fechaRegistro: '2024-03-05',
      ultimaActividad: '2024-12-15',
      experiencia: 8,
      calificacion: 4.7,
      pacientesAtendidos: 750,
      citasHoy: 0,
      horarioTrabajo: {
        inicio: '08:30',
        fin: '16:30',
        dias: ['Lunes', 'Martes', 'Jueves', 'Viernes']
      },
      credenciales: {
        universidad: 'Universidad Nacional de San Agustín',
        colegiatura: 'CPM-12347',
        certificaciones: ['Pediatría General', 'Neonatología']
      }
    },
    {
      id: '4',
      nombre: 'Ana Patricia',
      apellidos: 'García Torres',
      email: 'ana.garcia@clinica.com',
      telefono: '+51 987 654 324',
      especialidad: 'Ginecología',
      subespecialidad: 'Ginecología Oncológica',
      consultorio: 'B-202',
      estado: 'activo',
      fechaRegistro: '2024-04-20',
      ultimaActividad: '2024-12-20',
      experiencia: 10,
      calificacion: 4.6,
      pacientesAtendidos: 890,
      citasHoy: 7,
      horarioTrabajo: {
        inicio: '07:30',
        fin: '15:30',
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
      },
      credenciales: {
        universidad: 'Universidad Nacional de Trujillo',
        colegiatura: 'CPM-12348',
        certificaciones: ['Ginecología General', 'Oncología Ginecológica']
      }
    }
  ]);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
  }, []);

  // Filtrado de datos
  const doctoresFiltrados = useMemo(() => {
    return doctores.filter(doctor => {
      const coincideBusqueda = !filtros.busqueda || 
        doctor.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        doctor.apellidos.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        doctor.email.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        doctor.especialidad.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const coincideEspecialidad = filtros.especialidad === 'todos' || doctor.especialidad === filtros.especialidad;
      const coincideEstado = filtros.estado === 'todos' || doctor.estado === filtros.estado;
      const coincideConsultorio = filtros.consultorio === 'todos' || doctor.consultorio === filtros.consultorio;
      
      const coincideCalificacion = filtros.calificacion === 'todos' || 
        (filtros.calificacion === 'excelente' && doctor.calificacion >= 4.5) ||
        (filtros.calificacion === 'bueno' && doctor.calificacion >= 4.0 && doctor.calificacion < 4.5) ||
        (filtros.calificacion === 'regular' && doctor.calificacion < 4.0);

      const coincideExperiencia = filtros.experiencia === 'todos' ||
        (filtros.experiencia === 'senior' && doctor.experiencia >= 10) ||
        (filtros.experiencia === 'intermedio' && doctor.experiencia >= 5 && doctor.experiencia < 10) ||
        (filtros.experiencia === 'junior' && doctor.experiencia < 5);

      const coincideDisponibilidad = filtros.disponibilidad === 'todos' ||
        (filtros.disponibilidad === 'disponible' && doctor.estado === 'activo' && doctor.citasHoy < 8) ||
        (filtros.disponibilidad === 'ocupado' && doctor.estado === 'activo' && doctor.citasHoy >= 8) ||
        (filtros.disponibilidad === 'no_disponible' && doctor.estado !== 'activo');

      return coincideBusqueda && coincideEspecialidad && coincideEstado && coincideConsultorio && 
             coincideCalificacion && coincideExperiencia && coincideDisponibilidad;
    });
  }, [doctores, filtros]);

  // Estadísticas calculadas
  const estadisticas: EstadisticasDoctor = useMemo(() => {
    const totalDoctores = doctores.length;
    const doctoresActivos = doctores.filter(d => d.estado === 'activo').length;
    const especialidades = new Set(doctores.map(d => d.especialidad)).size;
    const citasHoy = doctores.reduce((sum, d) => sum + d.citasHoy, 0);
    const promedioCalificacion = doctores.reduce((sum, d) => sum + d.calificacion, 0) / totalDoctores;
    const doctoresDisponibles = doctores.filter(d => d.estado === 'activo' && d.citasHoy < 8).length;

    return {
      totalDoctores,
      doctoresActivos,
      especialidades,
      citasHoy,
      promedioCalificacion,
      doctoresDisponibles
    };
  }, [doctores]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      especialidad: 'todos',
      estado: 'todos',
      consultorio: 'todos',
      calificacion: 'todos',
      experiencia: 'todos',
      disponibilidad: 'todos'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'text-green-500 bg-green-500/10';
      case 'inactivo': return 'text-red-500 bg-red-500/10';
      case 'vacaciones': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCalificacionColor = (calificacion: number) => {
    if (calificacion >= 4.5) return 'text-green-500';
    if (calificacion >= 4.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Gestión de Doctores
        </h1>
        <p className="text-muted-foreground text-lg">
          Administra el personal médico de la clínica
        </p>
      </div>

      {/* Panel de Filtros */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avanzados
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Filtra y busca doctores específicos
              </CardDescription>
            </div>
            {/* Indicador de filtros activos */}
            {Object.values(filtros).some(valor => valor !== '' && valor !== 'todos') && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Filtros activos
                </Badge>
                <Button 
                  onClick={limpiarFiltros} 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda general */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Búsqueda</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, especialidad..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por especialidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Especialidad</label>
              <Select value={filtros.especialidad} onValueChange={(value) => handleFiltroChange('especialidad', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar especialidad">
                    {filtros.especialidad === 'todos' ? 'Todas las especialidades' :
                     filtros.especialidad === 'Cardiología' ? 'Cardiología' :
                     filtros.especialidad === 'Neurología' ? 'Neurología' :
                     filtros.especialidad === 'Pediatría' ? 'Pediatría' :
                     filtros.especialidad === 'Ginecología' ? 'Ginecología' :
                     'Seleccionar especialidad'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las especialidades</SelectItem>
                  <SelectItem value="Cardiología">Cardiología</SelectItem>
                  <SelectItem value="Neurología">Neurología</SelectItem>
                  <SelectItem value="Pediatría">Pediatría</SelectItem>
                  <SelectItem value="Ginecología">Ginecología</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado</label>
              <Select value={filtros.estado} onValueChange={(value) => handleFiltroChange('estado', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado">
                    {filtros.estado === 'todos' ? 'Todos los estados' :
                     filtros.estado === 'activo' ? 'Activo' :
                     filtros.estado === 'inactivo' ? 'Inactivo' :
                     filtros.estado === 'vacaciones' ? 'Vacaciones' :
                     'Seleccionar estado'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="vacaciones">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por consultorio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Consultorio</label>
              <Select value={filtros.consultorio} onValueChange={(value) => handleFiltroChange('consultorio', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar consultorio">
                    {filtros.consultorio === 'todos' ? 'Todos los consultorios' :
                     filtros.consultorio === 'A-101' ? 'A-101' :
                     filtros.consultorio === 'A-102' ? 'A-102' :
                     filtros.consultorio === 'B-201' ? 'B-201' :
                     filtros.consultorio === 'B-202' ? 'B-202' :
                     'Seleccionar consultorio'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los consultorios</SelectItem>
                  <SelectItem value="A-101">A-101</SelectItem>
                  <SelectItem value="A-102">A-102</SelectItem>
                  <SelectItem value="B-201">B-201</SelectItem>
                  <SelectItem value="B-202">B-202</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por calificación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Calificación</label>
              <Select value={filtros.calificacion} onValueChange={(value) => handleFiltroChange('calificacion', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar calificación">
                    {filtros.calificacion === 'todos' ? 'Todas las calificaciones' :
                     filtros.calificacion === 'excelente' ? 'Excelente (4.5+)' :
                     filtros.calificacion === 'bueno' ? 'Bueno (4.0-4.4)' :
                     filtros.calificacion === 'regular' ? 'Regular (<4.0)' :
                     'Seleccionar calificación'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las calificaciones</SelectItem>
                  <SelectItem value="excelente">Excelente (4.5+)</SelectItem>
                  <SelectItem value="bueno">Bueno (4.0-4.4)</SelectItem>
                  <SelectItem value="regular">Regular (&lt;4.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por experiencia */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Experiencia</label>
              <Select value={filtros.experiencia} onValueChange={(value) => handleFiltroChange('experiencia', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar experiencia">
                    {filtros.experiencia === 'todos' ? 'Toda la experiencia' :
                     filtros.experiencia === 'senior' ? 'Senior (10+ años)' :
                     filtros.experiencia === 'intermedio' ? 'Intermedio (5-9 años)' :
                     filtros.experiencia === 'junior' ? 'Junior (<5 años)' :
                     'Seleccionar experiencia'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Toda la experiencia</SelectItem>
                  <SelectItem value="senior">Senior (10+ años)</SelectItem>
                  <SelectItem value="intermedio">Intermedio (5-9 años)</SelectItem>
                  <SelectItem value="junior">Junior (&lt;5 años)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por disponibilidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Disponibilidad</label>
              <Select value={filtros.disponibilidad} onValueChange={(value) => handleFiltroChange('disponibilidad', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar disponibilidad">
                    {filtros.disponibilidad === 'todos' ? 'Toda la disponibilidad' :
                     filtros.disponibilidad === 'disponible' ? 'Disponible' :
                     filtros.disponibilidad === 'ocupado' ? 'Ocupado' :
                     filtros.disponibilidad === 'no_disponible' ? 'No disponible' :
                     'Seleccionar disponibilidad'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Toda la disponibilidad</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="ocupado">Ocupado</SelectItem>
                  <SelectItem value="no_disponible">No disponible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Acciones</label>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Doctor
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Filtros activos */}
        {Object.values(filtros).some(valor => valor !== '' && valor !== 'todos') && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Filtros aplicados:</span>
              {filtros.busqueda && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Búsqueda: &quot;{filtros.busqueda}&quot;
                </Badge>
              )}
              {filtros.especialidad !== 'todos' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Especialidad: {filtros.especialidad}
                </Badge>
              )}
              {filtros.estado !== 'todos' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Estado: {filtros.estado}
                </Badge>
              )}
              {filtros.consultorio !== 'todos' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Consultorio: {filtros.consultorio}
                </Badge>
              )}
              {filtros.calificacion !== 'todos' && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Calificación: {filtros.calificacion}
                </Badge>
              )}
              {filtros.experiencia !== 'todos' && (
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  Experiencia: {filtros.experiencia}
                </Badge>
              )}
              {filtros.disponibilidad !== 'todos' && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Disponibilidad: {filtros.disponibilidad}
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Doctores</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.totalDoctores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {estadisticas.doctoresActivos} activos
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Especialidades</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-200">
              <Stethoscope className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.especialidades}</div>
            <p className="text-xs text-muted-foreground mt-1">Disponibles</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Citas Hoy</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200">
              <Calendar className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.citasHoy}</div>
            <p className="text-xs text-muted-foreground mt-1">Programadas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Calificación</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-200">
              <Star className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{estadisticas.promedioCalificacion.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Promedio general</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Doctores */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Doctores del Sistema
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {doctoresFiltrados.length} doctores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctoresFiltrados.map((doctor) => (
              <div 
                key={doctor.id} 
                className="group flex items-center justify-between p-6 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/50 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-xl ${getEstadoColor(doctor.estado)} group-hover:bg-opacity-20 transition-colors duration-200`}>
                    <UserCheck className={`h-6 w-6 ${
                      doctor.estado === 'activo' ? 'text-green-500' : 
                      doctor.estado === 'inactivo' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Dr. {doctor.nombre} {doctor.apellidos}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getCalificacionColor(doctor.calificacion)}`} />
                        <span className={`text-sm font-medium ${getCalificacionColor(doctor.calificacion)}`}>
                          {doctor.calificacion}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-4 w-4" />
                          {doctor.especialidad}
                          {doctor.subespecialidad && ` - ${doctor.subespecialidad}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {doctor.consultorio}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {doctor.experiencia} años exp.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doctor.estado}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doctor.citasHoy} citas hoy
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doctor.pacientesAtendidos} pacientes
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doctor.horarioTrabajo.dias.join(', ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {doctoresFiltrados.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No se encontraron doctores</h3>
                <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Funciones principales para la gestión de doctores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90"
            >
              <div className="p-2 rounded-lg bg-primary-foreground/20">
                <Plus className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground">Registrar Doctor</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Gestionar Horarios</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Ver Estadísticas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}