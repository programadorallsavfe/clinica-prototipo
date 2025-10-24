'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, AlertTriangle, CheckCircle, XCircle, Clock, 
  User, Search, Filter, Download, Plus, Edit, Trash2,
  Calendar, Users, TrendingUp, TrendingDown, Eye
} from 'lucide-react';

interface Personal {
  id: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  estado: string;
}

interface Incidencia {
  id: string;
  personalId: string;
  tipo: 'memorandum' | 'amonestacion' | 'felicitacion' | 'otro';
  titulo: string;
  descripcion: string;
  fecha: string;
  severidad: 'leve' | 'moderada' | 'grave';
  estado: 'activa' | 'resuelta' | 'archivada';
  fechaCreacion: string;
  creadoPor: string;
}

interface IncidenciasTableProps {
  personal: Personal[];
  incidencias: Incidencia[];
}

// Función para generar incidencias mock
const generateIncidenciasMock = (personal: Personal[]): Incidencia[] => {
  const incidencias: Incidencia[] = [];
  const tipos = ['memorandum', 'amonestacion', 'felicitacion', 'otro'];
  const severidades = ['leve', 'moderada', 'grave'];
  const estados = ['activa', 'resuelta', 'archivada'];
  
  const titulos = {
    memorandum: [
      'Memorándum por tardanza reiterada',
      'Memorándum por incumplimiento de horario',
      'Memorándum por falta de uniforme',
      'Memorándum por uso inadecuado de equipos'
    ],
    amonestacion: [
      'Amonestación por comportamiento inadecuado',
      'Amonestación por incumplimiento de protocolos',
      'Amonestación por falta de respeto a superiores',
      'Amonestación por negligencia en el trabajo'
    ],
    felicitacion: [
      'Felicitación por excelente desempeño',
      'Felicitación por iniciativa y proactividad',
      'Felicitación por trabajo en equipo',
      'Felicitación por cumplimiento ejemplar'
    ],
    otro: [
      'Notificación por cambio de horario',
      'Comunicado sobre nuevas políticas',
      'Informe de capacitación completada',
      'Recordatorio sobre procedimientos'
    ]
  };

  const descripciones = {
    memorandum: [
      'Se ha observado un patrón de tardanzas que afecta el funcionamiento del servicio.',
      'El personal ha incumplido reiteradamente con el horario establecido.',
      'Se requiere el uso correcto del uniforme según las normas establecidas.',
      'Se debe hacer uso adecuado de los equipos médicos para evitar daños.'
    ],
    amonestacion: [
      'Comportamiento inadecuado hacia pacientes y compañeros de trabajo.',
      'Incumplimiento de protocolos de seguridad establecidos.',
      'Falta de respeto hacia superiores jerárquicos.',
      'Negligencia en el cumplimiento de responsabilidades asignadas.'
    ],
    felicitacion: [
      'Excelente desempeño en la atención al paciente durante el mes.',
      'Demostración de iniciativa y proactividad en las tareas asignadas.',
      'Trabajo en equipo ejemplar que ha mejorado la eficiencia del servicio.',
      'Cumplimiento ejemplar de todas las responsabilidades asignadas.'
    ],
    otro: [
      'Cambio de horario de trabajo a partir de la próxima semana.',
      'Nuevas políticas de seguridad que deben ser implementadas.',
      'Capacitación en nuevos procedimientos completada exitosamente.',
      'Recordatorio sobre la importancia de seguir los procedimientos establecidos.'
    ]
  };

  // Generar 15-20 incidencias mock
  for (let i = 0; i < 18; i++) {
    const personalAleatorio = personal[Math.floor(Math.random() * personal.length)];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)] as Incidencia['tipo'];
    const severidad = severidades[Math.floor(Math.random() * severidades.length)] as Incidencia['severidad'];
    const estado = estados[Math.floor(Math.random() * estados.length)] as Incidencia['estado'];
    
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - Math.floor(Math.random() * 90)); // Últimos 90 días
    
    const titulo = titulos[tipo][Math.floor(Math.random() * titulos[tipo].length)];
    const descripcion = descripciones[tipo][Math.floor(Math.random() * descripciones[tipo].length)];
    
    incidencias.push({
      id: `inc-${i + 1}`,
      personalId: personalAleatorio.id,
      tipo,
      titulo,
      descripcion,
      fecha: fecha.toISOString().split('T')[0],
      severidad,
      estado,
      fechaCreacion: fecha.toISOString(),
      creadoPor: 'admin'
    });
  }
  
  return incidencias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

export default function IncidenciasTable({ personal, incidencias }: IncidenciasTableProps) {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroPersonal, setFiltroPersonal] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showNuevaIncidencia, setShowNuevaIncidencia] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia | null>(null);

  // Generar incidencias mock
  const incidenciasMock = useMemo(() => {
    return generateIncidenciasMock(personal);
  }, [personal]);

  // Filtrar incidencias
  const incidenciasFiltradas = incidenciasMock.filter(incidencia => {
    const personalIncidencia = personal.find(p => p.id === incidencia.personalId);
    
    const cumpleBusqueda = busqueda === '' || 
      incidencia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      incidencia.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (personalIncidencia && (
        personalIncidencia.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
        personalIncidencia.apellidos.toLowerCase().includes(busqueda.toLowerCase())
      ));
    
    const cumpleTipo = filtroTipo === 'todos' || incidencia.tipo === filtroTipo;
    const cumpleSeveridad = filtroSeveridad === 'todos' || incidencia.severidad === filtroSeveridad;
    const cumpleEstado = filtroEstado === 'todos' || incidencia.estado === filtroEstado;
    const cumplePersonal = filtroPersonal === 'todos' || incidencia.personalId === filtroPersonal;
    
    return cumpleBusqueda && cumpleTipo && cumpleSeveridad && cumpleEstado && cumplePersonal;
  });

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = incidenciasMock.length;
    const activas = incidenciasMock.filter(i => i.estado === 'activa').length;
    const resueltas = incidenciasMock.filter(i => i.estado === 'resuelta').length;
    const graves = incidenciasMock.filter(i => i.severidad === 'grave').length;
    const memorandums = incidenciasMock.filter(i => i.tipo === 'memorandum').length;
    const amonestaciones = incidenciasMock.filter(i => i.tipo === 'amonestacion').length;
    const felicitaciones = incidenciasMock.filter(i => i.tipo === 'felicitacion').length;
    
    return {
      total,
      activas,
      resueltas,
      graves,
      memorandums,
      amonestaciones,
      felicitaciones
    };
  }, [incidenciasMock]);

  const getTipoBadge = (tipo: Incidencia['tipo']) => {
    const configs = {
      memorandum: { 
        variant: 'secondary' as const, 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        icon: <FileText className="h-3 w-3" />
      },
      amonestacion: { 
        variant: 'secondary' as const, 
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: <AlertTriangle className="h-3 w-3" />
      },
      felicitacion: { 
        variant: 'secondary' as const, 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: <CheckCircle className="h-3 w-3" />
      },
      otro: { 
        variant: 'secondary' as const, 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        icon: <FileText className="h-3 w-3" />
      },
    };
    
    const config = configs[tipo];
    return (
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  const getSeveridadBadge = (severidad: Incidencia['severidad']) => {
    const configs = {
      leve: { 
        variant: 'secondary' as const, 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      },
      moderada: { 
        variant: 'secondary' as const, 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
      },
      grave: { 
        variant: 'secondary' as const, 
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
      },
    };
    
    const config = configs[severidad];
    return (
      <Badge variant={config.variant} className={config.className}>
        {severidad.charAt(0).toUpperCase() + severidad.slice(1)}
      </Badge>
    );
  };

  const getEstadoBadge = (estado: Incidencia['estado']) => {
    const configs = {
      activa: { 
        variant: 'secondary' as const, 
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' 
      },
      resuelta: { 
        variant: 'secondary' as const, 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
      },
      archivada: { 
        variant: 'secondary' as const, 
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' 
      },
    };
    
    const config = configs[estado];
    return (
      <Badge variant={config.variant} className={config.className}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getPersonalNombre = (personalId: string) => {
    const persona = personal.find(p => p.id === personalId);
    return persona ? `${persona.nombres} ${persona.apellidos}` : 'Personal no encontrado';
  };

  const getPersonalCargo = (personalId: string) => {
    const persona = personal.find(p => p.id === personalId);
    return persona ? persona.cargo : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gestión de Incidencias y Memorándums
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Registro y seguimiento de incidencias, memorándums y felicitaciones del personal
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => setShowNuevaIncidencia(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Incidencia
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.total}</p>
                <p className="text-sm text-muted-foreground">Total Incidencias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.activas}</p>
                <p className="text-sm text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.resueltas}</p>
                <p className="text-sm text-muted-foreground">Resueltas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{estadisticas.graves}</p>
                <p className="text-sm text-muted-foreground">Graves</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="busqueda">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Título, descripción o personal..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="memorandum">Memorándum</SelectItem>
                  <SelectItem value="amonestacion">Amonestación</SelectItem>
                  <SelectItem value="felicitacion">Felicitación</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="severidad">Severidad</Label>
              <Select value={filtroSeveridad} onValueChange={setFiltroSeveridad}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las severidades</SelectItem>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="grave">Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="resuelta">Resuelta</SelectItem>
                  <SelectItem value="archivada">Archivada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="personal">Personal</Label>
              <Select value={filtroPersonal} onValueChange={setFiltroPersonal}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todo el personal</SelectItem>
                  {personal.map(persona => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.nombres} {persona.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Incidencias */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Incidencias</CardTitle>
          <p className="text-sm text-muted-foreground">
            {incidenciasFiltradas.length} de {incidenciasMock.length} incidencias encontradas
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidenciasFiltradas.map(incidencia => (
              <Card key={incidencia.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{incidencia.titulo}</h3>
                        {getTipoBadge(incidencia.tipo)}
                        {getSeveridadBadge(incidencia.severidad)}
                        {getEstadoBadge(incidencia.estado)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{incidencia.descripcion}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{getPersonalNombre(incidencia.personalId)}</span>
                          <span className="capitalize">({getPersonalCargo(incidencia.personalId)})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(incidencia.fecha).toLocaleDateString('es-PE')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIncidenciaSeleccionada(incidencia)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIncidenciaSeleccionada(incidencia);
                          // Aquí se podría abrir un modal de edición
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {incidenciasFiltradas.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron incidencias</h3>
                <p className="text-muted-foreground mb-4">
                  No hay incidencias que coincidan con los filtros seleccionados.
                </p>
                <Button onClick={() => setShowNuevaIncidencia(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nueva Incidencia
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Nueva Incidencia */}
      {showNuevaIncidencia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nueva Incidencia</CardTitle>
              <p className="text-sm text-muted-foreground">
                Registrar una nueva incidencia, memorándum o felicitación
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="memorandum">Memorándum</SelectItem>
                        <SelectItem value="amonestacion">Amonestación</SelectItem>
                        <SelectItem value="felicitacion">Felicitación</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="severidad">Severidad</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar severidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leve">Leve</SelectItem>
                        <SelectItem value="moderada">Moderada</SelectItem>
                        <SelectItem value="grave">Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="personal">Personal</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar personal" />
                      </SelectTrigger>
                      <SelectContent>
                        {personal.map(persona => (
                          <SelectItem key={persona.id} value={persona.id}>
                            {persona.nombres} {persona.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input id="fecha" type="date" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" placeholder="Título de la incidencia" />
                </div>
                
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea 
                    id="descripcion" 
                    placeholder="Descripción detallada de la incidencia..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowNuevaIncidencia(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Crear Incidencia
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Ver Incidencia */}
      {incidenciaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getTipoBadge(incidenciaSeleccionada.tipo)}
                {incidenciaSeleccionada.titulo}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{getSeveridadBadge(incidenciaSeleccionada.severidad)}</span>
                <span>{getEstadoBadge(incidenciaSeleccionada.estado)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Descripción</Label>
                  <p className="text-sm text-muted-foreground mt-1">{incidenciaSeleccionada.descripcion}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Personal</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getPersonalNombre(incidenciaSeleccionada.personalId)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Cargo</Label>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">
                      {getPersonalCargo(incidenciaSeleccionada.personalId)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Fecha</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(incidenciaSeleccionada.fecha).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Fecha de Creación</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(incidenciaSeleccionada.fechaCreacion).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIncidenciaSeleccionada(null)}>
                    Cerrar
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
