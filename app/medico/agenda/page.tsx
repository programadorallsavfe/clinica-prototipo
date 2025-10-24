'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, Columna } from '@/components/data-table';
import { 
  Calendar, Clock, User, Stethoscope, Eye, Edit, CheckCircle, 
  XCircle, AlertTriangle, RefreshCw, Filter, Search, Plus,
  Activity, TrendingUp, Users, HeartPulse
} from 'lucide-react';

// Tipo para las citas médicas
interface CitaMedica {
  id: string;
  paciente: string;
  documento: string;
  especialidad: string;
  horaInicio: string;
  horaFin: string;
  estado: 'programada' | 'en_curso' | 'atendida' | 'cancelada';
  motivo: string;
  telefono: string;
  observaciones?: string;
}

// Mock data para la agenda médica
const citasMock = [
  {
    id: '1',
    paciente: 'María García López',
    documento: '12345678',
    especialidad: 'Ginecología',
    horaInicio: '09:00',
    horaFin: '09:30',
    estado: 'programada',
    motivo: 'Control prenatal',
    telefono: '987654321',
    observaciones: 'Primera consulta'
  },
  {
    id: '2',
    paciente: 'Ana Rodríguez Silva',
    documento: '87654321',
    especialidad: 'Ginecología',
    horaInicio: '09:30',
    horaFin: '10:00',
    estado: 'en_curso',
    motivo: 'Consulta por dolor pélvico',
    telefono: '912345678',
    observaciones: 'Paciente con antecedentes'
  },
  {
    id: '3',
    paciente: 'Carmen López Torres',
    documento: '23456789',
    especialidad: 'Ginecología',
    horaInicio: '10:00',
    horaFin: '10:30',
    estado: 'atendida',
    motivo: 'PAP y colposcopia',
    telefono: '923456789',
    observaciones: 'Resultados pendientes'
  },
  {
    id: '4',
    paciente: 'Elena Fernández Ruiz',
    documento: '34567890',
    especialidad: 'Ginecología',
    horaInicio: '10:30',
    horaFin: '11:00',
    estado: 'programada',
    motivo: 'Control post-parto',
    telefono: '934567890',
    observaciones: '6 semanas post-parto'
  },
  {
    id: '5',
    paciente: 'Isabel Morales Castro',
    documento: '45678901',
    especialidad: 'Ginecología',
    horaInicio: '11:00',
    horaFin: '11:30',
    estado: 'cancelada',
    motivo: 'Consulta de fertilidad',
    telefono: '945678901',
    observaciones: 'Cancelada por el paciente'
  },
  {
    id: '6',
    paciente: 'Patricia Ruiz Herrera',
    documento: '56789012',
    especialidad: 'Ginecología',
    horaInicio: '11:30',
    horaFin: '12:00',
    estado: 'programada',
    motivo: 'Ecografía obstétrica',
    telefono: '956789012',
    observaciones: '20 semanas de gestación'
  },
  {
    id: '7',
    paciente: 'Laura Hernández Vega',
    documento: '67890123',
    especialidad: 'Ginecología',
    horaInicio: '15:00',
    horaFin: '15:30',
    estado: 'programada',
    motivo: 'Consulta por irregularidad menstrual',
    telefono: '967890123',
    observaciones: 'Última menstruación hace 2 meses'
  },
  {
    id: '8',
    paciente: 'Sofia Mendoza Díaz',
    documento: '78901234',
    especialidad: 'Ginecología',
    horaInicio: '15:30',
    horaFin: '16:00',
    estado: 'programada',
    motivo: 'Control de DIU',
    telefono: '978901234',
    observaciones: 'DIU colocado hace 6 meses'
  }
];

const estadisticasMock = {
  totalCitas: 8,
  programadas: 5,
  enCurso: 1,
  atendidas: 1,
  canceladas: 1,
  tiempoPromedio: 25,
  pacientesAtendidos: 1,
  ingresosHoy: 320
};

export default function AgendaMedicaPage() {
  const [citas, setCitas] = useState(citasMock);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaMedica | null>(null);
  const [showDetalleCita, setShowDetalleCita] = useState(false);

  // Filtrar citas
  const citasFiltradas = citas.filter(cita => {
    const cumpleEstado = filtroEstado === 'todos' || cita.estado === filtroEstado;
    
    if (!cumpleEstado) return false;
    
    if (filtroBusqueda) {
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        cita.paciente.toLowerCase().includes(textoBusqueda) ||
        cita.documento.includes(textoBusqueda) ||
        cita.motivo.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  const actualizarEstadoCita = (citaId: string, nuevoEstado: string) => {
    setCitas(prev => prev.map(cita => 
      cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
    ));
  };

  const columnas: Columna<CitaMedica>[] = [
    {
      key: 'horaInicio',
      titulo: 'Hora',
      sortable: true,
      width: '100px',
      render: (cita: CitaMedica) => (
        <div className="text-sm">
          <div className="font-medium">{cita.horaInicio}</div>
          <div className="text-xs text-muted-foreground">{cita.horaFin}</div>
        </div>
      ),
    },
    {
      key: 'paciente',
      titulo: 'Paciente',
      render: (cita: CitaMedica) => (
        <div>
          <div className="font-medium">{cita.paciente}</div>
          <div className="text-xs text-muted-foreground">{cita.documento}</div>
        </div>
      ),
    },
    {
      key: 'especialidad',
      titulo: 'Especialidad',
      render: (cita: CitaMedica) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Stethoscope className="h-3 w-3 mr-1" />
          {cita.especialidad}
        </Badge>
      ),
    },
    {
      key: 'motivo',
      titulo: 'Motivo',
      render: (cita: CitaMedica) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium truncate">{cita.motivo}</p>
          {cita.observaciones && (
            <p className="text-xs text-muted-foreground truncate">{cita.observaciones}</p>
          )}
        </div>
      ),
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (cita: any) => {
        const colores: Record<string, string> = {
          programada: 'bg-blue-100 text-blue-800',
          en_curso: 'bg-orange-100 text-orange-800',
          atendida: 'bg-green-100 text-green-800',
          cancelada: 'bg-red-100 text-red-800',
        };
        return <Badge className={colores[cita.estado]}>{cita.estado.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (cita: CitaMedica) => (
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
          {cita.estado === 'programada' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => actualizarEstadoCita(cita.id, 'en_curso')}
            >
              <Clock className="h-3 w-3" />
            </Button>
          )}
          {cita.estado === 'en_curso' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => actualizarEstadoCita(cita.id, 'atendida')}
            >
              <CheckCircle className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda Médica</h1>
          <p className="text-muted-foreground">
            Gestión de citas y agenda del día
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Simular actualización
              setCitas([...citasMock]);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Badge variant="outline" className="text-primary border-primary">
            <Activity className="h-3 w-3 mr-1" />
            Dr. Carlos Sánchez
          </Badge>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Citas</p>
                <p className="text-2xl font-bold">{estadisticasMock.totalCitas}</p>
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
                <p className="text-2xl font-bold text-blue-600">{estadisticasMock.programadas}</p>
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
                <p className="text-2xl font-bold text-orange-600">{estadisticasMock.enCurso}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atendidas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticasMock.atendidas}</p>
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
                <p className="text-2xl font-bold text-red-600">{estadisticasMock.canceladas}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Prom.</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticasMock.tiempoPromedio} min</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pacientes</p>
                <p className="text-2xl font-bold text-indigo-600">{estadisticasMock.pacientesAtendidos}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-emerald-600">S/ {estadisticasMock.ingresosHoy}</p>
              </div>
              <HeartPulse className="h-8 w-8 text-emerald-600" />
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
                  <SelectItem value="programada">Programadas</SelectItem>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="atendida">Atendidas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, documento o motivo..."
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

      {/* Tabla de Citas */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda del Día</CardTitle>
          <CardDescription>
            {citasFiltradas.length} cita{citasFiltradas.length !== 1 ? 's' : ''} encontrada{citasFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={citasFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={10}
            keyExtractor={(cita: Record<string, unknown>) => cita.id as string}
          />
        </CardContent>
      </Card>

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
                      citaSeleccionada.estado === 'en_curso' ? 'bg-orange-100 text-orange-800' :
                      citaSeleccionada.estado === 'atendida' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {citaSeleccionada.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Paciente</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.paciente}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Documento</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.documento}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Especialidad</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.especialidad}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.telefono}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hora Inicio</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.horaInicio}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hora Fin</Label>
                  <p className="text-sm text-muted-foreground">{citaSeleccionada.horaFin}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Motivo de Consulta</Label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-accent/50 rounded-lg">
                  {citaSeleccionada.motivo}
                </p>
              </div>
              {citaSeleccionada.observaciones && (
                <div>
                  <Label className="text-sm font-medium">Observaciones</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-accent/50 rounded-lg">
                    {citaSeleccionada.observaciones}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDetalleCita(false)}>
                  Cerrar
                </Button>
                {citaSeleccionada.estado === 'programada' && (
                  <Button onClick={() => {
                    actualizarEstadoCita(citaSeleccionada.id, 'en_curso');
                    setShowDetalleCita(false);
                  }}>
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Atención
                  </Button>
                )}
                {citaSeleccionada.estado === 'en_curso' && (
                  <Button onClick={() => {
                    actualizarEstadoCita(citaSeleccionada.id, 'atendida');
                    setShowDetalleCita(false);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Atención
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
