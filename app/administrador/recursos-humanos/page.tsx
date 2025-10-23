"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Download,
  FileText,
  BarChart3,
  Calculator,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Target,
  Activity
} from 'lucide-react';

// Interfaces
interface Personal {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  cargo: 'medico' | 'enfermera' | 'tecnico' | 'administrativo' | 'recepcionista' | 'limpieza';
  especialidad?: string;
  colegioProfesional?: string;
  numeroColegiatura?: string;
  salario: number;
  codigoEssalud: string;
  afp: 'prima' | 'profuturo' | 'integra' | 'habitat';
  tipoContrato: 'plazo_fijo' | 'plazo_indefinido' | 'servicios_no_personales';
  estado: 'activo' | 'inactivo' | 'vacaciones' | 'licencia';
  horarioTrabajo: string;
  diasLaborales: string[];
}

interface Horario {
  id: string;
  personalId: string;
  diaSemana: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
  horaInicio: string;
  horaFin: string;
  tipo: 'normal' | 'extra' | 'guardia';
  activo: boolean;
}

interface Asistencia {
  id: string;
  personalId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string;
  horasTrabajadas: number;
  tardanza: number; // en minutos
  estado: 'presente' | 'tardanza' | 'falta' | 'licencia' | 'vacaciones';
  observaciones?: string;
}

interface Pago {
  id: string;
  personalId: string;
  mes: string;
  año: number;
  salarioBase: number;
  horasExtras: number;
  bonos: number;
  descuentos: number;
  afp: number;
  essalud: number;
  netoAPagar: number;
  estado: 'pendiente' | 'pagado' | 'procesado';
}

// Datos mock
const personalMock: Personal[] = [
  {
    id: '1',
    nombre: 'María',
    apellido: 'González',
    dni: '12345678',
    telefono: '987654321',
    email: 'maria.gonzalez@feminis.com',
    direccion: 'Av. Principal 123, Lima',
    fechaNacimiento: '1985-03-15',
    fechaIngreso: '2020-01-15',
    cargo: 'medico',
    especialidad: 'Ginecología y Obstetricia',
    colegioProfesional: 'Colegio Médico del Perú',
    numeroColegiatura: 'CMP-12345',
    salario: 8000,
    codigoEssalud: 'ESS-001',
    afp: 'prima',
    tipoContrato: 'plazo_indefinido',
    estado: 'activo',
    horarioTrabajo: 'Lunes a Viernes 8:00-17:00',
    diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    dni: '87654321',
    telefono: '987123456',
    email: 'carlos.mendoza@feminis.com',
    direccion: 'Jr. Salud 456, Lima',
    fechaNacimiento: '1990-07-22',
    fechaIngreso: '2021-06-01',
    cargo: 'tecnico',
    especialidad: 'Laboratorio Clínico',
    colegioProfesional: 'Colegio de Tecnólogos Médicos',
    numeroColegiatura: 'CTM-67890',
    salario: 3500,
    codigoEssalud: 'ESS-002',
    afp: 'profuturo',
    tipoContrato: 'plazo_indefinido',
    estado: 'activo',
    horarioTrabajo: 'Lunes a Sábado 7:00-15:00',
    diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  },
  {
    id: '3',
    nombre: 'Ana',
    apellido: 'Rodríguez',
    dni: '11223344',
    telefono: '987789123',
    email: 'ana.rodriguez@feminis.com',
    direccion: 'Av. Medicina 789, Lima',
    fechaNacimiento: '1988-11-10',
    fechaIngreso: '2019-09-15',
    cargo: 'enfermera',
    especialidad: 'Enfermería Obstétrica',
    colegioProfesional: 'Colegio de Enfermeros del Perú',
    numeroColegiatura: 'CEP-54321',
    salario: 2800,
    codigoEssalud: 'ESS-003',
    afp: 'integra',
    tipoContrato: 'plazo_indefinido',
    estado: 'activo',
    horarioTrabajo: 'Turnos rotativos 6:00-14:00 / 14:00-22:00',
    diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
  },
  {
    id: '4',
    nombre: 'Luis',
    apellido: 'Pérez',
    dni: '55667788',
    telefono: '987456789',
    email: 'luis.perez@feminis.com',
    direccion: 'Jr. Administración 321, Lima',
    fechaNacimiento: '1992-05-18',
    fechaIngreso: '2022-03-01',
    cargo: 'administrativo',
    salario: 2200,
    codigoEssalud: 'ESS-004',
    afp: 'habitat',
    tipoContrato: 'plazo_fijo',
    estado: 'activo',
    horarioTrabajo: 'Lunes a Viernes 9:00-18:00',
    diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
  }
];

const horariosMock: Horario[] = [
  {
    id: '1',
    personalId: '1',
    diaSemana: 'lunes',
    horaInicio: '08:00',
    horaFin: '17:00',
    tipo: 'normal',
    activo: true
  },
  {
    id: '2',
    personalId: '1',
    diaSemana: 'martes',
    horaInicio: '08:00',
    horaFin: '17:00',
    tipo: 'normal',
    activo: true
  }
];

const asistenciasMock: Asistencia[] = [
  {
    id: '1',
    personalId: '1',
    fecha: '2024-10-20',
    horaEntrada: '08:05',
    horaSalida: '17:10',
    horasTrabajadas: 9,
    tardanza: 5,
    estado: 'tardanza',
    observaciones: 'Llegó 5 minutos tarde'
  },
  {
    id: '2',
    personalId: '2',
    fecha: '2024-10-20',
    horaEntrada: '07:00',
    horaSalida: '15:00',
    horasTrabajadas: 8,
    tardanza: 0,
    estado: 'presente'
  }
];

const pagosMock: Pago[] = [
  {
    id: '1',
    personalId: '1',
    mes: 'Octubre',
    año: 2024,
    salarioBase: 8000,
    horasExtras: 400,
    bonos: 200,
    descuentos: 100,
    afp: 720,
    essalud: 400,
    netoAPagar: 7380,
    estado: 'pagado'
  }
];

export default function RecursosHumanosPage() {
  const [personal, setPersonal] = useState<Personal[]>(personalMock);
  const [horarios, setHorarios] = useState<Horario[]>(horariosMock);
  const [asistencias, setAsistencias] = useState<Asistencia[]>(asistenciasMock);
  const [pagos, setPagos] = useState<Pago[]>(pagosMock);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCargo, setFilterCargo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Estadísticas
  const totalPersonal = personal.length;
  const personalActivo = personal.filter(p => p.estado === 'activo').length;
  const totalSalarios = personal.reduce((sum, p) => sum + p.salario, 0);
  const promedioSalario = totalSalarios / totalPersonal;

  // Filtrar personal
  const personalFiltrado = personal.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.dni.includes(searchTerm);
    const matchesCargo = filterCargo === 'todos' || p.cargo === filterCargo;
    const matchesEstado = filterEstado === 'todos' || p.estado === filterEstado;
    return matchesSearch && matchesCargo && matchesEstado;
  });

  const getCargoBadge = (cargo: string) => {
    switch (cargo) {
      case 'medico':
        return <Badge variant="default" className="bg-primary text-primary-foreground">Médico</Badge>;
      case 'enfermera':
        return <Badge variant="default" className="bg-success text-success-foreground">Enfermera</Badge>;
      case 'tecnico':
        return <Badge variant="default" className="bg-info text-info-foreground">Técnico</Badge>;
      case 'administrativo':
        return <Badge variant="outline">Administrativo</Badge>;
      case 'recepcionista':
        return <Badge variant="default" className="bg-warning text-warning-foreground">Recepcionista</Badge>;
      case 'limpieza':
        return <Badge variant="secondary">Limpieza</Badge>;
      default:
        return <Badge variant="secondary">{cargo}</Badge>;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Activo</Badge>;
      case 'inactivo':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Inactivo</Badge>;
      case 'vacaciones':
        return <Badge variant="default" className="bg-info text-info-foreground"><Calendar className="h-3 w-3 mr-1" />Vacaciones</Badge>;
      case 'licencia':
        return <Badge variant="default" className="bg-warning text-warning-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Licencia</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getAFPBadge = (afp: string) => {
    switch (afp) {
      case 'prima':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Prima</Badge>;
      case 'profuturo':
        return <Badge variant="outline" className="border-green-500 text-green-600">Profuturo</Badge>;
      case 'integra':
        return <Badge variant="outline" className="border-purple-500 text-purple-600">Integra</Badge>;
      case 'habitat':
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Habitat</Badge>;
      default:
        return <Badge variant="secondary">{afp}</Badge>;
    }
  };

    return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Recursos Humanos
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestión de personal, horarios, asistencia y nómina
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <UserPlus className="h-4 w-4 mr-2" />
                Nuevo Personal
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Personal</p>
                  <p className="text-2xl font-bold text-primary">{totalPersonal}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Personal Activo</p>
                  <p className="text-2xl font-bold text-success">{personalActivo}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Salarios</p>
                  <p className="text-2xl font-bold text-warning">S/ {totalSalarios.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-info">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
        <div>
                  <p className="text-sm text-muted-foreground">Promedio Salario</p>
                  <p className="text-2xl font-bold text-info">S/ {promedioSalario.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Navegación */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Horarios</span>
            </TabsTrigger>
            <TabsTrigger value="asistencia" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Asistencia</span>
            </TabsTrigger>
            <TabsTrigger value="nomina" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Nómina</span>
            </TabsTrigger>
            <TabsTrigger value="reportes" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Reportes</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Personal */}
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle>Lista de Personal</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar personal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select value={filterCargo} onValueChange={setFilterCargo}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="enfermera">Enfermera</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="administrativo">Administrativo</SelectItem>
                        <SelectItem value="recepcionista">Recepcionista</SelectItem>
                        <SelectItem value="limpieza">Limpieza</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="vacaciones">Vacaciones</SelectItem>
                        <SelectItem value="licencia">Licencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Personal</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Especialidad</TableHead>
                        <TableHead>Salario</TableHead>
                        <TableHead>AFP</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {personalFiltrado.map((persona) => (
                        <TableRow key={persona.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold">{persona.nombre} {persona.apellido}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {persona.telefono}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {persona.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono">{persona.dni}</span>
                          </TableCell>
                          <TableCell>
                            {getCargoBadge(persona.cargo)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{persona.especialidad || '-'}</p>
                              {persona.numeroColegiatura && (
                                <p className="text-xs text-muted-foreground">{persona.numeroColegiatura}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-success" />
                              <span className="font-medium text-success">S/ {persona.salario.toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getAFPBadge(persona.afp)}
                          </TableCell>
                          <TableCell>
                            {getEstadoBadge(persona.estado)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Horarios */}
          <TabsContent value="horarios" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestión de Horarios</CardTitle>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Nuevo Horario
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-primary" />
                  <p className="text-lg font-medium mb-2">Módulo de horarios en desarrollo</p>
                  <p className="text-sm mb-4">Próximamente podrás gestionar horarios de trabajo y programación de turnos</p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Configurar Horarios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Asistencia */}
          <TabsContent value="asistencia" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Control de Asistencia</CardTitle>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Registrar Asistencia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Personal</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead>Horas Trabajadas</TableHead>
                        <TableHead>Tardanza</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {asistenciasMock.map((asistencia) => {
                        const persona = personal.find(p => p.id === asistencia.personalId);
                        return (
                          <TableRow key={asistencia.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {persona ? `${persona.nombre} ${persona.apellido}` : 'N/A'}
                            </TableCell>
                            <TableCell>{new Date(asistencia.fecha).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-success" />
                                <span className="font-medium">{asistencia.horaEntrada}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {asistencia.horaSalida ? (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-warning" />
                                  <span className="font-medium">{asistencia.horaSalida}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{asistencia.horasTrabajadas}h</span>
                            </TableCell>
                            <TableCell>
                              {asistencia.tardanza > 0 ? (
                                <Badge variant="destructive">
                                  {asistencia.tardanza} min
                                </Badge>
                              ) : (
                                <Badge variant="default" className="bg-success text-success-foreground">
                                  A tiempo
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {asistencia.estado === 'presente' ? (
                                <Badge variant="default" className="bg-success text-success-foreground">
                                  <CheckCircle className="h-3 w-3 mr-1" />Presente
                                </Badge>
                              ) : asistencia.estado === 'tardanza' ? (
                                <Badge variant="default" className="bg-warning text-warning-foreground">
                                  <AlertTriangle className="h-3 w-3 mr-1" />Tardanza
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" />Falta
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Nómina */}
          <TabsContent value="nomina" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Nómina de Pagos</CardTitle>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Calculator className="h-4 w-4 mr-2" />
                    Procesar Nómina
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Personal</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Salario Base</TableHead>
                        <TableHead>Horas Extras</TableHead>
                        <TableHead>Bonos</TableHead>
                        <TableHead>Descuentos</TableHead>
                        <TableHead>AFP</TableHead>
                        <TableHead>Essalud</TableHead>
                        <TableHead>Neto a Pagar</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagosMock.map((pago) => {
                        const persona = personal.find(p => p.id === pago.personalId);
                        return (
                          <TableRow key={pago.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              {persona ? `${persona.nombre} ${persona.apellido}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{pago.mes} {pago.año}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">S/ {pago.salarioBase.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-info">S/ {pago.horasExtras.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-success">S/ {pago.bonos.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-destructive">S/ {pago.descuentos.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-warning">S/ {pago.afp.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-warning">S/ {pago.essalud.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-bold text-success">S/ {pago.netoAPagar.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              {pago.estado === 'pagado' ? (
                                <Badge variant="default" className="bg-success text-success-foreground">
                                  <CheckCircle className="h-3 w-3 mr-1" />Pagado
                                </Badge>
                              ) : pago.estado === 'procesado' ? (
                                <Badge variant="default" className="bg-info text-info-foreground">
                                  <Activity className="h-3 w-3 mr-1" />Procesado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-warning text-warning">
                                  <Clock className="h-3 w-3 mr-1" />Pendiente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Reportes */}
          <TabsContent value="reportes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <FileText className="h-5 w-5" />
                    Reportes de Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Listado de Personal
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Personal por Especialidad
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Personal por Cargo
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Personal por AFP
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <BarChart3 className="h-5 w-5" />
                    Reportes de Asistencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Asistencia Diaria
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Asistencia Mensual
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Reporte de Tardanzas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reporte de Faltas
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <DollarSign className="h-5 w-5" />
                    Reportes de Nómina
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Banknote className="h-4 w-4 mr-2" />
                      Nómina Mensual
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Descuentos AFP/ONP
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Cálculo de CTS
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Bonos y Horas Extras
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Activity className="h-5 w-5" />
                    Reportes de Productividad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Productividad por Personal
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Horas Trabajadas
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Eficiencia Laboral
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Análisis de Costos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
        </div>
    );
}