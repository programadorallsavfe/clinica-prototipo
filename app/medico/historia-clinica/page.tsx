'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, Columna } from '@/components/data-table';
import { 
  FileText, Search, Filter, Eye, Edit, Plus, Calendar, Clock, 
  User, Stethoscope, HeartPulse, Pill, FlaskConical, Activity,
  RefreshCw, Download, AlertTriangle, CheckCircle, XCircle,
  Thermometer, Weight, Ruler, TrendingUp, TrendingDown
} from 'lucide-react';

// Tipos para la historia clínica
interface Paciente {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  genero: string;
  estadoCivil: string;
  ocupacion: string;
}

interface HistoriaClinica {
  id: string;
  pacienteId: string;
  fechaAtencion: string;
  horaInicio: string;
  horaFin: string;
  especialidad: string;
  medico: string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  signosVitales?: {
    presionArterial: string;
    frecuenciaCardiaca: number;
    temperatura: number;
    peso: number;
    talla: number;
    imc?: number;
  };
  medicamentos?: Array<{
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
  }>;
  examenes?: Array<{
    nombre: string;
    resultado: string;
    fecha: string;
  }>;
  examenFisico?: {
    cabeza: string;
    cuello: string;
    torax: string;
    abdomen: string;
    extremidades: string;
    neurologico: string;
  };
  indicaciones?: string;
  proximaCita?: string;
  examenesSolicitados?: Array<{
    nombre: string;
    fecha: string;
    observaciones?: string;
  }>;
}

// Mock data para historia clínica
const pacientesMock = [
  {
    id: '1',
    nombres: 'María',
    apellidos: 'García López',
    documento: '12345678',
    fechaNacimiento: '1985-03-15',
    telefono: '987654321',
    email: 'maria.garcia@email.com',
    direccion: 'Av. Principal 123, Lima',
    genero: 'F',
    estadoCivil: 'Casada',
    ocupacion: 'Profesora'
  },
  {
    id: '2',
    nombres: 'Ana',
    apellidos: 'Rodríguez Silva',
    documento: '87654321',
    fechaNacimiento: '1990-07-22',
    telefono: '912345678',
    email: 'ana.rodriguez@email.com',
    direccion: 'Jr. Libertad 456, Lima',
    genero: 'F',
    estadoCivil: 'Soltera',
    ocupacion: 'Ingeniera'
  },
  {
    id: '3',
    nombres: 'Carmen',
    apellidos: 'López Torres',
    documento: '23456789',
    fechaNacimiento: '1988-11-08',
    telefono: '923456789',
    email: 'carmen.lopez@email.com',
    direccion: 'Av. Universitaria 789, Lima',
    genero: 'F',
    estadoCivil: 'Divorciada',
    ocupacion: 'Contadora'
  }
];

const historiasClinicasMock = [
  {
    id: '1',
    pacienteId: '1',
    fechaAtencion: '2024-10-20',
    horaInicio: '09:00',
    horaFin: '09:30',
    especialidad: 'Ginecología',
    motivoConsulta: 'Control prenatal - 20 semanas',
    sintomas: 'Náuseas ocasionales, fatiga leve',
    examenFisico: {
      presionArterial: '120/80',
      frecuenciaCardiaca: '78',
      temperatura: '36.5°C',
      peso: '65 kg',
      talla: '165 cm',
      imc: '23.9'
    },
    diagnostico: 'Embarazo normal de 20 semanas',
    tratamiento: 'Ácido fólico 1mg/día, hierro 60mg/día',
    indicaciones: 'Continuar con controles mensuales, dieta balanceada',
    examenesSolicitados: ['Ecografía obstétrica', 'Hemograma completo'],
    proximaCita: '2024-11-20',
    medico: 'Dr. Carlos Sánchez',
    observaciones: 'Paciente en buen estado general, sin complicaciones'
  },
  {
    id: '2',
    pacienteId: '1',
    fechaAtencion: '2024-09-20',
    horaInicio: '10:00',
    horaFin: '10:25',
    especialidad: 'Ginecología',
    motivoConsulta: 'Control prenatal - 16 semanas',
    sintomas: 'Náuseas matutinas, aumento de apetito',
    examenFisico: {
      presionArterial: '118/78',
      frecuenciaCardiaca: '76',
      temperatura: '36.4°C',
      peso: '63 kg',
      talla: '165 cm',
      imc: '23.1'
    },
    diagnostico: 'Embarazo normal de 16 semanas',
    tratamiento: 'Ácido fólico 1mg/día, complejo vitamínico prenatal',
    indicaciones: 'Ejercicio moderado, evitar alimentos crudos',
    examenesSolicitados: ['Ecografía de segundo trimestre', 'Prueba de glucosa'],
    proximaCita: '2024-10-20',
    medico: 'Dr. Carlos Sánchez',
    observaciones: 'Desarrollo fetal normal, sin signos de alarma'
  },
  {
    id: '3',
    pacienteId: '2',
    fechaAtencion: '2024-10-18',
    horaInicio: '14:30',
    horaFin: '15:00',
    especialidad: 'Ginecología',
    motivoConsulta: 'Dolor pélvico y flujo vaginal anormal',
    sintomas: 'Dolor en bajo vientre, flujo amarillento, mal olor',
    examenFisico: {
      presionArterial: '110/70',
      frecuenciaCardiaca: '82',
      temperatura: '37.2°C',
      peso: '58 kg',
      talla: '160 cm',
      imc: '22.7'
    },
    diagnostico: 'Vaginitis bacteriana',
    tratamiento: 'Metronidazol 500mg cada 12h por 7 días',
    indicaciones: 'Evitar relaciones sexuales durante tratamiento, higiene íntima adecuada',
    examenesSolicitados: ['Cultivo vaginal', 'PAP test'],
    proximaCita: '2024-10-25',
    medico: 'Dr. Carlos Sánchez',
    observaciones: 'Paciente refiere mejoría con tratamiento, sin alergias conocidas'
  },
  {
    id: '4',
    pacienteId: '3',
    fechaAtencion: '2024-10-15',
    horaInicio: '11:00',
    horaFin: '11:35',
    especialidad: 'Ginecología',
    motivoConsulta: 'PAP y colposcopia de seguimiento',
    sintomas: 'Asintomática',
    examenFisico: {
      presionArterial: '125/85',
      frecuenciaCardiaca: '74',
      temperatura: '36.6°C',
      peso: '70 kg',
      talla: '168 cm',
      imc: '24.8'
    },
    diagnostico: 'PAP normal, colposcopia sin lesiones',
    tratamiento: 'Ninguno',
    indicaciones: 'Continuar con PAP anual, mantener hábitos saludables',
    examenesSolicitados: ['PAP test', 'Colposcopia'],
    proximaCita: '2025-10-15',
    medico: 'Dr. Carlos Sánchez',
    observaciones: 'Resultados normales, paciente en seguimiento por antecedente familiar'
  }
];

export default function HistoriaClinicaPage() {
  const [pacientes] = useState(pacientesMock);
  const [historias] = useState(historiasClinicasMock);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>('');
  const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState<HistoriaClinica | null>(null);
  const [showDetalleHistoria, setShowDetalleHistoria] = useState(false);

  // Filtrar historias por paciente seleccionado
  const historiasFiltradas = historias.filter(historia => {
    const cumplePaciente = !pacienteSeleccionado || historia.pacienteId === pacienteSeleccionado;
    
    if (!cumplePaciente) return false;
    
    if (filtroBusqueda) {
      const paciente = pacientes.find(p => p.id === historia.pacienteId);
      const textoBusqueda = filtroBusqueda.toLowerCase();
      return (
        paciente?.nombres.toLowerCase().includes(textoBusqueda) ||
        paciente?.apellidos.toLowerCase().includes(textoBusqueda) ||
        historia.motivoConsulta.toLowerCase().includes(textoBusqueda) ||
        historia.diagnostico.toLowerCase().includes(textoBusqueda)
      );
    }
    
    return true;
  });

  // Estadísticas del paciente seleccionado
  const estadisticasPaciente = pacienteSeleccionado ? {
    totalAtenciones: historias.filter(h => h.pacienteId === pacienteSeleccionado).length,
    ultimaAtencion: historias.filter(h => h.pacienteId === pacienteSeleccionado).sort((a, b) => new Date(b.fechaAtencion).getTime() - new Date(a.fechaAtencion).getTime())[0],
    primeraAtencion: historias.filter(h => h.pacienteId === pacienteSeleccionado).sort((a, b) => new Date(a.fechaAtencion).getTime() - new Date(b.fechaAtencion).getTime())[0],
    tiempoPromedio: historias.filter(h => h.pacienteId === pacienteSeleccionado).reduce((acc, h) => {
      const inicio = new Date(`2024-01-01 ${h.horaInicio}`);
      const fin = new Date(`2024-01-01 ${h.horaFin}`);
      return acc + (fin.getTime() - inicio.getTime()) / (1000 * 60);
    }, 0) / historias.filter(h => h.pacienteId === pacienteSeleccionado).length
  } : null;

  const columnas: Columna<HistoriaClinica>[] = [
    {
      key: 'fechaAtencion',
      titulo: 'Fecha',
      sortable: true,
      width: '120px',
      render: (historia: HistoriaClinica) => (
        <div className="text-sm">
          <div className="font-medium">
            {new Date(historia.fechaAtencion).toLocaleDateString('es-PE')}
          </div>
          <div className="text-xs text-muted-foreground">
            {historia.horaInicio} - {historia.horaFin}
          </div>
        </div>
      ),
    },
    {
      key: 'paciente',
      titulo: 'Paciente',
      render: (historia: HistoriaClinica) => {
        const paciente = pacientes.find(p => p.id === historia.pacienteId);
        return (
          <div>
            <div className="font-medium">{paciente ? `${paciente.nombres} ${paciente.apellidos}` : 'N/A'}</div>
            <div className="text-xs text-muted-foreground">{paciente?.documento || 'N/A'}</div>
          </div>
        );
      },
    },
    {
      key: 'especialidad',
      titulo: 'Especialidad',
      render: (historia: HistoriaClinica) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Stethoscope className="h-3 w-3 mr-1" />
          {historia.especialidad}
        </Badge>
      ),
    },
    {
      key: 'motivoConsulta',
      titulo: 'Motivo',
      render: (historia: HistoriaClinica) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium truncate">{historia.motivoConsulta}</p>
          <p className="text-xs text-muted-foreground truncate">{historia.sintomas}</p>
        </div>
      ),
    },
    {
      key: 'diagnostico',
      titulo: 'Diagnóstico',
      render: (historia: HistoriaClinica) => (
        <div className="max-w-xs">
          <p className="text-sm font-medium truncate">{historia.diagnostico}</p>
        </div>
      ),
    },
    {
      key: 'medico',
      titulo: 'Médico',
      render: (historia: HistoriaClinica) => (
        <div className="text-sm">
          <div className="font-medium">{historia.medico}</div>
        </div>
      ),
    },
    {
      key: 'acciones',
      titulo: 'Acciones',
      render: (historia: HistoriaClinica) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setHistoriaSeleccionada(historia);
              setShowDetalleHistoria(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historia Clínica</h1>
          <p className="text-muted-foreground">
            Historial completo de atenciones médicas de los pacientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Atención
          </Button>
        </div>
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
              <Label>Paciente</Label>
              <Select value={pacienteSeleccionado} onValueChange={setPacienteSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los pacientes</SelectItem>
                  {pacientes.map(paciente => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nombres} {paciente.apellidos} - {paciente.documento}
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
                  placeholder="Buscar por paciente, motivo o diagnóstico..."
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
                  setPacienteSeleccionado('');
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

      {/* Estadísticas del Paciente Seleccionado */}
      {estadisticasPaciente && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Atenciones</p>
                  <p className="text-2xl font-bold">{estadisticasPaciente.totalAtenciones}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Última Atención</p>
                  <p className="text-lg font-bold">{estadisticasPaciente.ultimaAtencion ? new Date(estadisticasPaciente.ultimaAtencion.fechaAtencion).toLocaleDateString('es-PE') : 'N/A'}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Primera Atención</p>
                  <p className="text-lg font-bold">{estadisticasPaciente.primeraAtencion ? new Date(estadisticasPaciente.primeraAtencion.fechaAtencion).toLocaleDateString('es-PE') : 'N/A'}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">{estadisticasPaciente.tiempoPromedio.toFixed(0)} min</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Historias Clínicas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Atenciones</CardTitle>
          <CardDescription>
            {historiasFiltradas.length} atención{historiasFiltradas.length !== 1 ? 'es' : ''} encontrada{historiasFiltradas.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={historiasFiltradas as unknown as Record<string, unknown>[]}
            columnas={columnas as unknown as Columna<Record<string, unknown>>[]}
            itemsPorPagina={10}
            keyExtractor={(historia: Record<string, unknown>) => historia.id as string}
          />
        </CardContent>
      </Card>

      {/* Modal Detalle Historia Clínica */}
      {showDetalleHistoria && historiaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalle de Historia Clínica
              </CardTitle>
              <CardDescription>Información completa de la atención médica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="examen">Examen Físico</TabsTrigger>
                  <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
                  <TabsTrigger value="tratamiento">Tratamiento</TabsTrigger>
                  <TabsTrigger value="examenes">Exámenes</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Fecha de Atención</Label>
                      <p className="text-sm text-muted-foreground">{new Date(historiaSeleccionada.fechaAtencion).toLocaleDateString('es-PE')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Horario</Label>
                      <p className="text-sm text-muted-foreground">{historiaSeleccionada.horaInicio} - {historiaSeleccionada.horaFin}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Especialidad</Label>
                      <p className="text-sm text-muted-foreground">{historiaSeleccionada.especialidad}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Médico</Label>
                      <p className="text-sm text-muted-foreground">{historiaSeleccionada.medico}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">Motivo de Consulta</Label>
                      <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{historiaSeleccionada.motivoConsulta}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium">Síntomas</Label>
                      <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{historiaSeleccionada.sintomas}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="examen" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <HeartPulse className="h-5 w-5 text-red-600" />
                      <div>
                        <Label className="text-sm font-medium">Presión Arterial</Label>
                        <p className="text-sm text-muted-foreground">{historiaSeleccionada.signosVitales?.presionArterial || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label className="text-sm font-medium">Frecuencia Cardíaca</Label>
                        <p className="text-sm text-muted-foreground">{historiaSeleccionada.signosVitales?.frecuenciaCardiaca || 'N/A'} lpm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <Thermometer className="h-5 w-5 text-orange-600" />
                      <div>
                        <Label className="text-sm font-medium">Temperatura</Label>
                        <p className="text-sm text-muted-foreground">{historiaSeleccionada.signosVitales?.temperatura || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <Weight className="h-5 w-5 text-green-600" />
                      <div>
                        <Label className="text-sm font-medium">Peso</Label>
                        <p className="text-sm text-muted-foreground">{historiaSeleccionada.signosVitales?.peso || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <Ruler className="h-5 w-5 text-purple-600" />
                      <div>
                        <Label className="text-sm font-medium">Talla</Label>
                        <p className="text-sm text-muted-foreground">{historiaSeleccionada.signosVitales?.talla || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <div>
                        <Label className="text-sm font-medium">IMC</Label>
                        <p className="text-sm text-muted-foreground">{historiaSeleccionada.signosVitales?.imc || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="diagnostico" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Diagnóstico Principal</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{historiaSeleccionada.diagnostico}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Observaciones</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{historiaSeleccionada.observaciones}</p>
                  </div>
                </TabsContent>

                <TabsContent value="tratamiento" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Tratamiento Prescrito</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{historiaSeleccionada.tratamiento}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Indicaciones</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">{historiaSeleccionada.indicaciones || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Próxima Cita</Label>
                    <p className="text-sm text-muted-foreground p-3 bg-accent/50 rounded-lg">
                      {historiaSeleccionada.proximaCita ? new Date(historiaSeleccionada.proximaCita).toLocaleDateString('es-PE') : 'N/A'}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="examenes" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Exámenes Solicitados</Label>
                    <div className="space-y-2 mt-2">
                      {historiaSeleccionada.examenesSolicitados?.map((examen, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-accent/50 rounded-lg">
                          <FlaskConical className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{examen.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetalleHistoria(false)}>
                  Cerrar
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}