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
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Shield, 
  Database, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  RefreshCw
} from 'lucide-react';

// Tipos de datos para el sistema
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'medico' | 'recepcionista' | 'farmacia' | 'paciente' | 'administrador';
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaRegistro: string;
  ultimaActividad: string;
  especialidad?: string;
  consultorio?: string;
}

interface Cita {
  id: string;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'programada' | 'en_progreso' | 'completada' | 'cancelada';
  consultorio: string;
}

interface Reporte {
  id: string;
  tipo: 'usuarios' | 'citas' | 'financiero' | 'inventario';
  titulo: string;
  fechaGeneracion: string;
  estado: 'generado' | 'procesando' | 'error';
  descripcion: string;
}

export default function AdministradorPage() {
  const [sessionUser, setSessionUser] = useState<{ username: string; rol: string } | null>(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    rol: 'todos',
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    especialidad: 'todos',
    consultorio: 'todos',
    verificacion: 'todos'
  });

  // Datos de ejemplo (en un proyecto real vendrían de una API)
  const [usuarios] = useState<Usuario[]>([
    { id: '1', nombre: 'Dr. Juan Pérez', email: 'juan.perez@clinica.com', rol: 'medico', estado: 'activo', fechaRegistro: '2024-01-15', ultimaActividad: '2024-12-20', especialidad: 'Cardiología', consultorio: 'A-101' },
    { id: '2', nombre: 'María González', email: 'maria.gonzalez@clinica.com', rol: 'recepcionista', estado: 'activo', fechaRegistro: '2024-02-10', ultimaActividad: '2024-12-20' },
    { id: '3', nombre: 'Carlos López', email: 'carlos.lopez@clinica.com', rol: 'farmacia', estado: 'activo', fechaRegistro: '2024-03-05', ultimaActividad: '2024-12-19' },
    { id: '4', nombre: 'Ana Martínez', email: 'ana.martinez@clinica.com', rol: 'paciente', estado: 'activo', fechaRegistro: '2024-04-20', ultimaActividad: '2024-12-18' },
    { id: '5', nombre: 'Dr. Luis Rodríguez', email: 'luis.rodriguez@clinica.com', rol: 'medico', estado: 'inactivo', fechaRegistro: '2024-01-30', ultimaActividad: '2024-12-15', especialidad: 'Neurología', consultorio: 'A-102' },
  ]);

  const [citas] = useState<Cita[]>([
    { id: '1', paciente: 'Ana Martínez', medico: 'Dr. Juan Pérez', especialidad: 'Cardiología', fecha: '2024-12-21', hora: '09:00', estado: 'programada', consultorio: 'A-101' },
    { id: '2', paciente: 'Pedro García', medico: 'Dr. Luis Rodríguez', especialidad: 'Neurología', fecha: '2024-12-21', hora: '10:30', estado: 'en_progreso', consultorio: 'A-102' },
    { id: '3', paciente: 'Laura Sánchez', medico: 'Dr. Juan Pérez', especialidad: 'Cardiología', fecha: '2024-12-20', hora: '14:00', estado: 'completada', consultorio: 'A-101' },
  ]);

  const [reportes] = useState<Reporte[]>([
    { id: '1', tipo: 'usuarios', titulo: 'Reporte de Usuarios Activos', fechaGeneracion: '2024-12-20', estado: 'generado', descripcion: 'Listado completo de usuarios activos en el sistema' },
    { id: '2', tipo: 'citas', titulo: 'Citas del Mes', fechaGeneracion: '2024-12-19', estado: 'procesando', descripcion: 'Estadísticas de citas programadas y completadas' },
    { id: '3', tipo: 'financiero', titulo: 'Ingresos Mensuales', fechaGeneracion: '2024-12-18', estado: 'generado', descripcion: 'Resumen de ingresos y gastos del mes' },
  ]);

  useEffect(() => {
    const session = getSession();
    setSessionUser(session);
  }, []);

  // Filtrado de datos
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      const coincideBusqueda = !filtros.busqueda || 
        usuario.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const coincideRol = filtros.rol === 'todos' || usuario.rol === filtros.rol;
      const coincideEstado = filtros.estado === 'todos' || usuario.estado === filtros.estado;
      
      const coincideFecha = !filtros.fechaDesde || !filtros.fechaHasta || 
        (usuario.fechaRegistro >= filtros.fechaDesde && usuario.fechaRegistro <= filtros.fechaHasta);
      
      const coincideEspecialidad = filtros.especialidad === 'todos' || usuario.especialidad === filtros.especialidad;
      const coincideConsultorio = filtros.consultorio === 'todos' || usuario.consultorio === filtros.consultorio;

      return coincideBusqueda && coincideRol && coincideEstado && coincideFecha && coincideEspecialidad && coincideConsultorio;
    });
  }, [usuarios, filtros]);

  const citasFiltradas = useMemo(() => {
    return citas.filter(cita => {
      const coincideBusqueda = !filtros.busqueda || 
        cita.paciente.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        cita.medico.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const coincideEspecialidad = filtros.especialidad === 'todos' || cita.especialidad === filtros.especialidad;
      const coincideConsultorio = filtros.consultorio === 'todos' || cita.consultorio === filtros.consultorio;
      
      const coincideFecha = !filtros.fechaDesde || !filtros.fechaHasta || 
        (cita.fecha >= filtros.fechaDesde && cita.fecha <= filtros.fechaHasta);

      return coincideBusqueda && coincideEspecialidad && coincideConsultorio && coincideFecha;
    });
  }, [citas, filtros]);

  const reportesFiltrados = useMemo(() => {
    return reportes.filter(reporte => {
      const coincideBusqueda = !filtros.busqueda || 
        reporte.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        reporte.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const coincideTipo = filtros.rol === 'todos' || reporte.tipo === filtros.rol;
      const coincideEstado = filtros.estado === 'todos' || reporte.estado === filtros.estado;

      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }, [reportes, filtros]);

  // Estadísticas calculadas
  const estadisticas = useMemo(() => {
    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;
    const totalCitas = citas.length;
    const citasHoy = citas.filter(c => c.fecha === new Date().toISOString().split('T')[0]).length;
    const reportesGenerados = reportes.filter(r => r.estado === 'generado').length;
    const disponibilidadSistema = 99.9;

    return {
      totalUsuarios,
      usuariosActivos,
      totalCitas,
      citasHoy,
      reportesGenerados,
      disponibilidadSistema
    };
  }, [usuarios, citas, reportes]);

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      rol: 'todos',
      estado: 'todos',
      fechaDesde: '',
      fechaHasta: '',
      especialidad: 'todos',
      consultorio: 'todos',
      verificacion: 'todos'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground text-lg">
          Configuración y control del sistema
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
                Filtra y busca información específica del sistema
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
                  placeholder="Buscar por nombre, email..."
                  value={filtros.busqueda}
                  onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por rol */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rol</label>
              <Select value={filtros.rol} onValueChange={(value) => handleFiltroChange('rol', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar rol">
                    {filtros.rol === 'todos' ? 'Todos los roles' :
                     filtros.rol === 'medico' ? 'Médicos' :
                     filtros.rol === 'recepcionista' ? 'Recepcionistas' :
                     filtros.rol === 'farmacia' ? 'Farmacia' :
                     filtros.rol === 'paciente' ? 'Pacientes' :
                     filtros.rol === 'administrador' ? 'Administradores' :
                     'Seleccionar rol'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="medico">Médicos</SelectItem>
                  <SelectItem value="recepcionista">Recepcionistas</SelectItem>
                  <SelectItem value="farmacia">Farmacia</SelectItem>
                  <SelectItem value="paciente">Pacientes</SelectItem>
                  <SelectItem value="administrador">Administradores</SelectItem>
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
                     filtros.estado === 'pendiente' ? 'Pendiente' :
                     'Seleccionar estado'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
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

            {/* Filtro por verificación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Verificación</label>
              <Select value={filtros.verificacion} onValueChange={(value) => handleFiltroChange('verificacion', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar verificación">
                    {filtros.verificacion === 'todos' ? 'Todos' :
                     filtros.verificacion === 'verificado' ? 'Verificado' :
                     filtros.verificacion === 'no_verificado' ? 'No verificado' :
                     'Seleccionar verificación'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="verificado">Verificado</SelectItem>
                  <SelectItem value="no_verificado">No verificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por fecha desde */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fecha Desde</label>
              <Input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
              />
            </div>

            {/* Filtro por fecha hasta */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fecha Hasta</label>
              <Input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
              />
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground opacity-0">Acciones</label>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
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
                  Búsqueda: "{filtros.busqueda}"
                </Badge>
              )}
              {filtros.rol !== 'todos' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Rol: {filtros.rol === 'medico' ? 'Médicos' : 
                        filtros.rol === 'recepcionista' ? 'Recepcionistas' :
                        filtros.rol === 'farmacia' ? 'Farmacia' :
                        filtros.rol === 'paciente' ? 'Pacientes' :
                        filtros.rol === 'administrador' ? 'Administradores' : filtros.rol}
                </Badge>
              )}
              {filtros.estado !== 'todos' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Estado: {filtros.estado}
                </Badge>
              )}
              {filtros.especialidad !== 'todos' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Especialidad: {filtros.especialidad}
                </Badge>
              )}
              {filtros.consultorio !== 'todos' && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Consultorio: {filtros.consultorio}
                </Badge>
              )}
              {filtros.verificacion !== 'todos' && (
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  Verificación: {filtros.verificacion === 'verificado' ? 'Verificado' : 'No verificado'}
                </Badge>
              )}
              {filtros.fechaDesde && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Desde: {filtros.fechaDesde}
                </Badge>
              )}
              {filtros.fechaHasta && (
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  Hasta: {filtros.fechaHasta}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {estadisticas.usuariosActivos} activos
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Citas Hoy</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-200">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.citasHoy}</div>
            <p className="text-xs text-muted-foreground mt-1">Programadas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reportes</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-200">
              <BarChart3 className="h-4 w-4 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{estadisticas.reportesGenerados}</div>
            <p className="text-xs text-muted-foreground mt-1">Generados</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sistema</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-200">
              <Database className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{estadisticas.disponibilidadSistema}%</div>
            <p className="text-xs text-muted-foreground mt-1">Disponibilidad</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="usuarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios ({usuariosFiltrados.length})
          </TabsTrigger>
          <TabsTrigger value="citas" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Citas ({citasFiltradas.length})
          </TabsTrigger>
          <TabsTrigger value="reportes" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reportes ({reportesFiltrados.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab de Usuarios */}
        <TabsContent value="usuarios" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuarios del Sistema
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {usuariosFiltrados.length} usuarios encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usuariosFiltrados.map((usuario) => (
                  <div 
                    key={usuario.id} 
                    className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        usuario.estado === 'activo' ? 'bg-green-500/10' : 
                        usuario.estado === 'inactivo' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                      } group-hover:bg-opacity-20 transition-colors duration-200`}>
                        <Users className={`h-5 w-5 ${
                          usuario.estado === 'activo' ? 'text-green-500' : 
                          usuario.estado === 'inactivo' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{usuario.nombre}</div>
                        <div className="text-sm text-muted-foreground">{usuario.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {usuario.rol}
                          </Badge>
                          <Badge 
                            variant={usuario.estado === 'activo' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {usuario.estado}
                          </Badge>
                          {usuario.especialidad && (
                            <Badge variant="outline" className="text-xs">
                              {usuario.especialidad}
                            </Badge>
                          )}
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
                    </div>
                  </div>
                ))}
                {usuariosFiltrados.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron usuarios con los filtros aplicados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Citas */}
        <TabsContent value="citas" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Citas Médicas
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {citasFiltradas.length} citas encontradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {citasFiltradas.map((cita) => (
                  <div 
                    key={cita.id} 
                    className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        cita.estado === 'completada' ? 'bg-green-500/10' : 
                        cita.estado === 'en_progreso' ? 'bg-blue-500/10' : 
                        cita.estado === 'cancelada' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                      } group-hover:bg-opacity-20 transition-colors duration-200`}>
                        <Calendar className={`h-5 w-5 ${
                          cita.estado === 'completada' ? 'text-green-500' : 
                          cita.estado === 'en_progreso' ? 'text-blue-500' : 
                          cita.estado === 'cancelada' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{cita.paciente}</div>
                        <div className="text-sm text-muted-foreground">
                          {cita.medico} • {cita.especialidad}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {cita.fecha} {cita.hora}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {cita.consultorio}
                          </Badge>
                          <Badge 
                            variant={cita.estado === 'completada' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {cita.estado.replace('_', ' ')}
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
                    </div>
                  </div>
                ))}
                {citasFiltradas.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron citas con los filtros aplicados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Reportes */}
        <TabsContent value="reportes" className="space-y-4">
          <Card className="shadow-lg border-border/50">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reportes del Sistema
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {reportesFiltrados.length} reportes encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportesFiltrados.map((reporte) => (
                  <div 
                    key={reporte.id} 
                    className="group flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-background/50 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        reporte.estado === 'generado' ? 'bg-green-500/10' : 
                        reporte.estado === 'procesando' ? 'bg-blue-500/10' : 'bg-red-500/10'
                      } group-hover:bg-opacity-20 transition-colors duration-200`}>
                        <BarChart3 className={`h-5 w-5 ${
                          reporte.estado === 'generado' ? 'text-green-500' : 
                          reporte.estado === 'procesando' ? 'text-blue-500' : 'text-red-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{reporte.titulo}</div>
                        <div className="text-sm text-muted-foreground">{reporte.descripcion}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {reporte.tipo}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {reporte.fechaGeneracion}
                          </Badge>
                          <Badge 
                            variant={reporte.estado === 'generado' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {reporte.estado}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {reportesFiltrados.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron reportes con los filtros aplicados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Acciones Rápidas */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Funciones principales del panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-primary hover:bg-primary/90"
            >
              <div className="p-2 rounded-lg bg-primary-foreground/20">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground">Gestionar Usuarios</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Configurar Clínica</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col space-y-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-foreground">Ver Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
