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
  Users, Search, Filter, Eye, Clock, Calendar, User, Stethoscope, 
  HeartPulse, Phone, Mail, MapPin, AlertTriangle, CheckCircle, 
  XCircle, Activity, RefreshCw, Plus, Bell, Timer, TrendingUp
} from 'lucide-react';

// Tipo para los pacientes del día
interface PacienteDia {
  id: string;
  pacienteId: string;
  nombres: string;
  apellidos: string;
  documento: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  edad: number;
  fechaCita: string;
  horaCita: string;
  especialidad: string;
  motivoConsulta: string;
  estado: 'programada' | 'en_curso' | 'atendida' | 'cancelada' | 'no_asiste';
  prioridad: 'baja' | 'normal' | 'alta' | 'urgente';
  observaciones?: string;
  medico: string;
  telefonoEmergencia?: string;
  alergias?: string;
  medicamentosActuales?: string;
  antecedentes?: string;
}

// Mock data para pacientes del día
const pacientesDiaMock = [
  {
    id: '1',
    pacienteId: 'P001',
    nombres: 'María',
    apellidos: 'García López',
    documento: '12345678',
    telefono: '987654321',
    email: 'maria.garcia@email.com',
    fechaNacimiento: '1985-03-15',
    edad: 39,
    fechaCita: '2024-10-21',
    horaCita: '09:00',
    especialidad: 'Ginecología',
    motivoConsulta: 'Control prenatal - 20 semanas',
    estado: 'programada',
    prioridad: 'normal',
    observaciones: 'Primera consulta, traer ecografía anterior',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '987654322',
    alergias: 'Penicilina',
    medicamentosActuales: 'Ácido fólico, Hierro',
    antecedentes: 'Hipertensión familiar'
  },
  {
    id: '2',
    pacienteId: 'P002',
    nombres: 'Ana',
    apellidos: 'Rodríguez Silva',
    documento: '87654321',
    telefono: '912345678',
    email: 'ana.rodriguez@email.com',
    fechaNacimiento: '1990-07-22',
    edad: 34,
    fechaCita: '2024-10-21',
    horaCita: '09:30',
    especialidad: 'Ginecología',
    motivoConsulta: 'Dolor pélvico y flujo vaginal anormal',
    estado: 'en_curso',
    prioridad: 'alta',
    observaciones: 'Paciente con dolor intenso, priorizar atención',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '912345679',
    alergias: 'Ninguna',
    medicamentosActuales: 'Ibuprofeno',
    antecedentes: 'Cirugía apendicectomía 2015'
  },
  {
    id: '3',
    pacienteId: 'P003',
    nombres: 'Carmen',
    apellidos: 'López Torres',
    documento: '23456789',
    telefono: '923456789',
    email: 'carmen.lopez@email.com',
    fechaNacimiento: '1988-11-08',
    edad: 35,
    fechaCita: '2024-10-21',
    horaCita: '10:00',
    especialidad: 'Ginecología',
    motivoConsulta: 'PAP y colposcopia de seguimiento',
    estado: 'programada',
    prioridad: 'normal',
    observaciones: 'Seguimiento por resultado PAP anterior',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '923456790',
    alergias: 'Ninguna',
    medicamentosActuales: 'Ninguno',
    antecedentes: 'Antecedente familiar de cáncer de mama'
  },
  {
    id: '4',
    pacienteId: 'P004',
    nombres: 'Elena',
    apellidos: 'Fernández Ruiz',
    documento: '34567890',
    telefono: '934567890',
    email: 'elena.fernandez@email.com',
    fechaNacimiento: '1992-05-14',
    edad: 32,
    fechaCita: '2024-10-21',
    horaCita: '10:30',
    especialidad: 'Ginecología',
    motivoConsulta: 'Control post-parto',
    estado: 'programada',
    prioridad: 'normal',
    observaciones: '6 semanas post-parto, primera consulta',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '934567891',
    alergias: 'Ninguna',
    medicamentosActuales: 'Multivitamínico',
    antecedentes: 'Parto normal, sin complicaciones'
  },
  {
    id: '5',
    pacienteId: 'P005',
    nombres: 'Isabel',
    apellidos: 'Morales Castro',
    documento: '45678901',
    telefono: '945678901',
    email: 'isabel.morales@email.com',
    fechaNacimiento: '1987-09-03',
    edad: 37,
    fechaCita: '2024-10-21',
    horaCita: '11:00',
    especialidad: 'Ginecología',
    motivoConsulta: 'Consulta de fertilidad',
    estado: 'cancelada',
    prioridad: 'normal',
    observaciones: 'Cancelada por el paciente',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '945678902',
    alergias: 'Ninguna',
    medicamentosActuales: 'Ninguno',
    antecedentes: 'Intentos de embarazo por 2 años'
  },
  {
    id: '6',
    pacienteId: 'P006',
    nombres: 'Patricia',
    apellidos: 'Ruiz Herrera',
    documento: '56789012',
    telefono: '956789012',
    email: 'patricia.ruiz@email.com',
    fechaNacimiento: '1995-12-18',
    edad: 28,
    fechaCita: '2024-10-21',
    horaCita: '11:30',
    especialidad: 'Ginecología',
    motivoConsulta: 'Ecografía obstétrica',
    estado: 'programada',
    prioridad: 'normal',
    observaciones: '20 semanas de gestación, ecografía morfológica',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '956789013',
    alergias: 'Ninguna',
    medicamentosActuales: 'Ácido fólico, Calcio',
    antecedentes: 'Primer embarazo'
  },
  {
    id: '7',
    pacienteId: 'P007',
    nombres: 'Laura',
    apellidos: 'Hernández Vega',
    documento: '67890123',
    telefono: '967890123',
    email: 'laura.hernandez@email.com',
    fechaNacimiento: '1993-01-25',
    edad: 31,
    fechaCita: '2024-10-22',
    horaCita: '09:00',
    especialidad: 'Ginecología',
    motivoConsulta: 'Consulta por irregularidad menstrual',
    estado: 'programada',
    prioridad: 'normal',
    observaciones: 'Última menstruación hace 2 meses',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '967890124',
    alergias: 'Ninguna',
    medicamentosActuales: 'Ninguno',
    antecedentes: 'Ciclos irregulares desde adolescencia'
  },
  {
    id: '8',
    pacienteId: 'P008',
    nombres: 'Sofia',
    apellidos: 'Mendoza Díaz',
    documento: '78901234',
    telefono: '978901234',
    email: 'sofia.mendoza@email.com',
    fechaNacimiento: '1989-06-12',
    edad: 35,
    fechaCita: '2024-10-22',
    horaCita: '09:30',
    especialidad: 'Ginecología',
    motivoConsulta: 'Control de DIU',
    estado: 'programada',
    prioridad: 'normal',
    observaciones: 'DIU colocado hace 6 meses, control rutinario',
    medico: 'Dr. Carlos Sánchez',
    telefonoEmergencia: '978901235',
    alergias: 'Ninguna',
    medicamentosActuales: 'Ninguno',
    antecedentes: 'DIU Mirena colocado sin complicaciones'
  }
];

export default function PacientesDiaPage() {
  const [pacientes, setPacientes] = useState(pacientesDiaMock);
  const [filtroFecha, setFiltroFecha] = useState('hoy');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todos');
  const [filtroBusqueda, setFiltroBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<PacienteDia | null>(null);
  const [showDetallePaciente, setShowDetallePaciente] = useState(false);

  // Filtrar pacientes
  const pacientesFiltrados = pacientes.filter(paciente => {
    const hoy = new Date().toISOString().split('T')[0];
    const mañana = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const estaSemana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let cumpleFecha = true;
    if (filtroFecha === 'hoy') {
      cumpleFecha = paciente.fechaCita === hoy;
    } else if (filtroFecha === 'mañana') {
      cumpleFecha = paciente.fechaCita === mañana;
    } else if (filtroFecha === 'semana') {
      cumpleFecha = paciente.fechaCita >= hoy && paciente.fechaCita <= estaSemana;
    }

    const cumpleEstado = filtroEstado === 'todos' || paciente.estado === filtroEstado;
    const cumplePrioridad = filtroPrioridad === 'todos' || paciente.prioridad === filtroPrioridad;
    
    if (!cumpleFecha || !cumpleEstado || !cumplePrioridad) return false;
    
    if (filtroBusqueda) {
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        paciente.nombres.toLowerCase().includes(textoBusqueda) ||
        paciente.apellidos.toLowerCase().includes(textoBusqueda) ||
        paciente.documento.includes(textoBusqueda) ||
        paciente.motivoConsulta.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  // Estadísticas
  const estadisticas = {
    total: pacientesFiltrados.length,
    programadas: pacientesFiltrados.filter(p => p.estado === 'programada').length,
    enCurso: pacientesFiltrados.filter(p => p.estado === 'en_curso').length,
    canceladas: pacientesFiltrados.filter(p => p.estado === 'cancelada').length,
    altaPrioridad: pacientesFiltrados.filter(p => p.prioridad === 'alta').length,
    normalPrioridad: pacientesFiltrados.filter(p => p.prioridad === 'normal').length,
    hoy: pacientes.filter(p => p.fechaCita === new Date().toISOString().split('T')[0]).length,
    proximos: pacientes.filter(p => p.fechaCita > new Date().toISOString().split('T')[0]).length
  };

  const actualizarEstadoPaciente = (pacienteId: string, nuevoEstado: string) => {
    setPacientes(prev => prev.map(paciente => 
      paciente.id === pacienteId ? { ...paciente, estado: nuevoEstado } : paciente
    ));
  };

  const columnas: Columna<PacienteDia>[] = [
    {
      key: 'horaCita',
      titulo: 'Hora',
      sortable: true,
      width: '80px',
      render: (paciente: PacienteDia) => (
        <div className="text-sm">
          <div className="font-medium">{paciente.horaCita}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(paciente.fechaCita).toLocaleDateString('es-PE', { 
              day: '2-digit', 
              month: '2-digit' 
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'paciente',
      titulo: 'Paciente',
      render: (paciente: PacienteDia) => (
        <div>
          <div className="font-medium">{paciente.nombres} {paciente.apellidos}</div>
          <div className="text-xs text-muted-foreground">{paciente.documento} • {paciente.edad} años</div>
        </div>
      ),
    },
    {
      key: 'especialidad',
      titulo: 'Especialidad',
      render: (paciente: PacienteDia) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Stethoscope className="h-3 w-3 mr-1" />
          {paciente.especialidad}
        </Badge>
      ),
    },
    {
      key: 'motivoConsulta',
      titulo: 'Motivo',
      render: (paciente: PacienteDia) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium truncate">{paciente.motivoConsulta}</p>
          {paciente.observaciones && (
            <p className="text-xs text-muted-foreground truncate">{paciente.observaciones}</p>
          )}
        </div>
      ),
    },
    {
      key: 'prioridad',
      titulo: 'Prioridad',
      render: (paciente: PacienteDia) => {
        const colores: Record<string, string> = {
          alta: 'bg-red-100 text-red-800',
          normal: 'bg-green-100 text-green-800',
        };
        return (
          <Badge className={colores[paciente.prioridad]}>
            {paciente.prioridad === 'alta' ? (
              <AlertTriangle className="h-3 w-3 mr-1" />
            ) : (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {paciente.prioridad}
          </Badge>
        );
      },
    },
    {
      key: 'estado',
      titulo: 'Estado',
      render: (paciente: PacienteDia) => {
        const colores: Record<string, string> = {
          programada: 'bg-blue-100 text-blue-800',
          en_curso: 'bg-orange-100 text-orange-800',
          cancelada: 'bg-red-100 text-red-800',
        };
        return <Badge className={colores[paciente.estado]}>{paciente.estado.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (paciente: PacienteDia) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPacienteSeleccionado(paciente);
              setShowDetallePaciente(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          {paciente.estado === 'programada' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => actualizarEstadoPaciente(paciente.id, 'en_curso')}
            >
              <Clock className="h-3 w-3" />
            </Button>
          )}
          {paciente.estado === 'en_curso' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => actualizarEstadoPaciente(paciente.id, 'programada')}
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
          <h1 className="text-3xl font-bold text-foreground">Pacientes del Día</h1>
          <p className="text-muted-foreground">
            Lista de pacientes programados para atención médica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{estadisticas.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
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
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Curso</p>
                <p className="text-2xl font-bold text-orange-600">{estadisticas.enCurso}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
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
                <p className="text-sm text-muted-foreground">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.altaPrioridad}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Normal</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.normalPrioridad}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.hoy}</p>
              </div>
              <Timer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximos</p>
                <p className="text-2xl font-bold text-indigo-600">{estadisticas.proximos}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Fecha</Label>
              <Select value={filtroFecha} onValueChange={setFiltroFecha}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoy">Hoy</SelectItem>
                  <SelectItem value="mañana">Mañana</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridad</Label>
              <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente o motivo..."
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
                  setFiltroFecha('hoy');
                  setFiltroEstado('todos');
                  setFiltroPrioridad('todos');
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

      {/* Tabla de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {pacientesFiltrados.length} paciente{pacientesFiltrados.length !== 1 ? 's' : ''} encontrado{pacientesFiltrados.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={pacientesFiltrados as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={15}
            keyExtractor={(paciente: Record<string, unknown>) => paciente.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Detalle Paciente */}
      {showDetallePaciente && pacienteSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Detalle del Paciente
              </CardTitle>
              <CardDescription>Información completa del paciente y su cita</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información Personal</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nombre Completo</Label>
                    <p className="text-sm text-muted-foreground">{pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Documento</Label>
                    <p className="text-sm text-muted-foreground">{pacienteSeleccionado.documento}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Edad</Label>
                    <p className="text-sm text-muted-foreground">{pacienteSeleccionado.edad} años</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fecha de Nacimiento</Label>
                    <p className="text-sm text-muted-foreground">{new Date(pacienteSeleccionado.fechaNacimiento).toLocaleDateString('es-PE')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Teléfono</Label>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {pacienteSeleccionado.telefono}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {pacienteSeleccionado.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de la Cita */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información de la Cita</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Fecha y Hora</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pacienteSeleccionado.fechaCita).toLocaleDateString('es-PE')} - {pacienteSeleccionado.horaCita}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Especialidad</Label>
                    <p className="text-sm text-muted-foreground">{pacienteSeleccionado.especialidad}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Médico</Label>
                    <p className="text-sm text-muted-foreground">{pacienteSeleccionado.medico}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Estado</Label>
                    <Badge className={
                      pacienteSeleccionado.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                      pacienteSeleccionado.estado === 'en_curso' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {pacienteSeleccionado.estado.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prioridad</Label>
                    <Badge className={pacienteSeleccionado.prioridad === 'alta' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {pacienteSeleccionado.prioridad}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Motivo y Observaciones */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Motivo de Consulta</h3>
                <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{pacienteSeleccionado.motivoConsulta}</p>
                {pacienteSeleccionado.observaciones && (
                  <div className="mt-3">
                    <Label className="text-sm font-medium">Observaciones</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{pacienteSeleccionado.observaciones}</p>
                  </div>
                )}
              </div>

              {/* Información Médica */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información Médica</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Alergias</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-accent/50 rounded-lg">{pacienteSeleccionado.alergias}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Medicamentos Actuales</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-accent/50 rounded-lg">{pacienteSeleccionado.medicamentosActuales}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Antecedentes</Label>
                    <p className="text-sm text-muted-foreground p-2 bg-accent/50 rounded-lg">{pacienteSeleccionado.antecedentes}</p>
                  </div>
        <div>
                    <Label className="text-sm font-medium">Teléfono de Emergencia</Label>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {pacienteSeleccionado.telefonoEmergencia}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetallePaciente(false)}>
                  Cerrar
                </Button>
                {pacienteSeleccionado.estado === 'programada' && (
                  <Button onClick={() => {
                    actualizarEstadoPaciente(pacienteSeleccionado.id, 'en_curso');
                    setShowDetallePaciente(false);
                  }}>
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Atención
                  </Button>
                )}
                {pacienteSeleccionado.estado === 'en_curso' && (
                  <Button onClick={() => {
                    actualizarEstadoPaciente(pacienteSeleccionado.id, 'programada');
                    setShowDetallePaciente(false);
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
